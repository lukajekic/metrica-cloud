import DashboardBlock from '@/components/custom/DashboardBlock'
import MetricaTooltip from '@/components/custom/tooltip'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { H1, P } from '@/components/ui/typography'
import { Sigma } from 'lucide-react'
import React from 'react'

interface Props {
  title: string
  value: number
  subtext: string
  explainer?: string,
  formula?: string,
  colorScale?: 'index'
  forceDecimal?: boolean
}

const SingleValueCard: React.FC<Props> = ({ 
  title, 
  value, 
  subtext, 
  explainer,
  formula,
  colorScale, 
  forceDecimal 
}) => {
  
  // Formatiranje vrednosti za prikaz
  const displayValue = forceDecimal ? value.toFixed(2) : Math.round(value * 100) / 100

  const getColor = () => {
    if (colorScale === 'index') {
      if (value === 1) return 'text-red-700'
      if (value > 1 && value < 2) return 'text-yellow-700'
      if (value >= 2) return 'text-green-700'
    }
    return ''
  }

  return (
    <DashboardBlock title={title} tailwindHeight="h-full">
      <div className="flex gap-4 items-center justify-between h-full">
        <div className="flex flex-col justify-around h-full">
          <div className="flex items-end">
            <a href="/dashboard/home" className="focusable-link flex items-end gap-2 w-fit">
              <H1 className={getColor()}>
                {displayValue}
              </H1>
              <P>{subtext}</P>
            </a>
          </div>

          {explainer && (
            <>
            <div className="flex items-center gap-2 justify-start mt-2">
              <span className="text-sm text-muted-foreground">Calculation Explainer:</span>
              <MetricaTooltip text={explainer} />
            </div>


</>
          )}

          {formula && (
            <div className="flex items-center gap-2 justify-start mt-2">
              <span className="text-sm text-muted-foreground">Calculation Formula:</span>
              <Tooltip>
      <TooltipTrigger asChild>
        <Sigma />
      </TooltipTrigger>
      <TooltipContent className="w-auto max-w-xs">
        <p className="whitespace-normal">{formula}</p>
      </TooltipContent>
    </Tooltip>
            </div>
          )}
        </div>
      </div>
    </DashboardBlock>
  )
}

export default SingleValueCard