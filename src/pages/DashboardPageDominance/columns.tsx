import type { ColumnDef } from "@tanstack/react-table"
import type React from "react"



export type WaitlistItem = {
    title: string, 
    path: string,
    countries: string[],
    share: number,
    count: number,
    cell_green_bg: string,
    date: string
}

export const columns: ColumnDef<WaitlistItem>[] = [
    {
        accessorKey: 'title',
        header: 'Page Title',
        cell: ({row, getValue}) => (
            <div className="w-full font-bold break-normal">{getValue()}</div>
        )
    },


    {
        accessorKey: 'path',
        header: 'Page Path'
    },

    {
        accessorKey: 'countries',
        header: 'Dominating Countries',
        cell: ({row, getValue}) => {
            const countries = row.original.countries
            return (
            <div className="w-full flex gap-1 flex-wrap">
                {getValue().map(item => {
                    return (
                        <div className="w-fit h-fit border-1 p-1 rounded">{item}</div>
                    )
                })}
            </div>
            )
    }
    },

    {
        accessorKey: 'share',
        header: ()=>(
            <div className="w-full text-center">Percent Share</div>
        ),
         cell: ({row, getValue}) => (
            <div className={`w-full h-full py-2 text-center text-white text-lg ${row.original.cell_green_bg}`}>{getValue()}  %</div>
        )

        
    },

    {
        accessorKey: 'count',
        header: () => (
            <div className="w-full text-right">View Count</div>
        ),
        cell: ({row, getValue}) => (
            <div className="w-full font-bold break-normal text-lg text-right">{getValue()}</div>
        )
    } 
]