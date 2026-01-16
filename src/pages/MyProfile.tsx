



import DashboardBlock from '@/components/custom/DashboardBlock'
import DashboardHeader from '@/components/custom/DashboardHeader'
import DashboardPageTitle from '@/components/custom/DashboardPageTitle'
import MainContent from '@/components/custom/MainContent'
import { Button } from '@/components/ui/button'
import { H1, H2, H4, P } from '@/components/ui/typography'
import { useUserData } from '@/context/GlobalContext'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import axios from 'axios'
import { toast } from 'sonner'

const MyProfile = () => {
  const {userData, setUserData, loading} = useUserData()
const [progress, setProgress] = useState(0);
const holdDuration = 10000; // 10 seconds in ms
const intervalTime = 100; // update every 100ms
const [holdInterval, setHoldInterval] = useState<NodeJS.Timer | null>(null);
const [deletionID, setDeletionID] = useState("")
const [deleteModalView, setModalView] = useState("hold")
const [deletemOdalOpen, setDelteModalOpen] = useState(false)
const [otp, setOTP] = useState("")



const [projects, setProjects] = useState([])





const startHold = () => {
  const startTime = Date.now();
  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const percent = Math.min((elapsed / holdDuration) * 100, 100);
    setProgress(percent);

    if (percent >= 100) {
      clearInterval(interval);
      console.log("Hold complete! You can delete the project now.");
      setModalView("otp")
      setProgress(0)
      // Call your delete function here
    }
  }, intervalTime);
  setHoldInterval(interval);
};


useEffect(()=>{
 const deletefunc = async()=>{
  try {
    if (otp.length === 6 && deleteModalView === "otp") {
 const response = await axios.delete(`${import.meta.env.VITE_BACKEND}/metrica/project`, {
  data: {
    id: deletionID,
    otp: otp
  }
});

   if (response.status === 200) {
      location.reload()
    }
 }
  } catch (error) {
  if (error.response && error?.response?.data?.message) {
    toast.error(error?.response?.data?.message, {position: 'top-center'})
  }  else {
    toast.error("Error occured.", {position: "top-center"})
  }
  } 
 }

 deletefunc()
}, [deleteModalView, otp])

const stopHold = () => {
  if (holdInterval) {
    clearInterval(holdInterval);
    setHoldInterval(null);
  }
  setProgress(0);
};


useEffect(()=>{
const getProjects = async()=>{
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/project/get`)
    if (response.status === 200) {
      setProjects(response.data)
    }
  } catch (error) {
    toast.error("Couldn't fetch projects", {position: 'top-center'})
  }
}

getProjects()
}, [])



const [initials, setInitials] = useState("")
  useEffect(()=>{
   if(loading === false) {
     const name = userData.name
  const standardizes = name.replaceAll('-', ' ')
  console.log('stanrdazied:', standardizes)
  const words = standardizes.split(' ')
  console.log('Name words:', words)
  setInitials(`${words[0].charAt(0).toUpperCase() || ""} ${words.length > 1 ? words[words.length - 1].charAt(0).toUpperCase() || "" : ""}`)
   }
  }, [userData])
  return (
    <>
    <DashboardHeader></DashboardHeader>
    <MainContent>
        <DashboardPageTitle title='My Profile' subtitle='This is one place for all of your personal data and your projects.'></DashboardPageTitle>
        <div className="flex flex-col gap-10 ">
            <section id="personal">
            <DashboardBlock title='Personal Information'>
              <div className="flex gap-10 m-auto justify-start items-center my-5 ml-10">
<div className='w-35 h-35 bg-gray-100 border-1 border-[#cecece] rounded-[50%] text-4xl flex justify-center items-center'  id="avatar">
{initials}
</div>

<div id="info">
  <H2>{userData?.name}</H2>
  <H4>{userData?.projects?.length} Projects</H4>
{/*   <P>Joined on XX.XX.XXXX.</P>
 */}</div>
              </div>
            </DashboardBlock>
        </section>


        <section id="projects">
            <DashboardBlock title='Your Projects'>
              <div className="flex flex-col gap-3 mt-3">
                {projects.map((item)=>{
                return(
                  <div className="flex gap-3 border-1 rounded-xl flex justify-between items-center gap-5 p-5 w-full">
                <div className=" flex flex-col flex-1">
                  <p className='text-2xl font-bold'>{item?.title}</p>
                  <p className='text-gray-700'>{item?.allowedOrigin}</p>
                </div>

                <Button onClick={()=>{[setDeletionID(item._id), setDelteModalOpen(true)]}} variant={'ghost'} className='border-1 border-red-700 text-red-700 hover:bg-red-700 hover:text-white'><Trash></Trash> Delete Project</Button>
              </div>
                )
              })}
              </div>
              
            </DashboardBlock>
        </section>
        </div>
    </MainContent>


<Dialog open={deletemOdalOpen}>
      <form>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              {deleteModalView  === "hold" ? ("Hold button for 10 seconds to continue.") : deleteModalView === "otp" ? ("Enter 6 code OTP from your Authenticator App.") : ("")}
            </DialogDescription>
          </DialogHeader>


{deleteModalView ===  "hold" ? (<>
<Button onMouseDown={()=>{startHold()}} onMouseUp={()=>{stopHold()}} onMouseLeave={()=>{stopHold()}} variant={'destructive'} className='w-fit rounded-[10px] active:bg-red-800 border-red-600 border-3 active:border-red-900'><Trash></Trash>Hold for 10 seconds</Button>
<Progress className='bg-red-700/10 text-red-700 [&>*]:bg-red-700'  value={progress}></Progress>
</>) : deleteModalView === "otp" ? (<>
<InputOTP onChange={(e)=>{setOTP(e)}} maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
         <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
     
    </InputOTP>

</>) : (<></>)}




    
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={()=>{[setDelteModalOpen(false), setModalView('hold'), setDeletionID("")]}}>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>    </>
  )
}

export default MyProfile