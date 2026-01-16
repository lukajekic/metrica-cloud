import { H1, H3, P } from '@/components/ui/typography'
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const PrintApiKey = () => {
    const [params, setparams] = useSearchParams()

    const api = params.get('apikey')
    params.set('apikey', '')

    useEffect(()=>{
        window.print()
    }, [])
  return (
    <>
    <div id="print" className="hidden print:block">
        <H1 className='break-normal'>Your API Key</H1>
    <P className='break-normal'>This is your API Key which you will use to integrate Metrica SDK to your website. Be sure to save it and print it if possible to avoid losing it.</P>

    <H3 className='p-1 border-1 border-black outline outline-1  outline-offset-4 mt-5 w-fit break-normal'>{api}</H3>
    </div>
    </>
  )
}

export default PrintApiKey