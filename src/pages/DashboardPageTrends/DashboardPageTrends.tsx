import DashboardBlock from '@/components/custom/DashboardBlock'
import DashboardHeader from '@/components/custom/DashboardHeader'
import DashboardPageTitle from '@/components/custom/DashboardPageTitle'
import MainContent from '@/components/custom/MainContent'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React, { useEffect, useRef, useState } from 'react'
import { CountriesList } from '@/data/countries'
import { Button } from '@/components/ui/button'
import { FunnelPlus, FunnelX, User } from 'lucide-react'



/* CHART IMPORTS */
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ResponsiveContainer } from "recharts"
import axios from 'axios'
import { toast } from 'sonner'




export const description = "A multiple line chart"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig



/* CHART IMPORTS END */
const DashboardPageTrends = () => {
    const chartblockref = useRef(null)
/*     const [chartData, setChartData] = useState()
 */    const [filtered, setFiltered] = useState(false)
 const [pagesData, setPagesData] = useState([])
    const [filters, setFilters] = useState({
        path: "",
        country: ""
    })

    const [rawData, setRawData] = useState([])
    const [chartData, setChartData] = useState([])
    const [participatingCountries, setParticipatingCountries] = useState([])
    const [participatingDates, setParticipatingDates] = useState([])

    useEffect(()=>{
const GetRawData = async()=>{
    const today = new Date()
    const threemonths_startdate = new Date()
    threemonths_startdate.setUTCHours(0,0,0,0)
    threemonths_startdate.setUTCDate(today.getUTCDate() - 89)
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/pageview/data/get`, {
        startdate: threemonths_startdate,
        enddate: null,
        projectID: sessionStorage.getItem("ActiveProject"),
        path: null
    })

    if (response.status=== 200) {
        setRawData(response.data)
    }
    } catch (error) {
        console.error("Greska za raw data fetch:", error)
        toast.error("Couldn't fetch Data for Chart.")
    }

    
}



const getPagesData = async()=>{
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/page/get`, {
            projectID: sessionStorage.getItem("ActiveProject")
        })
        if (response.status === 200) {
let pages = response.data
let pagesformatted = pages.map(item => {
    return {
        title: item.title,
        path: item.path
    }
})

console.log(pagesformatted)
setPagesData(pagesformatted)
        }
    } catch (error) {
        toast.error("Couldn't fetch Pages data")
    }
}

GetRawData()
getPagesData()
    }, [])


    useEffect(()=>{
if (rawData.length > 0) {
    const countries = Array.from(new Set(rawData.flatMap((item)=>Object.keys(item.views))))
    setParticipatingCountries(countries)

    const dates = Array.from(new Set(rawData.flatMap(item=>item.date)))
    setParticipatingDates(dates.sort())




    /* INICIJALNA OBRADA */
    setChartData([])
        //bez parametara
        dates.forEach(date => {
            const pw_items = rawData.filter(item => item.date === date)
            let date_views_sum = {}

            pw_items.forEach(pageview => {
                /* const views_obj = pageview.views
                const entries = Object.entries(views_obj)
                entries.forEach(([key, value]) => {
                    date_views_sum[key] = (date_views_sum[key] ?? 0) + value
                }); */

                countries.forEach(countrycode => {
                    const views_obj = pageview.views
                    date_views_sum[countrycode] = (date_views_sum[countrycode] ?? 0) + (views_obj[countrycode] ?? 0)
                });
            });

            console.log(date, date_views_sum)
            setChartData(prev => [...prev, {date: date, views: date_views_sum}])
            
        });
    /* KRAJ INICIJALNE OBRADE */ 

}
    }, [rawData])



const processData = (filtered_local:boolean)=>{
    if (filtered_local === true) {
        //sa parametrima
        setChartData([])
        let pc2 = [filters.country]
        //bez parametara
        participatingDates.forEach(date => {
            const pw_items = rawData.filter(item => item.date === date && item.path === filters.path)
            let date_views_sum = {}

            pw_items.forEach(pageview => {
                /* const views_obj = pageview.views
                const entries = Object.entries(views_obj)
                entries.forEach(([key, value]) => {
                    date_views_sum[key] = (date_views_sum[key] ?? 0) + value
                }); */

                pc2.forEach(countrycode => {
                    const views_obj = pageview.views
                    date_views_sum[countrycode] = (date_views_sum[countrycode] ?? 0) + (views_obj[countrycode] ?? 0)
                });
            });

            console.log(date, date_views_sum)
            setChartData(prev => [...prev, {date: date, views: date_views_sum}])
            
        });
    } else if (filtered_local === false) {
    setChartData([])
        //bez parametara
        participatingDates.forEach(date => {
            const pw_items = rawData.filter(item => item.date === date)
            let date_views_sum = {}

            pw_items.forEach(pageview => {
                /* const views_obj = pageview.views
                const entries = Object.entries(views_obj)
                entries.forEach(([key, value]) => {
                    date_views_sum[key] = (date_views_sum[key] ?? 0) + value
                }); */

                participatingCountries.forEach(countrycode => {
                    const views_obj = pageview.views
                    date_views_sum[countrycode] = (date_views_sum[countrycode] ?? 0) + (views_obj[countrycode] ?? 0)
                });
            });

            console.log(date, date_views_sum)
            setChartData(prev => [...prev, {date: date, views: date_views_sum}])
            
        });
    }

    console.log(chartData)
}
const clearFilters = ()=>{
    setFiltered(false)
    setFilters({
        path: "",
        country: ""
    })
    processData(false)
}


    const [chartheight, setchartheight] = useState(0)
  return (
    <>
    <DashboardHeader></DashboardHeader>
    <MainContent enforceProtection>
        <DashboardPageTitle title='Page Views Trends' subtitle='Analyze page views for your project, either combined or by specific parameters.'></DashboardPageTitle>
        <DashboardBlock>
            <form className='flex gap-3 items-end' onSubmit={(e) =>{[e.preventDefault(), setFiltered(true), processData(true)]}}>
                <div className="w-50">
                    <Select required value={filters.country} onValueChange={(value)=>{setFilters(prev => ({...prev, country: value}))}}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Pick a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {CountriesList.map(item => (
            <SelectItem key={item.code} value={item.code}>{item.name}</SelectItem>
          ))}
    </SelectGroup>
      </SelectContent>
    </Select>
                
                
                
                </div>
                


                <div className="w-50">
                    <Select required value={filters.path} onValueChange={(value)=>{setFilters(prev => ({...prev, path: value}))}}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Pick a Page" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {pagesData.map(item => (
            <SelectItem key={item.path} value={item.path}>{item.title}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
                </div>


                <Button type='submit'><FunnelPlus></FunnelPlus> Apply Filters</Button>
                <div className='flex-1'></div>
                <Button type='button' variant={'ghost'} onClick={()=>{clearFilters()}}><FunnelX></FunnelX> Clear Filters</Button>



            </form>
        </DashboardBlock>


<div className='h-10'></div>
<div className={` p-4 border-1 border-gray-700/20 rounded-lg w-full flex flex-col h-fit`}>
        
<div  ref={chartblockref} className="flex-1">
     <ResponsiveContainer width={"100%"} height={500}>
    <ChartContainer 
      config={chartConfig} 
      className="h-full w-full"
    >
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {const date = new Date(value); return `${date.getUTCMonth() + 1}. ${date.getUTCFullYear()}.`}}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(value) => {const date = new Date(value); return `${date.getUTCDate()}. ${date.getUTCMonth() + 1}.`}} />} />
      {/*   <Line
          dataKey="views.RS"
          type="monotone"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={false}
          connectNulls={true}
        />
        <Line
          dataKey="views.HR"
          type="monotone"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={false}
          connectNulls={true}
        /> */}

       {filtered ? (
     <Line
          dataKey={`views.${filters.country}`}
          type="monotone"
          stroke={"var(--color-mobile)"}
          strokeWidth={2}
          dot={false}
          connectNulls={true}
        /> 
) : (
    participatingCountries.map((item, index) => (
       <Line
          dataKey={`views.${item}`}
          type="monotone"
          stroke={index % 2 == 0 ? "var(--color-mobile)" : "var(--color-desktop)"}
          strokeWidth={2}
          dot={false}
          connectNulls={true}
        /> 
    ))
)}

      </LineChart>
    </ChartContainer>
  </ResponsiveContainer>
 
</div>
    </div>            
    </MainContent>
    </>
  )
}

export default DashboardPageTrends