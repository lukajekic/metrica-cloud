import DashboardHeader from '@/components/custom/DashboardHeader'
import DashboardPageTitle from '@/components/custom/DashboardPageTitle'
import MainContent from '@/components/custom/MainContent'
import React, { useEffect, useState } from 'react'
import { DataTable } from './data-table'


import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import DashboardBlock from '@/components/custom/DashboardBlock'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon, FunnelPlus } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { set } from 'date-fns'
import { columns } from './columns'



const DashboardPagesTop = () => {
const [globalPagesData, setGlobalPagesData] = useState([])


const now = new Date()

const todayUTC = new Date(Date.UTC(
  now.getUTCFullYear(),
  now.getUTCMonth(),
  now.getUTCDate(),
  0, 0, 0, 0
))



const monthbefore = new Date()
monthbefore.setDate(now.getDate() - 29)

const monthbeforeUTC = new Date(Date.UTC(
  monthbefore.getUTCFullYear(),
  monthbefore.getUTCMonth(),
  monthbefore.getUTCDate(),
  0, 0, 0, 0
))


  




      const [open1, setOpen1] = React.useState(false)
  const [date1, setDate1] = React.useState<Date | undefined>(monthbefore)
      const [open2, setOpen2] = React.useState(false)
  const [date2, setDate2] = React.useState<Date | undefined>(now)



const [data, setData] = useState([])
const [tabelOptimizedData, setTableOptimizedData] = useState([]) //IMPORTANT, FINAL TABLE DATA
  const getAndProcessData = async(startdate, enddate)=>{
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/pageview/data/get`, {
            projectID: sessionStorage.getItem('ActiveProject'),
            startdate: startdate,
            enddate: enddate
        })

        if (response.status === 200) {
setData(response.data)
        }
    } catch (error) {
        toast.error("Couldn't fecth analytics.")
    }
  }

  useEffect(()=>{
    const getPagesData = async()=>{
        try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/page/get`, {
            projectID: sessionStorage.getItem('ActiveProject')
        })

        if (response.status === 200) {
            let pathToTitleMap = Object.fromEntries(response.data.map(item=>[item.path, item.title]))
            setGlobalPagesData(pathToTitleMap)

        }
        } catch (error) {
            toast.error("Error on mapping oages to key value OBJ.")
        }
    }

    getPagesData()
    getAndProcessData(monthbeforeUTC, todayUTC)
  }, [])



  useEffect(()=>{


const proccessTableDat = ()=>{
    let allpaths = data.map(item => item.path)
    let uniquepaths = [...new Set(allpaths)]

let viewsPerPath = {}
let uq_viewsPerPath = {}

    uniquepaths.forEach(path =>{
        const allpathdata = data.filter(item => item.path === path)
        let totalviews = 0
        let totalunique = 0

        allpathdata.forEach(itemw=>{
            const sum = Object.values(itemw.views).reduce((acc, curr)=>acc+curr,0)
            const sum2 = Object.values(itemw.uniqueViews).reduce((acc, curr)=>acc+curr,0)
            totalviews += sum
            totalunique += sum2
        })

viewsPerPath[path] = (viewsPerPath[path] || 0) + totalviews
uq_viewsPerPath[path] = (uq_viewsPerPath[path] || 0) + totalunique

    })






        let tableData = Object.entries(viewsPerPath)
  .map(([key, value]) => ({
    path: key,
    views: value,
    title: globalPagesData[key],
    uniqueViews: uq_viewsPerPath[key]
  }))
  .sort((a, b) => b.views - a.views)
  .map((item, index) => ({
    index: index + 1,
    ...item
  }))

        console.log(tableData)

        setTableOptimizedData(tableData)

}

proccessTableDat()


  }, [data, globalPagesData])

  return (
    <>
    <DashboardHeader></DashboardHeader>
    <MainContent enforceProtection>
        <DashboardPageTitle title='Top Pages' subtitle='View your most viewed Pages'></DashboardPageTitle>
        <DashboardBlock>
            <div className="flex gap-3 items-end">
               {/*  CAL 1 */}

                <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        From
      </Label>
      <Popover open={open1} onOpenChange={setOpen1}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date1 ? date1.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date1}
            captionLayout="dropdown"
            onSelect={(date) => {
  if (!date) return

  const utcStartOfDay = new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0, 0, 0, 0
  ))


  setDate1(utcStartOfDay)
  setOpen1(false)
}}

          />
        </PopoverContent>
      </Popover>
    </div>

    {/* CAL 1 END */}









    {/*  CAL 2 */}

                <div className="flex flex-col gap-3">
      <Label htmlFor="date2" className="px-1">
        To
      </Label>
      <Popover open={open2} onOpenChange={setOpen2}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date2"
            className="w-48 justify-between font-normal"
          >
            {date2 ? date2.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date2}
            captionLayout="dropdown"
             onSelect={(date) => {
  if (!date) return

  const utcStartOfDay = new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0, 0, 0, 0
  ))


  setDate2(utcStartOfDay)
  setOpen2(false)
}}
          />
        </PopoverContent>
      </Popover>
    </div>

    <Button onClick={()=>{getAndProcessData(date1, date2)}}><FunnelPlus></FunnelPlus>Apply Filters</Button>

    {/* CAL 2 END */}
            </div>
        </DashboardBlock>
        <div className="mt-5">
            <DashboardBlock >
            <DataTable data={tabelOptimizedData} columns={columns}></DataTable>
        </DashboardBlock>
        </div>
    </MainContent>
    </>
  )
}

export default DashboardPagesTop