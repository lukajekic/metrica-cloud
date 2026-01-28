import DashboardBlock from '@/components/custom/DashboardBlock'
import DashboardHeader from '@/components/custom/DashboardHeader'
import DashboardPageTitle from '@/components/custom/DashboardPageTitle'
import MainContent from '@/components/custom/MainContent'
import { Button } from '@/components/ui/button'
import { useProjectsGlobal, useUserData } from '@/context/GlobalContext'
import React from 'react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ArrowUpRightIcon, FolderCodeIcon } from 'lucide-react'
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

            {ProjectsGlobal.length === 0 && 
            <Empty className='w-[calc(100vw-250px)]'>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCodeIcon />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You haven't created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button onClick={()=>{location.href = "/dashboard/projects/create"}}>Create Project</Button>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="https://metrica-docs.gitbook.io/" target='_blank'>
          Learn More <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
            }
          </div>
        </MainContent>
    </div>
  )
}

export default DashboardHome