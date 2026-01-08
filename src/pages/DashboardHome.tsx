import DashboardBlock from '@/components/custom/DashboardBlock'
import DashboardHeader from '@/components/custom/DashboardHeader'
import DashboardPageTitle from '@/components/custom/DashboardPageTitle'
import MainContent from '@/components/custom/MainContent'
import { Button } from '@/components/ui/button'
import { useProjectsGlobal, useUserData } from '@/context/GlobalContext'
import React from 'react'

const DashboardHome = () => {
      const {ProjectsGlobal} = useProjectsGlobal()

  return (
    <div id='dashboard-home' className='max-w'>
        <DashboardHeader></DashboardHeader>
        <MainContent > {/* nema project protection jer ne zhteva projekat */}
          <DashboardPageTitle title='My Projects' subtitle='Select a Project to expand options.'></DashboardPageTitle>
          <div className="grid grid-cols-4 gap-5">
            {ProjectsGlobal.map(item=>{
              return (
                <DashboardBlock title={item.title}>
                  <Button className='mt-2' onClick={()=>{location.href = `/switch?id=${item._id}`}}>Select this project</Button>
                </DashboardBlock>
              )
            })}
          </div>
        </MainContent>
    </div>
  )
}

export default DashboardHome