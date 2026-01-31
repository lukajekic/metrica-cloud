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
import { Clipboard, ClipboardIcon, LogOut, PlusSquare, SquareUserRound } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const DashboardHeader = () => {
  const {userData, setUserData, loading} = useUserData()
  const {ProjectsGlobal} = useProjectsGlobal()
  const [waitlistcount, setwaitlistcount] = useState(null)
  const [dropdownactiveid, setdropdownactiveid] = useState(undefined)
  const [demo, setDEMO] = useState(false)
  const [initials, setInitials] = useState('')
  useEffect(()=>{
if (loading === false) {
if (userData?.roles?.includes('demo')) {
  console.log('Korisnik je DEMO korisnik')
  setDEMO(true)

} else {
  console.log('Nije utvrdjeno da je trenutni korisnik DEMO.')
}
}
  }, [userData, loading])


  useEffect(()=>{
if (loading === false) {
  const name = userData.name
  const standardizes = name.replaceAll('-', ' ')
  console.log('stanrdazied:', standardizes)
  const words = standardizes.split(' ')
  console.log('Name words:', words)
  setInitials(`${words[0].charAt(0).toUpperCase() || ""} ${words.length > 1 ? words[words.length - 1].charAt(0).toUpperCase() || "" : ""}`)
}
  }, [userData])

  useEffect(()=>{
const fetchCountofWaitlist = async()=>{
  if (userData?.roles?.includes('admin')) {
try {
      const waitlistserverresponse = await axios.get(`${import.meta.env.VITE_BACKEND}/metrica/waitlist?status=waiting`)
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
  





const Logout = async() =>{
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/user/logout`)
    if (response.status === 200 ){
      toast.success("Logged out successfuly.")
      location.href = "/"
    } else{
      toast.error("Error while attempting logout.")
    }
  } catch (error) {
    toast.error("Error while attempting logout.")
  }
}



  return (
    <div className='dashboard-header w-full border-b-1 border-b-gray-700/20 h-[60px] fixed  left-0 top-0 right-0 bg-white'>
      {demo && (
        <div className="p-2 bg-yellow-600 fixed bottom-0 right-0 text-white font-semibold">DEMO INSTANCE</div>
      )}
        <div className='w-[100%] px-4  h-[60px] flex justify-between items-center m-auto '>
        <div  className="flex items-center gap-4 hover:cursor-pointer">
                    <span onClick={()=>{location.href = '/dashboard/home'}} className='flex gap-4 items-center'><MetricaLogo ></MetricaLogo>
                <H3>Metrica Cloud</H3></span>

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

          <Button className='w-full mt-2' onClick={()=>{location.href = '/dashboard/projects/create'}}><PlusSquare></PlusSquare> New Project</Button>
        </SelectGroup>
      </SelectContent>
    </Select>
                </div>
                </div>



          


{/* DROPDOWN */}
<DropdownMenu>
      
        <div  className='flex gap-3 items-center h-fit hover:cursor-pointer'>
                  {userData?.roles?.includes('admin') && (
                    <a onClick={(e)=>{e.stopPropagation()}} href="/dashboard/waitlist"><Button onClick={(e)=>{e.stopPropagation()}}  className='mr-2' variant={'outline'}><Clipboard/>Waitlist({waitlistcount})</Button></a>
                  )}
                  <DropdownMenuTrigger asChild>
  <div className="flex flex-col items-end h-auto">
    <div id="profileroles" className='text-sm flex inline-flex items-center gap-1'>{userData?.roles?.map((role, index) => {
      
      return (<span key={index} className='px-2 py-1/2 rounded bg-gray-100 border-1 border-gray-700/20'>{role.charAt(0).toUpperCase() + role.slice(1)}</span>)
    })}</div>
    <p id="profilename" className='text-xl font-semibold'>{userData?.name}</p>
  </div>
</DropdownMenuTrigger>
<DropdownMenuTrigger asChild>
  <Avatar className="h-[calc(1.25rem+1.75rem-5px)] w-auto">
    <AvatarImage />
    <AvatarFallback className='aspect-square text-center font-bold border-1 border-gray-700/20'><span className='mt-1'>{initials}</span></AvatarFallback>
  </Avatar>
  </DropdownMenuTrigger>
</div>
      
      <DropdownMenuContent className="w-40 mt-3" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={()=>{location.href = "/dashboard/profile"}} className='p-0'>
          <DropdownMenuLabel className='inline flex items-center gap-3 '><SquareUserRound className='size-5 text-gray-700'></SquareUserRound>My Profile</DropdownMenuLabel>
          </DropdownMenuItem>
   {userData?.roles?.includes('admin') && (
                    <DropdownMenuItem onClick={()=>{location.href = "/dashboard/waitlist"}} className='p-0'>
          <DropdownMenuLabel className='inline flex items-center gap-3 '><ClipboardIcon className='size-5 text-gray-700'></ClipboardIcon><span>Waitlist ({waitlistcount})</span></DropdownMenuLabel>
          </DropdownMenuItem>
                  )}
          
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={()=>{Logout()}} className='p-0'>
          <DropdownMenuLabel className='inline flex items-center gap-3 '><LogOut className='size-5 text-gray-700'></LogOut>Log Out</DropdownMenuLabel>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
      </DropdownMenuContent>
    </DropdownMenu>
{/* DROPDOWN END */}



    </div>
    </div>
    
  )
}

export default DashboardHeader