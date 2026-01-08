import React from 'react'

interface Props {
    title: string,
    children?: React.ReactNode,
    tailwindHeight?: string,
}

//MORA SE STAVITI U WRAPPER ODREDJENE SIRINE JER ZAUZIMA 100% PARENT ELEMENTA
//A ZA VISINU SE NA ELEMENTR UNUTAR CHILDRENA DODAJE PADDING I MARGIN ILI DEFINISATI
//UNUTAR tailwindHeight Parametra


const DashboardBlock:React.FC<Props> = ({title, children, tailwindHeight}) => {
    const heightclass = tailwindHeight ?? 'h-fit'
  return (
    <div className={`p-4 border-1 border-gray-700/20 rounded-lg w-full flex flex-col ${heightclass}`}>
        {title && (
            <>
            <p className='font-semibold text-xl w-full truncate'>{title}</p>
                  <div className="h-[1px] bg-gray-700/20 my-2"></div>
</>
        )}
<div className="flex-1">{children}</div>
    </div>
  )
}

export default DashboardBlock