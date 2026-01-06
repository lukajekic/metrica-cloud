import AccordionItemComponent from '@/components/custom/accordionItem'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { H1, H3, P } from '@/components/ui/typography'
import { AlertCircleIcon, Bolt, ChartSpline, Check, Eye, Github, Key, Mail, PanelsTopLeft, User } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
 import signature from '../assets/signature.png';
import emailjs from 'emailjs-com';
import { Field, FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import MetricaLogo from '@/components/custom/MetricaLogo'
import { Label } from '@/components/ui/label'
import { toast } from "sonner"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axios from 'axios'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useTheme } from 'next-themes'

const Landing = () => {
  const headerRef = useRef(null);
  const [subscribed, setSubscribed] = useState(false)
  const [subscriptionResponse, setSubscriptionResponse] = useState("")
  const [earlyAccessEmail, setEarlyAccessEmail] = useState("")
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const loginPasswordField = useRef(null)
  const loginEmailField = useRef(null)
  const [LoadingButtons, setLoadingButtons] = useState({
    subscribebtn: false,
    opendashboardbtn: false,
    loginsubmitbtn: false
  })

  const SetBTNLoadingStatus = (targetID:string, status:boolean)=> {
    if (!targetID || status === undefined) {
        return
    }

    setLoadingButtons(prev =>({...prev, [targetID]: status}))

  }







const HandleDashboardOpen = async()=>{
    try {
        SetBTNLoadingStatus('opendashboardbtn', true)
        const CurrentUserResponse = await axios.get(`${import.meta.env.VITE_BACKEND}/metrica/user/me`)
        if (CurrentUserResponse.status === 200) {
            SetBTNLoadingStatus('opendashboardbtn', false)
            console.log('Logged In')
            console.log('Proceeding with redirect')
            toast('Should be redirected to Dashboard.')
        }
    } catch (error) {
        if (error.response?.status === 401) {
            SetBTNLoadingStatus('opendashboardbtn', false)
            setLoginDialogOpen(true)
            setTimeout(() => {
                loginEmailField?.current?.focus()
            }, 100);
        }
    }
}

  const HandleSubscription = async()=>{
    try {
        const btn = document.getElementById('subscribebtn')
        SetBTNLoadingStatus('subscribebtn', true)
        if (btn) {
            btn.innerText = ''
            btn.innerHTML = `<Spinner className='text-white'></Spinner>`
        }
        const CurrentUserResponse = await axios.get(`${import.meta.env.VITE_BACKEND}/metrica/user/me`)
        if (CurrentUserResponse.status === 200) {
            SetBTNLoadingStatus('subscribebtn', false)
            console.log('Logged In')
            console.log('Proceeding with redirect')
            toast('Should be redirected to Dashboard.')
        }
    } catch (error) {
        
        if (error.response?.status === 401) {
            
            console.log('Not Logged In')
            const existingUserResponse = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/check/existinguser`, {
                email: earlyAccessEmail
            })

           if (existingUserResponse && existingUserResponse.data.action === 'subscribe') {
            try {
              const serverresponse = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/waitlist/subscribe`, {
              email: earlyAccessEmail
            })

            if (serverresponse) {
              if (serverresponse.status === 200) {
                setSubscriptionResponse(serverresponse?.data?.message)
                setSubscribed(true)
                SetBTNLoadingStatus('subscribebtn', false)
              }
            }
            
            } catch (error) {
              console.error(error)
              setSubscriptionResponse("Error occured")
                setSubscribed(true)
                SetBTNLoadingStatus('subscribebtn', false)
            }

           } else if (existingUserResponse && existingUserResponse.data.action === 'logindialog') {
            SetBTNLoadingStatus('subscribebtn', false)
            setLoginData(prev =>({...prev, email: earlyAccessEmail}))
            setLoginDialogOpen(true)
            setTimeout(() => {
                loginPasswordField?.current?.focus()
            }, 100);
           }
        }
    }
  }

const sendEmail = async(name:string, email:string, message:string)=>{
    emailjs.send("service_5nzmf9i","template_blp3bkd",{
name: name,
email: email,
message: message,
});
}

useEffect(()=>{
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY)
}, [])




const [wrongCredentials, setWrongCredentials] = useState(false)
const HandleLogin = async()=>{
    try {
        SetBTNLoadingStatus('loginsubmitbtn', true)
        setWrongCredentials(false)
        const AuthResponse = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/user/login`, {
            email: loginData.email,
            passwordAndOTP: loginData.password
        })


        if (AuthResponse && AuthResponse.status === 200) {
            SetBTNLoadingStatus('loginsubmitbtn', false)
            console.log('Login Success.')
        }
    } catch (error) {
        if (error.response.status === 400 && error.response.data.message === 'Invalid email, password or 2FA OTP.') {
            SetBTNLoadingStatus('loginsubmitbtn', false)
            setWrongCredentials(true)
        }
    }
}
const freePlanFAQ = [
  {
    question: "What is included in the Free Plan?",
    answer:
      "The Free Plan provides full platform functionality with no feature limitations. Once your early access request is approved, you can use Metrica Cloud without usage caps."
  },
  {
    question: "Are requests limited on the Free Plan?",
    answer:
      "No. The Free Plan includes unlimited requests per project with no throttling."
  },
  {
    question: "Is there a limit on pages or events?",
    answer:
      "No limits apply. Each project supports unlimited page views and unlimited custom events."
  },
  {
    question: "How many projects can I create?",
    answer:
      "You can create multiple projects, each with isolated analytics data and configuration. One License is applied to one project, you can host unlimited projects on one Account."
  },
  {
    question: "Does the Free Plan include CORS protection?",
    answer:
      "Yes. Every project includes built-in CORS protection, allowing only authorized domains to send data. Even if domain is whitelisted for sending the analytics, it can only monitor analytics for predefined pages or events from that Origin."
  },
  {
    question: "Is my data protected from unauthorized access?",
    answer:
      "Yes. Metrica Cloud enforces strict data isolation and access control to prevent data access outside your environment. "
  },
  {
    question: "Can other websites read or inject my analytics data?",
    answer:
      "No. Requests from unauthorized origins are blocked and data cannot be accessed or reused outside your project scope. Metrica Backend authroizes POST requests by Origin header automaticcaly added by your browser."
  },
  {
    question: "Does the Free Plan include geolocation tracking?",
    answer:
      "Yes. Visitor geolocation tracking (country-level) is included. Country Origin is determined by your IP Address, operated by Free API www.ipapi.co, Metrica doesn't collect any data beside Geolocation and total page views. Unique views are determined by Session ID which isn't processed on our servers, Session details stays on visitor's deivce. For ipapi's Privacy Policy please refer to: https://ipapi.co/privacy/"
  },
  {
    question: "Are unique views and events supported?",
    answer:
      "Yes. Both total and unique views and events are supported for accurate analytics."
  },
  {
    question: "Is the SDK included in the Free Plan?",
    answer:
      `Yes. A lightweight SDK is available via npm for fast and simple integration. You can view Open Source SDK code by searcing for "@lukajekic/metrica-sdk" on npmjs.com or download via instructions provided on Metrica Cloud's Panel`
  },
  {
    question: "Can I use the Free Plan in production?",
    answer:
      "Yes. The Free Plan is fully production-ready."
  },
  {
    question: "Do I need a credit card to use the Free Plan?",
    answer:
      "No credit card is required. When you receive the license, you can start monitoring analytics in minutes."
  },
  {
    question: "What does Early Access mean?",
    answer:
      "Early Access allows you to use Metrica Cloud before public release. Once approved, all Free Plan features are unlocked permanently."
  },
  {
    question: "Will features be removed from the Free Plan later?",
    answer:
      "No. The Free Plan retains full functionality."
  }
]
useEffect(() => {
  const handleScroll = () => {
    const header = headerRef.current;
    if (!header) return;

    if (window.scrollY > 0) {
      header.classList.replace('border-b-transparent', 'border-b-gray-700/20');
      header.classList.add('bg-white');
    } else {
      header.classList.replace('border-b-gray-700/20', 'border-b-transparent');
      header.classList.remove('bg-white');
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);



const [formdata, setformdata] = useState({
    name: "",
    email: "",
    message: ""
})
const HandelSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    console.log('Form Data:', formdata)
    const button = document.getElementById('submitcontactbtn')
    if (button) {
        button.disabled = true
        setTimeout(async() => {
            button.innerText = 'Sending...'
            await sendEmail(formdata.name, formdata.email, formdata.message)
            button.innerHTML = 'Thank you for getting in touch.'
            setformdata({
                name: "",
                email: "",
                message: ""
            })
        }, 200);
    }

}

const onFormValuesChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
    const fieldname = e.target.name
    const value = e.target.value
    setformdata(prev => ({...prev, [fieldname]: value}))
}

  const rotateIcon = (targetID:string, status:boolean) =>{
const target = document.getElementById(targetID)
if (status === true) {
    target?.classList.remove('rotate-0')
    target?.classList.add('rotate-45')
} else {
    target?.classList.remove('rotate-45')
    target?.classList.add('rotate-0')
}
  }

  return (
    <>
    <div id='herostart' className='w-full magicpattern h-[100vh]  pt-[70px] flex items-center justify-center'>
        <div id="header" ref={headerRef} className="fixed top-0 left-0 right-0 w-full py-4 flex justify-between items-center z-50
             border-b border-b-transparent transition-colors duration-300 bg-transparent">
            <div className="flex justify-between items-center m-auto w-[80%]">
                <a href="#herostart">
                    <div className="flex items-center gap-4">
                    <MetricaLogo ></MetricaLogo>
                <H3>Metrica Cloud</H3>
                </div>
                </a>
            <div className="flex space-x-4 h-full items-center">
                <a href="#earlyaccess"><Button variant="ghost">Early Access</Button></a>
                <a href="#features"><Button variant="ghost">Features</Button></a>
                <a href="#pricing"><Button variant="ghost">Pricing</Button></a>
                <a href="#faq"><Button variant="ghost">FAQ</Button></a>
                <a href="#footer"><Button variant="ghost">Contact</Button></a>
            </div>
            <Button id='opendashboardbtn' variant={'outline'} onClick={()=>{HandleDashboardOpen()}}>{LoadingButtons.opendashboardbtn ? (<Spinner></Spinner>) : ('Open Dashboard')}</Button>
            </div>
        </div>


        {/* HERO */}

        <div id='herodetails' className="flex flex-col items-center gap-5 mb-30">
            <h1 className='font-semibold text-7xl'>Simple Analytics</h1>
        <h1 className='font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-300 text-7xl'>Made Simple</h1>
        <p className='text-xl text-center text-gray-700'>Track every page view and user interaction in minutes. <br></br>
        Get insights with date filtering, geolocation, and robust multi-layer security — all ready to go.</p>

        <div className="flex gap-3">
            <a href="#earlyaccess"><Button>Get Started</Button></a>
            <a href="https://github.com/lukajekic" target='_blank'><Button variant={'outline'}><Github></Github> GitHub</Button></a>
        </div>
        </div>

    </div>



    <div id='earlyaccess' className="h-fit p-10 flex flex-col items-center scroll-mt-[60px]">
        <h1 className='font-semibold text-5xl'>Early Access</h1>
<p className='text-xl text-center text-gray-700 mt-4'>Metrica Cloud is now in early access. Enter your email to be contacted with your early access license key.</p>

{subscribed === false ? (
  <form onSubmit={(e)=>{[e.preventDefault(), HandleSubscription()]}}>
    <div className="flex gap-3 w-[500px] mt-20 pb-20">
    <Input className='h-10' required type='email' placeholder='Email' value={earlyAccessEmail} onChange={(e)=>{setEarlyAccessEmail(e.target.value)}} />
    <Button className='h-10' type='submit' variant='default' id='subscribebtn' >{LoadingButtons.subscribebtn ? (<Spinner className='text-white'></Spinner>) : ('Apply')}</Button>
  </div>
  </form>
) : (
  <p className="text-xl text-center text-gray-700 mt-20 inline-flex items-center gap-3"><Mail></Mail>{subscriptionResponse}</p>
)}

</div>


<section id='features' className='h-fit p-10 flex flex-col gap-5 items-center scroll-mt-[60px]'>
            <div className='w-fit self-start'>
                <h1 className='font-semibold text-5xl w-fit text-left'>Key Features</h1>
                <div className="h-[1px] bg-gradient-to-r from-black to-white mt-2"></div>
            </div>


            <div className="w-full grid grid-cols-4 gap-10 justify-between mt-5">
                <div id="item1" className='w-full'>
                    <Card className='hover:shadow-md transition-shadow' onMouseEnter={()=>{rotateIcon('icon1', true)}} onMouseLeave={()=>{rotateIcon('icon1', false)}}>
                        <CardHeader>
                            <CardTitle><div id="icon1" className="bg-black p-2 text-white w-fit rounded-[50%] m-auto  transition-transform duration-300 ease-out"><ChartSpline className='size-7'></ChartSpline></div></CardTitle>
                            <CardTitle className='text-center mt-2'>Multiple Data</CardTitle></CardHeader>

                            <CardContent>
                                <CardDescription className='text-center'>Metrica Cloud Dashboard delivers customizable analytics for multiple projects, tracking geolocation, views, and events with unique insights.</CardDescription>
                            </CardContent>
                    </Card>
                </div>


                <div id="item2" className='w-full'>
                    <Card className='hover:shadow-md transition-shadow' onMouseEnter={()=>{rotateIcon('icon2', true)}} onMouseLeave={()=>{rotateIcon('icon2', false)}}>
                        <CardHeader>
                            <CardTitle><div id="icon2" className="bg-black p-2 text-white w-fit rounded-[50%] m-auto  transition-transform duration-300 ease-out"><Key className='size-7'></Key></div></CardTitle>
                            <CardTitle className='text-center mt-2'>Lifetime License</CardTitle></CardHeader>

                            <CardContent>
                                <CardDescription className='text-center'>Get one license per project and enjoy all features without recurring fees. Perfect for teams or long-term projects that need reliable analytics.</CardDescription>
                            </CardContent>
                    </Card>
                </div>


                <div id="item3" className='w-full'>
                    <Card className='hover:shadow-md transition-shadow' onMouseEnter={()=>{rotateIcon('icon3', true)}} onMouseLeave={()=>{rotateIcon('icon3', false)}}>
                        <CardHeader>
                            <CardTitle><div id="icon3" className="bg-black p-2 text-white w-fit rounded-[50%] m-auto  transition-transform duration-300 ease-out"><Bolt className='size-7'></Bolt></div></CardTitle>
                            <CardTitle className='text-center mt-2'>Easy SDK</CardTitle></CardHeader>

                            <CardContent>
                                <CardDescription className='text-center'>Integrate Metrica quickly using our lightweight npm SDK. Set up tracking in minutes with minimal code and start collecting data immediately.</CardDescription>
                            </CardContent>
                    </Card>
                </div>

<div id="item4" className='w-full'>
                    <Card className='hover:shadow-md transition-shadow' onMouseEnter={()=>{rotateIcon('icon4', true)}} onMouseLeave={()=>{rotateIcon('icon4', false)}}>
                        <CardHeader>
                            <CardTitle><div id="icon4" className="bg-black p-2 text-white w-fit rounded-[50%] m-auto  transition-transform duration-300 ease-out"><PanelsTopLeft className='size-7'></PanelsTopLeft></div></CardTitle>
                            <CardTitle className='text-center mt-2'>Customizable Views</CardTitle></CardHeader>

                            <CardContent>
                                <CardDescription className='text-center'>Tailor sidebar for each project individually. Filter and organize the statistics that matter most to your workflow, making analytics simple and clear.</CardDescription>
                            </CardContent>
                    </Card>
                </div>
                
            </div>

</section>


<section id='pricing' className='flex flex-col items-center gap-5 pb-5 scroll-mt-[90px]'>
        <h1 className='font-semibold text-5xl'>Pricing</h1>
        <div id="pricing" className="flex w-full justify-center mt-5 h-fit items-center gap-5">
            <Card className='h-[415px] w-[300px] bg-gray-100'></Card>
            <Card className='w-100 shadow-md'>
                <CardHeader>
                    <CardTitle className='text-3xl'>Free</CardTitle>
                    <CardDescription>The Free Plan provides complete access to all features, once your early access request has been approved.</CardDescription>
                </CardHeader>

                <CardContent className='flex items-center gap-1 border-b-1 border-gray-700/25 pb-2'><div className="flex flex-col h-[35px] items-start text-[15px]">$</div><span className='text-[35px] font-bold'>0.00</span><div className="flex flex-col h-[35px] items-end text-[15px] text-gray-700"><div className="h-[15px]"></div><span className='text-gray-500'>/month</span></div></CardContent>
            <CardContent>
                <ul className="list-none"> {/* uklanja default bullets */}
      <li className="flex items-center gap-2 text-gray-700 pb-1">
        <Check className="w-4 h-4 text-gray-700" />
        Unlimited requests per project
      </li>


      <li className="flex items-center gap-2 text-gray-700 pb-1">
        <Check className="w-4 h-4 text-gray-700" />
        Unlimited pages and events per project
      </li>


      <li className="flex items-center gap-2 text-gray-700 pb-1">
        <Check className="w-4 h-4 text-gray-700" />
        <span className="flex-1">CORS protection for secure cross-origin requests</span>
      </li>


      <li className="flex items-center gap-2 text-gray-700 pb-1">
        <Check className="w-4 h-4 text-gray-700" />
        <span className="flex-1">Data privacy safeguards to prevent access outside Metrica Cloud</span>
      </li>


      <li className="flex items-center gap-2 text-gray-700 pb-1">
        <Check className="w-4 h-4 text-gray-700" />
        Basic analytics dashboard for project insights
      </li>
      
    </ul>

    <a href="#earlyaccess"><Button variant={'default'} className='w-full mt-5'>Enroll</Button></a>
            </CardContent>
            </Card>
            <Card className='h-[415px] w-[300px] bg-gray-100'></Card>

        </div>

</section>



<section id='faq' className='h-fit p-10 pb-0 flex flex-col gap-5 items-center overflow-x-hidden scroll-mt-[60px]'>
            <div className='w-fit self-end'>
                <h1 className='font-semibold text-5xl w-fit text-left'>Have any Questions?</h1>
                <div className="h-[1px] bg-gradient-to-l from-black to-white mt-2"></div>
            </div>

            <div className="overflow-x-hidden"> 
  <div className="w-screen mt-5 flex">
    <div className="w-[30%] magicpattern_section"></div>
    <div className="w-[70%] h-fit py-5">
        {/* FAQ ACCORDION */}
         <Accordion
      type="single"
      collapsible
      className="w-[70%] m-auto"
      defaultValue="item-1"
    >
{freePlanFAQ.map((item, index)=>{
    return (
              <AccordionItemComponent index={index} question={item.question} answer={<p>{item.answer}</p>}></AccordionItemComponent>

    )
})}   
    </Accordion>
        {/* END FAQ ACCORDION */}
    </div>
  </div>
</div>




            </section>



            <section id='footer' className='flex flex-col gap-5 pb-5 items-center'>
                        <h1 className='font-semibold text-5xl text-center mt-5'>Wrapping Up</h1>
                        <div className="w-full grid grid-cols-2 grid-rows-1">
                            <div className="h-full p-15 flex items-center">
                                <div className="w-fit flex flex-col m-auto">
                                    <p className="text-gray-700 max-w-[500px] m-auto">
                                    “I’ve tried to answer as many questions as I could here, but if anything is still unclear, just reach out.
This is my first project of 2026, and I’ve started it with care and attention — Metrica Cloud is my way of building something useful and reliable for at least, all of my personal projects.
                                </p>

                                <img src={signature} alt="" className='w-50' />
                                            <a href="https://github.com/lukajekic" className='mt-5' target='_blank'><Button variant={'outline'}><Github></Github> GitHub</Button></a>

                                </div>
                                
                            </div>
                            <div className="h-fit p-10">
                                                        <h1 className='font-semibold text-3xl text-center mt-5'>Contact Me</h1>
                            <form id='contactform' action="" onSubmit={(e)=>{HandelSubmit(e)}} className="border-1 border-gray-300 rounded-xl p-5 max-w-[600px] m-auto mt-5">
                                <FieldGroup>
                                    <FieldSet>
                                        <FieldLegend>Your Name</FieldLegend>
                                        <Input name='name' type='text' value={formdata.name} required onChange={(e)=>{onFormValuesChange(e)}}></Input>
                                        <FieldDescription>Enter Your Name here</FieldDescription>
                                    </FieldSet>

                                    <FieldSet>
                                        <FieldLegend>Your Email</FieldLegend>
                                        <Input name='email' type='email' value={formdata.email} required onChange={(e)=>{onFormValuesChange(e)}}></Input>
                                        <FieldDescription>Enter Your Email here</FieldDescription>
                                    </FieldSet>

                                    <FieldSet>
                                        <FieldLegend>Your Message</FieldLegend>
                                        <Textarea className='max-h-[64px] resize-none' name='message' value={formdata.message} required onChange={(e)=>{onFormValuesChange(e)}}></Textarea>
                                        <FieldDescription>Enter Your Contact message here</FieldDescription>
                                    </FieldSet>

                                    <Field orientation={'horizontal'}>
                                    <Button className='disabled:bg-gray-400 disabled:text-black' type='submit' id='submitcontactbtn'>Submit</Button>
                                </Field>
                                </FieldGroup>

                                
                            </form>

                            </div>
                        </div>


            </section>









            {/* login dialog */}
            <Dialog open={loginDialogOpen}>

  <DialogContent className="sm:max-w-[425px]">
    {/* Formu stavljaš OVDE */}
    <form onSubmit={(e) => {[
      e.preventDefault(),
      HandleLogin()
    ]}}>
      <DialogHeader>
        <DialogTitle>Login</DialogTitle>
        <DialogDescription>
          Enter your Metrica Cloud credentials.
        </DialogDescription>
      </DialogHeader>



      {wrongCredentials && (
        <Alert variant="destructive" className='mt-2'>
        <AlertCircleIcon />
        <AlertTitle>Invalid credentials.</AlertTitle>
        <AlertDescription>
          <p>Please verify these fields:</p>
          <ul className="list-inside list-disc text-sm">
            <li>Email Address</li>
            <li>Password and OTP (should be merged, for example: mypassword000000)</li>
          </ul>
        </AlertDescription>
      </Alert>
      )}

      <div className="grid gap-4 py-4">
        <div className="grid gap-3">
          <Label htmlFor="login-email">Email</Label>
          <Input
          ref={loginEmailField}
            id="login-email" 
            name="login-email" 
            type="email" // Dodaj tip za bolju validaciju
            placeholder="user@mail.com" 
            required
            value={loginData.email}
            onChange={(e)=>{setLoginData(prev => ({...prev, email: e.target.value}))}}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="login-password">Password with OTP</Label>
          <Input
          ref={loginPasswordField} 
            id="login-password" 
            name="login-password" 
            type="password" 
            required 
            value={loginData.password}
            onChange={(e)=>{setLoginData(prev =>({...prev, password: e.target.value}))}}
          />
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={()=>{[setLoginDialogOpen(false), setTimeout(() => {setLoginData({email: "", password: ""})}, 500)]}}>Cancel</Button>
        </DialogClose>
        <Button id='loginsubmitbtn' type="submit">{LoadingButtons.loginsubmitbtn ? (<Spinner></Spinner>) : ('Log In')}</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
            {/* end login dialog */}
    </>
  )
}

export default Landing