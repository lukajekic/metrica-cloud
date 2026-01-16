import { Linkedin, Mail } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const ContactPlaceholderCard = () => {
  return (
     <div className='border-1 border-gray-700/20 rounded-lg striped'>
        <div className="flex flex-col justify-start gap-6 p-6">
          <p className='text-2xl font-bold'>Have suggestions to enrich this card?<br></br>Get in touch.</p>
              <div className="flex inline-flex items-center gap-2"><Mail className='w-[25px] h-[25px]'></Mail><div className='font-semibold hover:cursor-pointer flex-1' onClick={(e)=>{[navigator.clipboard.writeText(e.target.innerText), toast.success('Copied Email to your Clipboard.', {position: 'top-center'})]}}>lukajekic913@gmail.com</div></div>
              <div className="flex inline-flex items-center gap-2"><Linkedin className='w-[25px] h-[25px]'></Linkedin><a target='_blank' className='font-semibold hover:cursor-pointer' href='https://www.linkedin.com/in/luka-jeki%C4%87-5bab8a278/'>https://www.linkedin.com/in/luka-jeki%C4%87-5bab8a278/</a></div>

        </div>
        </div>
  )
}

export default ContactPlaceholderCard