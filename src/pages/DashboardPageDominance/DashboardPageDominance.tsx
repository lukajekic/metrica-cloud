import DashboardBlock from '@/components/custom/DashboardBlock'
import DashboardHeader from '@/components/custom/DashboardHeader'
import DashboardPageTitle from '@/components/custom/DashboardPageTitle'
import MainContent from '@/components/custom/MainContent'
import React, { useEffect, useState } from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'
import axios from 'axios'
import { toast } from 'sonner'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CountriesList } from '@/data/countries'

const DashboardPageDominance = () => {
const [rawData, setRawData] = useState([])
    const [pages, setPages] = useState([])
    const [pageviews, setPageViews] = useState([])
const monthend = new Date()
monthend.setUTCHours(0, 0, 0, 0)
monthend.setUTCDate(monthend.getUTCDate() - 29)
console.log(monthend)
    useEffect(() => {
        getGlobaldata()
    }, [])

    const [tableData, setTableData] = useState([])
    const [Page_DomantingCountries, set_Page_DominatingCountries] = useState({})
    const [Country_DominatingPages, set_Country_DominatingPages] = useState({})

    const getGlobaldata = async () => {
        try {
            const response_pages = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/page/get`, {
                projectID: sessionStorage.getItem('ActiveProject')

            })

            if (response_pages.status === 200) {
                setPages(response_pages.data)
            }



            const response_pageviews = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/pageview/data/get`, {
                projectID: sessionStorage.getItem('ActiveProject'),
                startdate: monthend
                
            })

            if (response_pages.status === 200) {
                setRawData(response_pageviews.data)
                setPageViews(response_pageviews.data.sort((b,a)=>a.date.localeCompare(b.date)))
            }
        } catch (error) {
            toast.error("Couldn't fetch Data")
            location.href = '/dashboard/home'
        }
    }


    useEffect(()=>{
        proccessTableData()
    }, [pages, pageviews])



    const proccessTableData = () => {
        const array_full = pageviews.map((item, index) => {
            let views = item.views || {}
            let countrycodes = Object.keys(views)
            let ind_view_values = Object.values(views)
            let TotalViews = ind_view_values.reduce((prev, curr) => prev + curr, 0)
            let maxView_Value = Math.max(...ind_view_values)

            let dominating_countries = countrycodes.filter(country => views[country] === maxView_Value)

let percentShare =
  TotalViews > 0
    ? ((maxView_Value / TotalViews) * 100).toFixed(1)
    : "0.00"

            let page_name_arr = pages.filter(page => page.path === item.path)

            let page_name = page_name_arr?.[0]?.title ?? 'N/A'

            return {
                title: page_name,
                path: item.path,
                countries: dominating_countries,
                share: percentShare,
                count: maxView_Value,
                cell_green_bg: index % 2 === 0 ? ('bg-green-800') : ("bg-green-700"),
                date: item.date
            }

        })
        setTableData(array_full)

    }


    const processDominantCountriesPerPath = (path)=>{
        if (!path || !rawData) {
            return
        }

        console.log(rawData)

        const pageviews = rawData.filter((item)=>{
            return item.path === path
        })

        console.log(pageviews)


        if (!pageviews) {
            set_Page_DominatingCountries({})
        }


        let globalPerCOuntryViews = {}


        pageviews.forEach(pageview => {
            Object.entries(pageview.views).forEach(([country, views])=>{
                if (typeof views !== 'number') {
                    return
                }


                globalPerCOuntryViews[country] = (globalPerCOuntryViews[country] ?? 0) + views



            })
        });



        set_Page_DominatingCountries(globalPerCOuntryViews)
        console.log(globalPerCOuntryViews)
    }











    const processDominantPagesPerCountry = (countrycode)=>{
        if (!countrycode || !rawData) {
            return
        }

      

        console.log(pageviews)


        if (!pageviews) {
            set_Country_DominatingPages({})
        }


        let globalPerCOuntryViews = {}


        rawData.forEach(pageview => {
            const path = pageview.path
            const countryviews = pageview?.views?.[countrycode] ?? 0

            if (pageview?.views?.[countrycode]) {
                globalPerCOuntryViews[path] = (globalPerCOuntryViews[path] ?? 0) + countryviews
            }
        });



        set_Country_DominatingPages(globalPerCOuntryViews)
        console.log(globalPerCOuntryViews)
    }
    return (
        <>
            <DashboardHeader></DashboardHeader>
            <MainContent enforceProtection>
                <DashboardPageTitle title='Page Dominance' subtitle='View dominating Pages and dominating Countries for them.'>
                </DashboardPageTitle>


                <div className="h-[calc(100vh-220px)] flex flex-col gap-5">
                    <div className="min-h-[50%] max-h-[50%]">
                        <DashboardBlock title='' tailwindHeight='h-full max-h-full overflow-y-auto'>
                            <DataTable columns={columns} data={tableData}></DataTable>
                        </DashboardBlock>
                    </div>
                    <div className=" flex-1 grid grid-cols-2 grid-rows-1 gap-5">
                        <div className="">
                            <DashboardBlock title='Dominant Countries' tailwindHeight='h-full overflow-auto'>
                                 <div className="flex flex-col">
                                    <Select onValueChange={(value)=>{processDominantCountriesPerPath(value)}}>
      <SelectTrigger className="w-full">
        <SelectValue  placeholder="Pick a page" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
       
                      {pages.map(item =>{
                        return (
                                <SelectItem value={item.path}
                          >{item.title}</SelectItem>
                        )
                      })}
                      
        </SelectGroup>
      </SelectContent>
    </Select>

    <ol className='list-decimal gap-2 flex flex-col gap-2 mt-2 flex-1 overflow-y-auto'>
        {Object.entries(Page_DomantingCountries).map(([country, value], index)=>{
            return (
                <div className={`w-full border-1 border-gray-700/20 rounded p-[6px] ${index === 0 ? ("bg-green-200") : index === (Object.entries(Page_DomantingCountries).length - 1) ? ('bg-red-200') : ('bg-gray-200/70')}  `}>
                    <div className="flex justify-between itmes-center">
                        <div className="w-1/2">{country}</div>
                        <div className="w-1/2 text-right font-bold">{value} views</div>
                    </div>
                </div>
            )
        })}
    </ol>
                                 </div>
                            </DashboardBlock>
                        </div>
                        <div className="">
                            <DashboardBlock title='Dominant Pages' tailwindHeight='h-full overflow-hidden'> 
  {/* Dodali smo h-full i overflow-hidden na DashboardBlock da sprečimo dupli scroll */}
  
  <div className="flex flex-col h-full"> 
    <Select onValueChange={(value)=>{processDominantPagesPerCountry(value)}}>
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

    {/* KLJUČNE IZMENE OVDE: h-0 i flex-grow omogućavaju listi da zauzme ostatak prostora bez širenja roditelja */}
    <ol className='list-decimal mt-2 flex-1 overflow-y-auto min-h-0'>
        {Object.entries(Country_DominatingPages).map(([country, value], index)=>{
            return (
                <div key={country} className={`w-full border-1 border-gray-700/20 rounded p-[6px] mb-2 ${index === 0 ? "bg-green-200" : index === (Object.entries(Country_DominatingPages).length - 1) ? 'bg-red-200' : 'bg-gray-200/70'}`}>
                    <div className="flex justify-between items-center">
                        <div className="w-1/2">{country}</div>
                        <div className="w-1/2 text-right font-bold">{value} views</div>
                    </div>
                </div>
            )
        })}
    </ol>
  </div>
</DashboardBlock>
                        </div>
                    </div>
                </div>
            </MainContent>
        </>
    )
}

export default DashboardPageDominance