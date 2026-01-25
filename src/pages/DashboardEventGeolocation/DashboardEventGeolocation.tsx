import DashboardBlock from '@/components/custom/DashboardBlock'
import DashboardHeader from '@/components/custom/DashboardHeader'
import DashboardPageTitle from '@/components/custom/DashboardPageTitle'
import MainContent from '@/components/custom/MainContent'
import { H1, H4, P } from '@/components/ui/typography'
import React, { useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import axios from 'axios'
const data = {
  US: 100,
  RS: 50,
  FR: 75,
};
import moment from 'moment-timezone'
import MetricaTooltip from '@/components/custom/tooltip'
import { CountriesList } from '../../data/countries'
import geoUrl from '../../data/topojson.json'
import { scaleLinear } from 'd3-scale'
import {interpolateGreys } from 'd3-scale-chromatic'
import worldmapdata from '../../data/worldmap.json'



const DashboardEventGeolocation = () => {
    const [proposedFilter, setProposedFilter] = useState<string>()
    const [StatsCountryFilter, setStatsCountryFilter] = useState<string>('')
    const [mostPopular, setMostPopular] = useState('')
    const [pageViewsMain, setPageViewsMain] = useState([])
    const [todayStats, setTodayStats] = useState({
        total: 0,
        unique: 0,
        dateFancy: ""
    })
    const [weekStats, setWeekStats] = useState({
        total: 0,
        unique: 0,
        dateFancy: ""
    })

    const [monthStats, setMonthStats] = useState({
        total: 0,
        unique: 0,
        dateFancy: ""
    })




    //map variables
    const [countryDomination, setCountryDomination] = useState({})
    const [Map_ReadyToRender, set_Map_ReadyToRender] = useState(false)
    const [Map_ColorScale, set_Map_ColorScale] = useState()
    const m49ToAlpha2 = {};

worldmapdata.forEach(c => {
  m49ToAlpha2[c.m49code] = c.alpha2;
})

    useEffect(() => {
  if (!Object.keys(countryDomination).length) return

  const values = Object.values(countryDomination)
  const min = Math.min(...values)
  const max = Math.max(...values)

  const scale = scaleLinear()
    .domain([0, max || 1])
    .range([0.15, 1])

  set_Map_ColorScale(() => scale)
  set_Map_ReadyToRender(true)
}, [countryDomination])

    //map variales end
useEffect(()=>{
    console.log('DEV, UKUPNO PO DRZAVAMA')
    console.log(countryDomination)
}, [countryDomination])
    const getStats = async()=>{
        try {
            const firstdate = new Date()
            firstdate.setUTCHours(0,0,0,0)
            firstdate.setUTCDate(firstdate.getUTCDate() - 29)
            console.log(firstdate.toISOString())


            const lastdate = new Date()
            lastdate.setUTCHours(0,0,0,0)
            lastdate.setUTCDate(lastdate.getUTCDate())
            console.log(lastdate.toISOString())



            const weekdayDeadline = new Date()
            weekdayDeadline.setUTCHours(0,0,0,0)
            weekdayDeadline.setUTCDate(weekdayDeadline.getUTCDate() - 6)
            console.log(weekdayDeadline.toISOString())



            


            const response = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/eventtrigger/data/get`, {
                projectID: sessionStorage.getItem('ActiveProject'),
                startdate: firstdate,
                enddate: lastdate

            })

            console.log(response)

            const popular = DetermineMostPopular(response.data)
            console.log(popular)
            setMostPopular(popular.eventID)

            const monthstats = ProccessData(popular.eventID, response.data, firstdate )
            console.log('MESECNI:', monthstats)
setMonthStats({...monthstats, dateFancy: `${moment(firstdate).format('DD. MM. YYYY. HH:MM')} UTC`})
            const weekstats = ProccessData(popular.eventID, response.data, weekdayDeadline )
            console.log('NEDELJNI:', weekstats)
setWeekStats({...weekstats, dateFancy: `${moment(weekdayDeadline).format('DD. MM. YYYY. HH:MM')} UTC`})

            const dailystats = ProccessData(popular.eventID, response.data, lastdate )
            console.log('DNEVNI:', dailystats)
setTodayStats({...dailystats, dateFancy: `${moment(lastdate).format('DD. MM. YYYY. HH:MM')} UTC`})



let countrydominationlocal= {}
            response.data.forEach(pageview => {
                const views = pageview.triggers
                for (const country in views) {
                    if (countrydominationlocal[country]){
                        countrydominationlocal[country] += views[country]
                    } else {
                        countrydominationlocal[country] = views[country]
                    }
                }
            });

            setCountryDomination(countrydominationlocal)


        } catch (error) {
            
        }
    }


    const DetermineMostPopular = (data) =>{
        let pathsPopularity = {}
        for (const item of data) {
            let totalViewsSum = Object.values(item.triggers)
            if (!pathsPopularity[item.eventID]) {
            pathsPopularity[item.eventID] = [];
        }
            pathsPopularity[item.eventID] = pathsPopularity[item.eventID].concat(totalViewsSum)
        }

        for (const key in pathsPopularity) {
            pathsPopularity[key] = pathsPopularity[key].reduce((acc, current)=>{
                return acc+current
            }, 0)
        }

        const max=  Object.keys(pathsPopularity).reduce((acc, current)=>{
            return pathsPopularity[acc] > pathsPopularity[current] ? acc : current
        })
        const pathrelated = data.filter(item => item.eventID === max)
        const pagealias = pathrelated[0].title

        return {
            alias: pagealias || "Alias N/A",
            eventID: max || null
        }

    }

    const ProccessData = (eventID, data, startdate)=> {
        
        if (!eventID || !data || !startdate) {
            return {
  total: 0,
  unique: 0
}

        }

//doraditi obradu
let filtered = data.filter((item)=>{
    const itemDate = new Date(item.date);
    return item.eventID === eventID && itemDate >= startdate
})
let TotalViewsSum = 0
let UniqueViewssum = 0


 if (StatsCountryFilter) {
    filtered.forEach(pageview => {
        TotalViewsSum += pageview.triggers?.[StatsCountryFilter] ?? 0
        UniqueViewssum += pageview.uniqueTriggers?.[StatsCountryFilter] ?? 0
    })

 } else {
    filtered.forEach(pageview => { 
        const internalTotalSum = Object.values(pageview.triggers).reduce((prev,current)=>{ return prev+current }) 
        TotalViewsSum += internalTotalSum 
        const internalUniqueSum = Object.values(pageview.uniqueTriggers).reduce((prev,current)=>{ return prev+current }) 
        UniqueViewssum += internalUniqueSum });

 }

return {
    total: TotalViewsSum,
    unique: UniqueViewssum
}
    }



    useEffect(()=>{
        getStats()
    }, [StatsCountryFilter])


  return (
    <div id='dashboard-page-geolocation'>
        <DashboardHeader></DashboardHeader>
        <MainContent enforceProtection>
            <DashboardPageTitle title='Event Triggers Geolocation' subtitle='Analytics showing the origin countries of all event triggers for this project.'></DashboardPageTitle>
            <div className="w-full h-[calc(100vh-220px)] gap-10 grid grid-cols-2 gird-rows-1">
                <div className=" border-gray-700/20 rounded-lg flex flex-col gap-4">



                 <DashboardBlock tailwindHeight='h-fit' title='Filter Stats by Country'>
                            <P className='mt-2'>Select Country you want to filter 'Most Popular' statistics by.</P>
                            <div className="flex gap-4 items-center">
                                <div className="flex-1"><Select value={proposedFilter} onValueChange={(value)=>{setProposedFilter(value)}}>
      <SelectTrigger className="w-full mt-2">
        <SelectValue placeholder="Select a Country"  />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Countries</SelectLabel>
          {CountriesList.map(item =>{
            return (
                <SelectItem value={item.code}>{item.name}</SelectItem>
            )
          })}
        
 
        </SelectGroup>
      </SelectContent>
    </Select></div>

<div className="flex w-fit gap-3 items-center">
        <Button variant={'ghost'} onClick={()=>{[setProposedFilter(''), setStatsCountryFilter('')]}}>Clear Filters</Button>
        <Button onClick={()=>{setStatsCountryFilter(proposedFilter)}}>Apply</Button>
    </div>

                            </div>

    
                        </DashboardBlock>




                      <div className="border-1 border-gray-700/20 rounded-xl">
                      {/* mapa */}
                      {Map_ReadyToRender && (
  <>
    <ComposableMap>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const iso = m49ToAlpha2[geo.id]
            const value = countryDomination[iso] ?? 0

            const fillColor = Map_ColorScale
              ? interpolateGreys(Map_ColorScale(value))
              : "#eee"

            return (
              <Geography
                key={geo.id}
                geography={geo}
                fill={fillColor}
                data-tooltip-id="map-tooltip"
                data-tooltip-content={`${geo.properties.name}: ${value}`}
              />
            )
          })
        }
      </Geographies>
    </ComposableMap>

    <Tooltip id="map-tooltip" />
  </>
)}

                      {/* kraj mape */}
                     </div>
                </div>
                <div className=" grid grid-cols-4 grid-rows-4 gap-4">




                    <div className="col-span-4 row-span-2">
                        <DashboardBlock tailwindHeight='h-full' title={`Most Popular Today ${StatsCountryFilter ? (`(${StatsCountryFilter})`) : ('')}`}>
                            <div className="flex flex-col gap-2 h-full justify-evenly">
                                <H4 className='hidden'>Page Title</H4>
                                <a href="/dashboard/home" className='focusable-link flex items-end gap-2 w-fit'>
                                <H1>{todayStats.total}</H1>
                                <P>Triggers</P>
                                </a>

                                <a href="/dashboard/home" className='focusable-link flex items-end gap-2 w-fit'>
                            <H1>{todayStats.unique}</H1>
                                <P>Unique triggers</P>
                                </a>

                                <P className='inline-flex items-center gap-2'>Calculated since {todayStats.dateFancy}<span><MetricaTooltip text='Based on your globally most popular event, filtered by your selected country.'></MetricaTooltip></span></P>
                            </div>
                        </DashboardBlock>
                    </div>





                    <div className="col-span-2 row-span-2">
                        <DashboardBlock tailwindHeight='h-full' title={`Most Popular last 7 Days ${StatsCountryFilter ? (`(${StatsCountryFilter})`) : ('')}`}>
                            <div className="flex flex-col gap-2 h-full justify-evenly">
                                <H4 className='hidden'>Page Title</H4>
                                <a href="/dashboard/home" className='focusable-link flex items-end gap-2 w-fit'>
                                <H1>{weekStats.total}</H1>
                                <P>Triggers</P>
                                </a>

                                <a href="/dashboard/home" className='focusable-link flex items-end gap-2 w-fit'>
                                <H1>{weekStats.unique}</H1>
                                <P>Unique triggers</P>
                                </a>

                                <P className='inline-flex items-center gap-2'>Calculated since {weekStats.dateFancy}<span><MetricaTooltip text='Based on your globally most popular event, filtered by your selected country.'></MetricaTooltip></span></P>
                            </div>
                        </DashboardBlock>
                    </div>





                    <div className="col-span-2 row-span-2">
                        <DashboardBlock tailwindHeight='h-full' title={`Most Popular last 30 Days ${StatsCountryFilter ? (`(${StatsCountryFilter})`) : ('')}`}>
                            <div className="flex flex-col gap-2 h-full justify-evenly">
                                <H4 className='hidden'>Page Title</H4>
                                <a href="/dashboard/home" className='focusable-link flex items-end gap-2 w-fit'>
                                <H1>{monthStats.total}</H1>
                                <P>Triggers</P>
                                </a>

                                <a href="/dashboard/home" className='focusable-link flex items-end gap-2 w-fit'>
                                <H1>{monthStats.unique}</H1>
                                <P>Unique triggers</P>
                                </a>

                                <P className='inline-flex items-center gap-2'>Calculated since {monthStats.dateFancy}<span><MetricaTooltip text='Based on your globally most popular event, filtered by your selected country.'></MetricaTooltip></span></P>
                            </div>
                        </DashboardBlock>
                    </div>





                    




                </div>
            
            </div>
        </MainContent>
    </div>
  )
}

export default DashboardEventGeolocation