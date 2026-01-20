import DashboardBlock from '@/components/custom/DashboardBlock'
import DashboardHeader from '@/components/custom/DashboardHeader'
import DashboardPageTitle from '@/components/custom/DashboardPageTitle'
import MainContent from '@/components/custom/MainContent'
import { H1, H2, H4, P } from '@/components/ui/typography'
import { ArrowUpToLine, IndentIncreaseIcon, Linkedin, Mail, MoveUpRight } from 'lucide-react'
import React, { useDeferredValue, useEffect, useState } from 'react'
import DoubleValueTrendCard from './DoubleValueTrendCard'
import DoubleValueAVGCard from './DoubleValueAVGCard'
import SingleValueCard from './SingleValueCard'
import axios from 'axios'
import { toast } from 'sonner'
import ContactPlaceholderCard from './ContactPlaceholderCard'

const DashboardEventTriggers = () => {

useEffect(()=>{
  getInitialData()
}, [])




//struktura funkcija:
//glavna funkcija za pribavljanje podataka
//children fukcije za svaki blok

const [initialData, setInitialData] = useState([])
const getInitialData = async()=>{
  try {
    const today = new Date()
    const threemonths_startdate = new Date()
    threemonths_startdate.setUTCHours(0,0,0,0)
    threemonths_startdate.setUTCDate(today.getUTCDate() - 89)
    const server_response = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/eventtrigger/data/get`, {
      projectID: sessionStorage.getItem('ActiveProject'),
      startdate: threemonths_startdate,
      enddate: null
    })

    if (server_response.status === 200) {
      console.log('Fetching OK')
      const data = server_response.data || []
      setInitialData(data)
      console.log('Main Data now is sent to micro functions.')
      getTodayViews()
    }
  } catch (error) {
    toast.error('Error Occured')
    console.log('DEV, Error while fetching Page Views Initial Data')
    console.error(error)
    location.href = '/'
  }
}

useEffect(()=>{
  getTodayViews()
  getWeeklyViews()
  getMonthViews()
  getWeekAG()
  getMonthAVG()
  getENGIndex()
  getMultiPageViews()
}, [initialData])



//first row micro functions
    //variables
    const [todayCardData, setTodayCardData] = useState({
      triggers: 0,
      uniqueTriggers: 0,
      trend: 0
    })

    const [weekCardData, setWeekCardData] = useState({
      triggers: 0,
      uniqueTriggers: 0,
      trend: 0
    })

    const [monthCardData, setMonthCardData] = useState({
      triggers: 0,
      uniqueTriggers: 0,
      trend: 0
    })





    const [thisWeekAVG, setThisWeekAVG] = useState({
      avg: 0,
      uniqueAVG: 0
    })

     const [thisMonthAVG, setThisMonthAVG] = useState({
      avg: 0,
      uniqueAVG: 0
    })


    const [ENGIndex, setENGIndex] = useState(0)
    const [MPViews, setMPViews] = useState(0)


    //micro functions

    const getTodayViews = () => {
      const today = new Date()
      const year = today.getUTCFullYear()
      const month = today.getUTCMonth()
      const date = today.getUTCDate()

      const filtered = initialData.filter(item => {
        const d = new Date(item.date)
        return (
          d.getUTCFullYear() === year &&
          d.getUTCMonth() === month &&
          d.getUTCDate() === date
        )
      })

//ok
      let TotalofTotal = 0
      let TotalofUnique = 0

      filtered.forEach(pageview => {
        const arrayofvalues = Object.values(pageview?.triggers)
        const sum1 = arrayofvalues.reduce((prev, current) => prev + current, 0)

        const arrayofvalues_unique = Object.values(pageview?.uniqueTriggers)
        const sum2 = arrayofvalues_unique.reduce((prev, current) => prev + current, 0)

        TotalofTotal += sum1
        TotalofUnique += sum2
      })

//ok




      const yesterday = new Date()
      yesterday.setUTCDate(yesterday.getUTCDate() - 1)

      const y_year = yesterday.getUTCFullYear()
      const y_month = yesterday.getUTCMonth()
      const y_date = yesterday.getUTCDate()

      const y_filtered = initialData.filter(item => {
        const d = new Date(item.date)
        return (
          d.getUTCFullYear() === y_year &&
          d.getUTCMonth() === y_month &&
          d.getUTCDate() === y_date
        )
      })
console.log("Juče filtrirano:", y_filtered);
//ok

      let totalYetserday = 0

      y_filtered.forEach(yesterdayitems => {
        const views = yesterdayitems?.triggers
        const viewsarr = Object.values(views)
        const tempsum = viewsarr.reduce((prev, curr) => prev + curr, 0)

        totalYetserday += tempsum

      })

      setTodayCardData({
        triggers: TotalofTotal,
        uniqueTriggers: TotalofUnique,
        trend: TotalofTotal - totalYetserday
      })

    }

  

    const getWeeklyViews = () => {
  


      const date_endOfWeekh0 = new Date()
date_endOfWeekh0.setUTCHours(23,59,59,999)
date_endOfWeekh0.setUTCDate(date_endOfWeekh0.getUTCDate() - 7)

      const filtered = initialData.filter(item => {
        const d = new Date(item.date)
        return (
          d >= date_endOfWeekh0
        )
      })

//ok
      let TotalofTotal = 0
      let TotalofUnique = 0

      filtered.forEach(pageview => {
        const arrayofvalues = Object.values(pageview?.triggers)
        const sum1 = arrayofvalues.reduce((prev, current) => prev + current, 0)

        const arrayofvalues_unique = Object.values(pageview?.uniqueTriggers)
        const sum2 = arrayofvalues_unique.reduce((prev, current) => prev + current, 0)

        TotalofTotal += sum1
        TotalofUnique += sum2
      })

//ok




     const startLastWeek = new Date()
startLastWeek.setUTCHours(0,0,0,0)
startLastWeek.setUTCDate(startLastWeek.getUTCDate() - 13)

const endLastWeek = new Date()
endLastWeek.setUTCHours(23,59,59,999)
endLastWeek.setUTCDate(endLastWeek.getUTCDate() - 7)

const lw_filtered = initialData.filter(item => {
  const d = new Date(item.date)
  return d >= startLastWeek && d <= endLastWeek
})


      console.log("Ova nedelja filtrirano:", filtered);

console.log("Prosla nedelja filtrirano:", lw_filtered);
//ok

      let total_lw = 0

      lw_filtered.forEach(lwitem => {
        const views = lwitem?.triggers
        const viewsarr = Object.values(views)
        const tempsum = viewsarr.reduce((prev, curr) => prev + curr, 0)

        total_lw += tempsum

      })

      setWeekCardData({
        triggers: TotalofTotal,
        uniqueTriggers: TotalofUnique,
        trend: TotalofTotal - total_lw
      })

    }







    
    const getMonthViews = () => {
  

     const date_endOfMonth0 = new Date()
date_endOfMonth0.setUTCHours(23,59,59,999)
date_endOfMonth0.setUTCDate(date_endOfMonth0.getUTCDate() - 30)

      const filtered = initialData.filter(item => {
        const d = new Date(item.date)
        return (
          d >= date_endOfMonth0
        )
      })

//ok
      let TotalofTotal = 0
      let TotalofUnique = 0

      filtered.forEach(pageview => {
        const arrayofvalues = Object.values(pageview?.triggers)
        const sum1 = arrayofvalues.reduce((prev, current) => prev + current, 0)

        const arrayofvalues_unique = Object.values(pageview?.uniqueTriggers)
        const sum2 = arrayofvalues_unique.reduce((prev, current) => prev + current, 0)

        TotalofTotal += sum1
        TotalofUnique += sum2
      })

//ok








     const startLastMonth = new Date()
startLastMonth.setUTCHours(0,0,0,0)
startLastMonth.setUTCDate(startLastMonth.getUTCDate() - 59)

const endLastMonth = new Date()
endLastMonth.setUTCHours(23,59,59,999)
endLastMonth.setUTCDate(endLastMonth.getUTCDate() - 30)


console.log(endLastMonth)
console.log(startLastMonth)

const lm_filtered = initialData.filter(item => {
  const d = new Date(item.date)
  return d >= startLastMonth && d <= endLastMonth
})


      console.log("Ovaj mesec filtrirano:", filtered);

console.log("Prosli mesec filtrirano:", lm_filtered);
//ok

      let total_lm = 0

      lm_filtered.forEach(lmitem => {
        const views = lmitem?.triggers
        const viewsarr = Object.values(views)
        const tempsum = viewsarr.reduce((prev, curr) => prev + curr, 0)

        total_lm += tempsum

      })

      setMonthCardData({
        triggers: TotalofTotal,
        uniqueTriggers: TotalofUnique,
        trend: TotalofTotal - total_lm
      })

    }










    const getWeekAG = () => {
  


      const date_endOfWeekh0 = new Date()
date_endOfWeekh0.setUTCHours(0,0,0,0)
date_endOfWeekh0.setUTCDate(date_endOfWeekh0.getUTCDate() - 6)

      const filtered = initialData.filter(item => {
        const d = new Date(item.date)
        return (
          d >= date_endOfWeekh0
        )
      })


      console.log('Ovonedeljni za Week AVG:', filtered)
//ok
      let TotalofTotal = 0
      let TotalofUnique = 0

      filtered.forEach(pageview => {
        const arrayofvalues = Object.values(pageview?.triggers)
        const sum1 = arrayofvalues.reduce((prev, current) => prev + current, 0)

        const arrayofvalues_unique = Object.values(pageview?.uniqueTriggers)
        const sum2 = arrayofvalues_unique.reduce((prev, current) => prev + current, 0)

        TotalofTotal += sum1
        TotalofUnique += sum2
      })

//ok





      setThisWeekAVG({
        avg: TotalofTotal / 7,
        uniqueAVG: TotalofUnique / 7
      })

    }





      const getMonthAVG = () => {
  


      const date_endOfMonth0 = new Date()
date_endOfMonth0.setUTCHours(0,0,0,0)
date_endOfMonth0.setUTCDate(date_endOfMonth0.getUTCDate() - 29)

      const filtered = initialData.filter(item => {
        const d = new Date(item.date)
        return (
          d >= date_endOfMonth0
        )
      })

//ok
      let TotalofTotal = 0
      let TotalofUnique = 0

      filtered.forEach(pageview => {
        const arrayofvalues = Object.values(pageview?.triggers)
        const sum1 = arrayofvalues.reduce((prev, current) => prev + current, 0)

        const arrayofvalues_unique = Object.values(pageview?.uniqueTriggers)
        const sum2 = arrayofvalues_unique.reduce((prev, current) => prev + current, 0)

        TotalofTotal += sum1
        TotalofUnique += sum2
      })

//ok





      setThisMonthAVG({
        avg: TotalofTotal / 30,
        uniqueAVG: TotalofUnique / 30
      })

    }




    const getENGIndex = ()=>{
      let TotalViews = 0
      let UniqueViews = 0

      initialData.forEach(pageview => {
        const single_views_arr = Object.values(pageview?.triggers || {})
        const single_q_views_arr = Object.values(pageview?.uniqueTriggers || {})

        TotalViews += single_views_arr.reduce((prev, curr)=>prev+curr,0)
        UniqueViews += single_q_views_arr.reduce((prev, curr)=>prev+curr,0)
      })


      const index = TotalViews / UniqueViews

      setENGIndex(index)
    }



    const getMultiPageViews = ()=>{
      let TotalViews = 0
      let UniqueViews = 0


      const date_endOfMonth0 = new Date()
date_endOfMonth0.setUTCHours(0,0,0,0)
date_endOfMonth0.setUTCDate(date_endOfMonth0.getUTCDate() - 29)

      const filtered = initialData.filter(item => {
        const d = new Date(item.date)
        return (
          d >= date_endOfMonth0
        )
      })


      filtered.forEach(pageview => {
        const single_views_arr = Object.values(pageview?.triggers || {})
        const single_q_views_arr = Object.values(pageview?.uniqueTriggers || {})

        TotalViews += single_views_arr.reduce((prev, curr)=>prev+curr,0)
        UniqueViews += single_q_views_arr.reduce((prev, curr)=>prev+curr,0)
      })

      const multipage = TotalViews - UniqueViews
      setMPViews(multipage)
    }


  return (
    <>
    <DashboardHeader></DashboardHeader>
    <MainContent enforceProtection>
      <DashboardPageTitle title='Event Triggers' subtitle='Base View of Total and Average Event Triggers'></DashboardPageTitle>
      <div className="w-full min-h-[calc(100vh-220px)] grid grid-cols-3 grid-rows-2 gap-4">


        <DoubleValueTrendCard title='Total Today' topTextValue={todayCardData.triggers?.toString()} BottomTextValue={todayCardData.uniqueTriggers?.toString()} trendValue={todayCardData.trend} trendComparison='Compared to Yesterday'></DoubleValueTrendCard>
        <DoubleValueTrendCard title='Total this Week' topTextValue={weekCardData.triggers?.toString()} BottomTextValue={weekCardData.uniqueTriggers?.toString()} trendValue={weekCardData.trend} trendComparison='Compared to Last Week'></DoubleValueTrendCard>
        <DoubleValueTrendCard title='Total this Month' topTextValue={monthCardData.triggers?.toString()} BottomTextValue={monthCardData.uniqueTriggers?.toString()} trendValue={monthCardData.trend} trendComparison='Compared to Last Month'></DoubleValueTrendCard>

       <ContactPlaceholderCard></ContactPlaceholderCard>
<DoubleValueAVGCard title='Week Average' topTextValue={thisWeekAVG.avg} BottomTextValue={thisWeekAVG.uniqueAVG}></DoubleValueAVGCard>
<DoubleValueAVGCard title='Month Average' topTextValue={thisMonthAVG.avg} BottomTextValue={thisMonthAVG.uniqueAVG}></DoubleValueAVGCard>


      </div>
    </MainContent>
    </>
  )
}

export default DashboardEventTriggers