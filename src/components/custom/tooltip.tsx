import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Info } from 'lucide-react'


interface Props {
    text: string
}





const MetricaTooltip:React.FC<Props> = ({text}) => {
  return (
     <Tooltip>
      <TooltipTrigger asChild>
        <Info>Info</Info>
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default MetricaTooltip