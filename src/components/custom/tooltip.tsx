import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Info } from 'lucide-react'

interface Props {
  text: string
}

const MetricaTooltip: React.FC<Props> = ({ text }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info />
      </TooltipTrigger>
      <TooltipContent className="w-auto max-w-xs">
        <p className="whitespace-normal">{text}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default MetricaTooltip
