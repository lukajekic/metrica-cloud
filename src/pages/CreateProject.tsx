import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { H2, P } from '@/components/ui/typography'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const CreateProject = () => {

  const [projectData, setProjectData] = useState({
    license: "",
    title: "",
    allowedOrigin: "",
    sidebar: ['a']
  })

  const handleCreation = async()=>{
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/project`, projectData)

      if (response.status === 201) {
        console.log('OK')
        const data = response.data
        const apikey = data.apiKey
        window.open(`/apikeyprint?apikey=${apikey}`, '_blank')
        location.href = '/dashboard/home'
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(error?.response?.data?.message, {position: 'top-right'})
      } else {
        toast.error('Error occured', {position: 'top-right'})
      }
    }
  }
  return (
    <div className="h-screen w-full flex justify-between items-center fixed magicpattern px-15">

      <div className="h-fit p-5 flex flex-col gap-5">
        <H2>Crystal clear.</H2>
        <P className='max-w-100'>Metrica Cloud provides you helpful documentation to get started with tracking analytics, after you create project here, select it on home page or via dropdown located in the header and on the sidebar doucmenation button will appear.</P>
      </div>


      <div id="form_parent" className="p-10 bg-white border-1 border-gray-700/20 shadow-md rounded-2xl w-fit max-h-[calc(100vh-20px)] overflow-auto">
      <form action="" className='w-100' onSubmit={(e)=>{[e.preventDefault(), handleCreation()]}}>
        <FieldGroup className=''>
          <FieldSet>
            <FieldLegend>Your License</FieldLegend>
            <Input required type='text' className='w-full' value={projectData.license} onChange={(e)=>{setProjectData(prev => ({...prev, license: e.target.value}))}}></Input>
            <FieldDescription>Your License will be checked after you fill all fields.</FieldDescription>
          </FieldSet>


          <FieldSet>
            <FieldLegend>Project Title</FieldLegend>
            <Input required type='text' className='w-full' value={projectData.title} onChange={(e)=>{setProjectData(prev =>({...prev, title: e.target.value}))}}></Input>
            <FieldDescription></FieldDescription>
          </FieldSet>


          <FieldSet>
            <FieldLegend>Allowed Origin</FieldLegend>
            <Input required type='text' className='w-full' value={projectData.allowedOrigin} onChange={(e)=>{setProjectData(prev => ({...prev, allowedOrigin: e.target.value}))}}></Input>
            <FieldDescription>Enter Allowed Origin website in format: <strong>https://example.com</strong> - Starting with protocol and ending in TDL (without "/")</FieldDescription>
          </FieldSet>

      <Field orientation={'horizontal'}>
        <Button type='submit'>Create Project</Button>
      </Field>
        </FieldGroup>
      </form>
      </div>

      
    </div>
  )
}

export default CreateProject