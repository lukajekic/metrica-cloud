import { ChartSpline } from 'lucide-react'
import React from 'react'
interface Props {
    width?: string,
    color?: string
}
const MetricaLogo:React.FC<Props> = ({width = '40px', color = 'black'}) => {
  return (
    <div className='squircle text-white flex justify-center items-center' style={{backgroundColor: color, width: width, height: width}}><ChartSpline className='w-full'></ChartSpline></div>
  )
}

export default MetricaLogo