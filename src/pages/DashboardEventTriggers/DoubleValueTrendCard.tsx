import DashboardBlock from '@/components/custom/DashboardBlock'
import { H1, P } from '@/components/ui/typography'
import { MoveDownRight, MoveUpRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface Props {
    title:string,
    topTextValue: string,
    BottomTextValue: string,
    trendValue:number,
    trendComparison:string
}

const DoubleValueTrendCard:React.FC<Props> = ({title, topTextValue, BottomTextValue, trendValue, trendComparison}) => {

    const [trendString, setTrendString] = useState('')
    const [trendStatus, setTrendStatus] = useState('')
useEffect(() => {
  setTrendString(FormatTrend())
}, [trendValue])

    const FormatTrend = () =>{
        if (trendValue >= 0) {
            setTrendStatus('positive')
            return "+" + trendValue.toString()
        } else {
            setTrendStatus('negative')
            return trendValue.toString()
        }
    }


  return (
   <DashboardBlock title={title} tailwindHeight='h-full'>
          <div className="flex gap-4 items-center justify-between h-full">
            <div className="flex flex-col justify-around h-full">
              <div className="flex items-end">
                                <a href="/dashboard/home" className='focusable-link flex items-end gap-2 w-fit'>
                                <H1>{topTextValue}</H1>
                                <P>Views</P>
                                </a>
                                
              </div>

              <div className="flex items-end">
                                <a href="/dashboard/home" className='focusable-link flex items-end gap-2 w-fit'>
                                <H1>{BottomTextValue}</H1>
                                <P>Unique Views</P>
                                </a>
                                
              </div>
            </div>


            <div className="flex flex-col gap-2">
              <div className={`flex gap-2 items-center ${trendStatus === 'positive' ? ('text-green-700') : trendStatus === 'negative' ? ('text-red-700') : ('')}`}>
              {trendStatus === 'positive' ? (<MoveUpRight className='size-8 '></MoveUpRight>) : trendStatus === 'negative' ? (<MoveDownRight className='size-8 '></MoveDownRight>) : (<></>)}
              <h2 className='text-3xl font-bold '>{trendString}</h2>
            </div>

            <p className='text-gray-500 mt-0'>{trendComparison}</p>
            </div>
          </div>
        </DashboardBlock>
  )
}

export default DoubleValueTrendCard