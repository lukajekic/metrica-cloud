import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HardDrive } from 'lucide-react';
import { H3, H4, P } from '@/components/ui/typography';


const UserDataContext = createContext()

export function UserDataProvider({children}) {
    const [userData, setUserData] = useState({})
    const [loading, setLoading] = useState(true)
    const [openCSModal, setOpenCSModal] = useState(false)
      useEffect(() => {
    async function fetchUser() {
      const tiemout = setTimeout(() => {
          console.log('cold start')
          setOpenCSModal(true)
        }, 2500);
      try {
        
        const response = await axios.get(`${import.meta.env.VITE_BACKEND}/metrica/user/me`);
        if (response.status === 200) {
          clearTimeout(tiemout)
          setOpenCSModal(false)
          setUserData(response.data);
          setLoading(false)
        }
      } catch (error) {
        clearTimeout(tiemout)
          setOpenCSModal(false)
        console.error("Error fetching user data:", error);
        setLoading(false)
      }
    }

    fetchUser();
  }, []);
    return (<>
        <UserDataContext.Provider value={{userData, setUserData, loading}}>{children}</UserDataContext.Provider>









        <Dialog open={openCSModal}>
  
        <DialogContent className="sm:max-w-[425px]">
       
          <div className="flex flex-col gap-2 items-center">
            <HardDrive className='size-15'></HardDrive>

            <H3>Just a moment...</H3>
            <P className='text-center'>Metrica's free hosting is waking up, this window will close as soon as server is ready, after that you will have no delays.</P>
                      </div>
        </DialogContent>
    </Dialog>



        </>
    )
}

export const useUserData = ()=>{
    return useContext(UserDataContext)
}


const ProjectsGlobalContext = createContext()
export function ProjectsGlobalProvider({children}) {
  const [ProjectsGlobal, setProjectsGlobal] = useState([])
  useEffect(()=>{
   async function fetchProjects() {
     try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/project/get`)
      if (response.status === 200 && response.data && response.data.length > 0) {
        setProjectsGlobal(response.data)
      } else if (location.pathname !== '/project/create' && location.pathname.includes('dashboard')) {
        location.href = '/project/create'
      }
    } catch (error) {
      console.error(error)
      toast("Couldn't fetch Projects - ProjectsGlobalContext")
    }
   }

   fetchProjects()
  }, [])

  return <ProjectsGlobalContext.Provider value={{ProjectsGlobal, setProjectsGlobal}}>{children}</ProjectsGlobalContext.Provider>
}

export const useProjectsGlobal = ()=>{
  return useContext(ProjectsGlobalContext)
}