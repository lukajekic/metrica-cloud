import { useUserData } from "@/context/GlobalContext"
import { useEffect } from "react"

export function ProjectProtectionFunc():void  {
    const {userData, loading} = useUserData()
    useEffect(()=>{
        if (loading === false) {
            console.log('Ispunjeni su uslovi za project protection pokretanje')
            const projectID = sessionStorage.getItem('ActiveProject')
    const path = window.location.pathname
    const usersprojets = userData?.projects
    let projectowner:boolean = null
    
    if (!projectID && path.includes('dashboard') && path !== '/dashboard/home') {
        sessionStorage.setItem('ActiveProject', '')
        console.warn('Force returning to dashboard home, reason: Trying to access project ID depedendent pages without selected project in  session storage')
        window.location.href = '/dashboard/home'
    } else if (projectID) {
        projectowner = usersprojets?.includes(projectID)
        if (!projectowner && path.includes('dashboard') && path !== '/dashboard/home') {
            console.log(usersprojets)
            sessionStorage.setItem('ActiveProject', '')
                    console.warn('Force returning to dashboard home, reason: Trying to access project ID depedendent pages with invalid project ID or project with other owner.')

            window.location.href = '/dashboard/home'
        } else {
            console.log('Apsolutno svi uslovi ActiveProjecta zadovoljili su ovu ActiveProject dependent stranicu.')
        }
    }
        } else {
            console.log('Desila se promena koje je bila okidac za projectprotection, medjutim nije gotovo ucitavanje.')
        }
    }, [userData, loading])
}


export default ProjectProtectionFunc