import type { ColumnDef } from "@tanstack/react-table"
import type React from "react"



export type WaitlistItem = {
    _id: string,
    email: string, 
    status: 'accepted' | 'waiting',
    date: string,
    actions: React.ReactNode
}

export const columns: ColumnDef<WaitlistItem>[] = [
    {
        accessorKey: 'email',
        header: 'Email'
    },


    {
        accessorKey: 'status',
        header: 'Application Status'
    },

    {
        accessorKey: 'createdAt',
        header: 'Date of Application'
    },

    {
        accessorKey: '_id',
        header: 'Application ID'
    },

    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({row})=>{
            return row.original.actions
        }
    }
]