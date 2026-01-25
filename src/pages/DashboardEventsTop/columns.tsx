import type { ColumnDef } from "@tanstack/react-table"
import type React from "react"



export type TopPageItem = {
    index: number,
    title: string,
    path: string,
    triggers: number,
    uniqueTriggers: number,
    eventData: {
        description: string,
        title: string
    }
}

export const columns: ColumnDef<TopPageItem>[] = [
    {
        accessorKey: "index",
        header: "#"
    },

    {
        id: "title",
        header: "Event",
        accessorFn: (row)=> row?.eventData?.title
    },

    {
        id: "description",
        header: "Description",
        accessorFn: (row) => row?.eventData?.description
    },

    {
        accessorKey: "triggers",
        header: "Total Event Triggers"
    },

    {
        accessorKey: "uniqueTriggers",
        header: "Total Unique Triggers"
    }
]