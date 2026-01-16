import DashboardHeader from '@/components/custom/DashboardHeader'
import DashboardPageTitle from '@/components/custom/DashboardPageTitle'
import MainContent from '@/components/custom/MainContent'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckIcon, Info, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'
import { H3 } from '@/components/ui/typography'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import emailjs from 'emailjs-com';
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
const Waitlist = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
const getData = async()=>{
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND}/metrica/waitlist?status=waiting`)

        if (response.status === 200) {
            const mapped = response.data.map(item =>({
                ...item,
                actions: (
                    <div className='flex items-center gap-2'>
                    <Button onClick={()=>{StatusChange(item._id, 'declined', item.email)}} className='bg-red-600 hover:bg-red-700'><XIcon></XIcon></Button>
                    <Button onClick={()=>{StatusChange(item._id, 'accepted', item.email, item.placeholderLicense)}} className='bg-green-600 hover:bg-green-700'><CheckIcon></CheckIcon></Button>
                </div>
                )
            }))

            console.log(mapped)
            setData(mapped)
        }
    } catch (error) {
        toast.error("Couldn't fetch Waitlist data.")
    }
}




const StatusChange = async (ID: string, status: 'accepted' | 'declined',  email:string, license?:string) => {
    try {
        setLoading(true)
setTimeout(async() => {
    if (status === 'accepted') {
    let templateParams = {
  email: email,
  license: license
}



await emailjs.send('service_s2wf7m6', 'template_bd86vmz', templateParams).then(
  (response) => {
    console.log('SUCCESS!', response.status, response.text);
  },
  (error) => {
    console.log('FAILED...', error);
    setLoading(false)
    return
  },
)


} else if (status === 'declined') {
    let templateParams = {
  email: email
}



await emailjs.send('service_s2wf7m6', 'template_p6e7jmk', templateParams).then(
  (response) => {
    console.log('SUCCESS!', response.status, response.text);
  },
  (error) => {
    console.log('FAILED...', error);
    setLoading(false)
    return
  },
)


}
        


        const response = await axios.put(`${import.meta.env.VITE_BACKEND}/metrica/waitlist/status`, {
            waitlistID: ID,
            status: status
        })

        if (response.status === 200) {
            getData()
            setLoading(false)
        }
}, 0);
    } catch (error) {
        setLoading(false)
     toast.error("Couldn't proccess status change")   
     console.log(error)
    }
} 

useEffect(()=>{
       emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY_2)

getData()
}, [])

  return (
    <>
    <DashboardHeader></DashboardHeader>
    <MainContent>
        <DashboardPageTitle title='Waitlist' subtitle='Approve or decline early access requests'></DashboardPageTitle>
        <Alert className='w-fit m-auto'>
            <Info></Info>
            <AlertTitle className='font-bold'>Notice</AlertTitle>
            <AlertDescription>For any status change of application, user will be contacted with updated status, and if accepted, it's License Key, ready for Sign Up.</AlertDescription>
        </Alert>

<H3 className='w-200 m-auto mt-5'>Applications</H3>
        <div className="w-200 m-auto mt-5">
            <DataTable columns={columns} data={data}></DataTable>
        </div>
    </MainContent>


    <Dialog  open={loading}>
        <DialogContent className='[&>button]:hidden w-fit'>
                    <Spinner className='size-8'></Spinner>

        </DialogContent>
    </Dialog>
    </>
  )
}

export default Waitlist