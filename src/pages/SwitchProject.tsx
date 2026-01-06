import { useUserData } from '@/context/GlobalContext'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const SwitchProject = () => {
const [q_params] = useSearchParams()
const id = q_params.get('id') 
const {userData} = useUserData()
const [forbidden, setforbidden] = useState(false)
    useEffect(()=>{
        if (id) {
        if (userData?.projects?.includes(id)) {
                    sessionStorage.setItem('ActiveProject', id)
                    console.log('switched')
                    location.href = '/dashboard/home'

    } else {
        setTimeout(() => {
            setforbidden(true)

        }, 500);
    }
    } else {
        sessionStorage.setItem('ActiveProject', '')
        location.href = '/dashboard/home'
    }
    }, [userData])
  return (
    <>
    {forbidden && (
        <p>You are forbidden from accessing this project.</p>
    )}
    </>
  )
}

export default SwitchProject