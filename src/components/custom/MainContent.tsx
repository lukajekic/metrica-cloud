import React from 'react'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import { AppSidebar } from '../ui/app-sidebar'
import { Button } from '../ui/button'
import { Bolt, Cog, Crown, Eye, File, Layers, MapPin, Pointer, SquareDashedMousePointer, SquareUser, Star, TrendingUp } from 'lucide-react'
import { SidebarVisibility } from '@/utils/ShowSidebar'
import ProjectProtectionFunc from '@/utils/ProjectProtection'
interface Props {
    enforceProtection?: boolean,
    children?: React.ReactNode
}

type sidebarItem = {
    icon?: React.ReactNode,
    label: string,
    link: string,
    parent: string
}

const sidebarItems:sidebarItem[] = [
   {
    icon: <Eye></Eye>,
    label: 'Page Views',
    link: '/dashboard/page/views',
    parent: 'pages'
   },

   {
    icon: <MapPin></MapPin>,
    label: 'Geolocation',
    link: '/dashboard/page/geolocation',
    parent: 'pages'
   },

   {
    icon: <Crown></Crown>,
    label: 'Dominance',
    link: '/dashboard/page/dominance',
    parent: 'pages'
   },

   {
    icon: <Star></Star>,
    label: 'Top Pages',
    link: '/dashboard/page/top',
    parent: 'pages'
   },

   {
    icon: <TrendingUp></TrendingUp>,
    label: 'Trends',
    link: '/dashboard/pages/trends',
    parent: 'pages'
   },

   {
    icon: <Bolt></Bolt>,
    label: 'Configuration',
    link: '/dashboard/page/configuration',
    parent: 'pages'
   },





   {
    icon: <SquareDashedMousePointer></SquareDashedMousePointer>,
    label: 'Event Triggers',
    link: '/dashboard/event/triggers',
    parent: 'events'
   },

   {
    icon: <MapPin></MapPin>,
    label: 'Geolocation',
    link: '/',
    parent: 'events'
   },

   {
    icon: <Crown></Crown>,
    label: 'Dominance',
    link: '/',
    parent: 'events'
   },

   {
    icon: <Star></Star>,
    label: 'Top Pages',
    link: '/',
    parent: 'events'
   },

   {
    icon: <TrendingUp></TrendingUp>,
    label: 'Trends',
    link: '/',
    parent: 'events'
   },

   {
    icon: <Bolt></Bolt>,
    label: 'Configuration',
    link: '/dashboard/event/configuration',
    parent: 'events'
   },

]



const MainContent:React.FC<Props> = ({enforceProtection, children}) => {
    if (enforceProtection) {
        ProjectProtectionFunc()
    }
    const sidebarVisibility = SidebarVisibility()
  return (
    <div className='w-full pt-[60px] h-screen bg-green-200 flex flex-col'>
    {/* Glavni kontejner koji drži sidebar i content */}
    <div className="w-full flex flex-1 overflow-hidden">
        
        {/* Sidebar: h-full ovde znači visinu preostalog prostora */}
        {sidebarVisibility && (
            <div className="w-fit bg-white pr-4 pl-3  pt-4 h-full flex-shrink-0 border-r-1 border-r-gray-700/15 overflow-y-auto">
        




        <div className=' inline-flex items-center text-gray-700 gap-2 pb-5'><div className="p-1 rounded border-1"><Layers className='size-5'/></div>Pages</div>
       <div className="pl-7"> <div className="inline-grid grid-cols-1 gap-2">
            {sidebarItems.filter(item => item.parent === 'pages').map(item=>{
                return (
                    <Button onClick={()=>{location.href = item.link}} variant={'outline'} className={`flex justify-start ${item.link === location.pathname ? ('border-r-3 border-r-black') : ('')}`}>{item?.icon}{item.label}
                </Button>
                )
            })}
            
        </div>
        </div>





        <div className=' inline-flex items-center text-gray-700 gap-2 pb-5 mt-5'><div className="p-1 rounded border-1"><Pointer className='size-5'/></div>Events</div>
       <div className="pl-7"> <div className="inline-grid grid-cols-1 gap-2">
            {sidebarItems.filter(item => item.parent === 'events').map(item=>{
                return (
                    <Button onClick={()=>{location.href = item.link}} variant={'outline'} className={`flex justify-start ${item.link === location.pathname ? ('border-r-3 border-r-black') : ('')}`}>{item?.icon}{item.label}</Button>
                )
            })}
            
        </div>
        </div>


<div id="sidebarspacer" className='my-5 border-t-1 border-t-gray-700/20'></div>
<div className="flex flex-col gap-3">
    <Button onClick={()=>{location.href = '/dashboard/profile'}} variant={'outline'} className='flex justify-start'><SquareUser></SquareUser> My Profile</Button>
<a href="https://metrica-docs.gitbook.io/" target='_blank' className='flex justify-start'><Button variant={'outline'} className='w-full flex justify-start'><File></File> Documentation</Button></a>
</div>



        </div>
        )}

        {/* Content: overflow-y-auto omogućava skrolovanje samo ovog dela */}
        <div className="bg-white flex-1 h-full overflow-y-auto p-5">
            {children}
        </div>

    </div>
</div>
  )
}

export default MainContent