import React from 'react'
import { AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'


interface Props {
    index: number,
    question: string,
    answer: React.ReactNode
}

const AccordionItemComponent:React.FC<Props> = ({index, question, answer}) => {
  return (
    <AccordionItem value={`item-${index.toString()}`}>
        <AccordionTrigger className='font-semibold text-lg'>{question}</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 w-full">
          {answer}
        </AccordionContent>
      </AccordionItem>
  )
}

export default AccordionItemComponent