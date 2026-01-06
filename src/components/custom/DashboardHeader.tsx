import React, { useEffect, useState } from 'react'
import MetricaLogo from './MetricaLogo'
import { H3 } from '../ui/typography'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useProjectsGlobal, useUserData } from '@/context/GlobalContext'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Clipboard, PlusSquare } from 'lucide-react'



const DashboardHeader = () => {
  const {userData, setUserData} = useUserData()
  const {ProjectsGlobal} = useProjectsGlobal()
  const [waitlistcount, setwaitlistcount] = useState(null)
  const [dropdownactiveid, setdropdownactiveid] = useState(undefined)

  useEffect(()=>{
const fetchCountofWaitlist = async()=>{
  if (userData?.roles?.includes('admin')) {
try {
      const waitlistserverresponse = await axios.get(`${import.meta.env.VITE_BACKEND}/metrica/waitlist`)
if (waitlistserverresponse.status === 200) {
  setwaitlistcount(waitlistserverresponse.data.length)
}
} catch (error) {
  toast('Error occured while getting waitlist count.')
}    
  }
}

fetchCountofWaitlist()
  }, [userData])


useEffect(() => {
  const activeproject = window.sessionStorage.getItem('ActiveProject');
  
  if (activeproject) {
    console.log("Active Project from Storage:", activeproject);
    console.log("Projects Global Data:", ProjectsGlobal)
setdropdownactiveid(ProjectsGlobal.filter(item => item._id === activeproject)[0]?._id)
  }
}, [ProjectsGlobal]);
  
  return (
    <div className='dashboard-header w-full border-b-1 border-b-gray-700/20 h-[60px] fixed  left-0 top-0 right-0 bg-white'>
        <div className='w-[100%] px-4  h-[60px] flex justify-between items-center m-auto '>
        <div className="flex items-center gap-4">
                    <MetricaLogo ></MetricaLogo>
                <H3>Metrica Cloud</H3>

                <div id="projectpicker" className='ml-4'>
                    <Select  onValueChange={(projectid)=>{location.href = `/switch?id=${projectid}`}}  value={dropdownactiveid}>
      <SelectTrigger className="w-[180px]">
        <SelectValue   placeholder="Select a project" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Projects</SelectLabel>
          {ProjectsGlobal?.map(item=>{
            return (
                      <SelectItem value={item._id}>{item.title}</SelectItem>

            )
          })}

          <Button className='w-full'><PlusSquare></PlusSquare> New Project</Button>
        </SelectGroup>
      </SelectContent>
    </Select>
                </div>
                </div>



                {/* right side */}

                <div className='flex gap-3 items-center h-fit'>
                  {userData?.roles?.includes('admin') && (
                    <Button className='mr-2' variant={'outline'}><Clipboard/>Waitlist({waitlistcount})</Button>
                  )}
  <div className="flex flex-col items-end h-auto">
    <p id="profileroles" className='text-sm'>{userData.roles}</p>
    <p id="profilename" className='text-xl font-semibold'>{userData.name}</p>
  </div>

  <Avatar className="h-[calc(1.25rem+1.75rem-5px)] w-auto"> {/* ručno kalkulisanje visine */}
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
</div>



    </div>
    </div>
    
  )
}

export default DashboardHeader