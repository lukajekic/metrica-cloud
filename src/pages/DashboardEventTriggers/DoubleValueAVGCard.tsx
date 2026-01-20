import DashboardBlock from '@/components/custom/DashboardBlock'
import { H1, P } from '@/components/ui/typography'
import { MoveDownRight, MoveUpRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface Props {
    title:string,
    topTextValue: number,
    BottomTextValue: number
}

const DoubleValueAVGCard:React.FC<Props> = ({title, topTextValue, BottomTextValue}) => {




  return (
   <DashboardBlock title={title} tailwindHeight='h-full'>
          <div className="flex gap-4 items-center justify-between h-full">
            <div className="flex flex-col justify-around h-full">
              <div className="flex items-end">
                                <a href="/dashboard/home" className='focusable-link flex items-end gap-2 w-fit'>
                                <H1>{topTextValue.toFixed(2)}</H1>
                                <P>Average Views</P>
                                </a>
                                
              </div>

              <div className="flex items-end">
                                <a href="/dashboard/home" className='focusable-link flex items-end gap-2 w-fit'>
                                <H1>{BottomTextValue.toFixed(2)}</H1>
                                <P>Average Unique Views</P>
                                </a>
                                
              </div>
            </div>


          </div>
        </DashboardBlock>
  )
}

export default DoubleValueAVGCard