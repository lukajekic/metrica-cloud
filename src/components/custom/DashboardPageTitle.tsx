import React from 'react'


interface Props {
  title: string,
  subtitle?: string
}

const DashboardPageTitle:React.FC<Props> = ({title, subtitle}) => {
  return (
    <div className='flex flex-col gap-2 w-full justify-start p-2 pb-9'>
      <p className='font-semibold text-2xl w-full truncate'>{title}</p>
      <div className="border-t-1 border-t-gray-700/20"></div>
      <p className='text-gray-700 text-sm w-full truncate'>{subtitle}</p>
    </div>
  )
}

export default DashboardPageTitle