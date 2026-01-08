import DashboardPageTitle from '@/components/custom/DashboardPageTitle'
import MetricaLogo from '@/components/custom/MetricaLogo'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { H1, H3, P } from '@/components/ui/typography'
import axios from 'axios'
import { CircleAlert, Info } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import qrcode from 'qrcode'


const EarlyAccessAcountCreation = () => {
const [accountData, setAccountData] = useState({
    email: "",
    name: "",
    password: ""
})

const [invitationID, setInvitationID] = useState('')
const [QRCodeData, setQRCodeData] = useState('')
const [showQRCode, setShowQRCode] = useState(false)
useEffect(()=>{
    getInitialData()
}, [])
    const getInitialData = async()=>{
        try {
            const invitationID = sessionStorage.getItem('InvitationID') || null

        if (!invitationID) {
            location.href = '/'
        }

        setInvitationID(invitationID)
        const response  =await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/waitlist/single/get`, {
            invitationID: invitationID
        })

        if (response.status === 200 && response.data && response.data.status && response.data.status === 'accepted') {
            //logic
            console.log(response.data)
            setAccountData(prev =>({...prev, email: response.data.email}))
        } else {
            location.href = '/'
        }
        } catch (error) {
            location.href = '/'
        }
    }


    const HandleAccountCreation = async()=>{
        try {
            const finalcheckresponse = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/waitlist/onboarding`, {
                action: 'finalcheck',
                email: accountData.email,
                invitationID: invitationID
            })

            if (finalcheckresponse.status === 200) {
                console.log('Deleted from waitlist, now create account')
            }

            const createAccResponse = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/user/register`, {
                email: accountData.email,
                name: accountData.name,
                password: accountData.password
            })


            if (createAccResponse.status === 201 && createAccResponse.data && createAccResponse.data.qrcode) {
                console.log('Account created, QR Code:')
                console.log(createAccResponse.data.qrcode) //delete
                console.warn("DEV: DELETE THIS")

                setQRCodeData(createAccResponse.data.qrcode)
                setFormState('authenticator')
            }
        } catch (error) {
            toast.error('Error occured, contact via HomePage Form')
        }
    }
    const [formState, setFormState] = useState('create')
  return (
    <div className='w-full min-h-screen  flex justify-center items-center'>
<div className="fixed top-2 left-2"><MetricaLogo/></div>
        {formState === 'create' ? (
            <div className="bg-white shadow-sm w-100 h-fit p-4 rounded-2xl border-1 border-gray-700/20">
        <DashboardPageTitle title='Create Your Account'></DashboardPageTitle>
        <form id='createaccountform' onSubmit={(e)=>{[e.preventDefault(), HandleAccountCreation()]}}>
            <FieldGroup>
                

<FieldSet>
    <FieldLegend>Your Email</FieldLegend>
                <Input name='email' type='text' disabled value={accountData.email}></Input>
</FieldSet>

<FieldSet>
    <FieldLegend>Your Name</FieldLegend>
                <Input name='name' type='text' required value={accountData.name} onChange={(e)=>{setAccountData(prev =>({...prev, name: e.target.value}))}}></Input>
</FieldSet>

<FieldSet>
    <FieldLegend>Your New Password</FieldLegend>
                <Input name='password' type='password' required value={accountData.password} onChange={(e)=>{setAccountData(prev =>({...prev, password: e.target.value}))}}></Input>
</FieldSet>

<Field orientation={'horizontal'}>
    <Button type='submit' >Continue</Button>
</Field>




            </FieldGroup>
        
        </form>
        </div>
        ) : formState === 'authenticator' ? (
            <div className="bg-white shadow-sm w-100 h-fit p-4 rounded-2xl border-1 border-gray-700/20">
        <DashboardPageTitle title='Secure Your Account'/>
            <Alert>
                <Info></Info>
                <AlertTitle>Instructions</AlertTitle>
                <AlertDescription>
                    <ol className='list-decimal ml-5'>
                        <li>Install Authenticator app - Reccomendation: Google Authenticator</li>
                        <li>Scan the QR Code below and confirm you have your OTP code on the screen.</li>
                        <li>After that, confirm by clicking button 'Continue'</li>
                    </ol>
                </AlertDescription>
            </Alert>

            <Alert variant={'destructive'} className='mt-3'>
                <CircleAlert></CircleAlert>
                <AlertTitle>Important Notice</AlertTitle>
                <AlertDescription>
                    If you confirm by clicking button 'Continue', but haven't scanned the Code properly, you won't be able to log in to your Metrica Cloud Account, neither retry this proccess.
                </AlertDescription>
            </Alert>

            <div className="w-full flex flex-col gap-2 mt-3">
                {showQRCode === false ? (
                <Button variant={'default'} className='w-fit' onClick={()=>{setShowQRCode(true)}}>Show QR Code</Button>

                ) : showQRCode === true ? (
<>
  <img src={QRCodeData} className='w-30 h-30'></img>
                <Button variant={'destructive'} className='w-fit self-end' onClick={()=>{[setFormState('welcome'), setTimeout(() => {
                  location.href = '/dashboard/home'  
                }, 5000)]}}>Continue</Button></>
                ): (<></>)}
              
            </div>
       
       
        </div>
        ) : formState === 'welcome' ? (
            <div className='flex flex-col items-center gap-2'>
<H1>Welcome</H1>
<P className='text-[20px]'>Your Dashboard is ready, and also Documenation to help you implement Metrica easy.</P>
</div>
        ) : (<></>)}
    </div>
  )
}

export default EarlyAccessAcountCreation