import type { ColumnDef } from "@tanstack/react-table"
import type React from "react"



export type TopPageItem = {
    index: number,
    title: string,
    path: string,
    total: number,
    unique: number
}

export const columns: ColumnDef<TopPageItem>[] = [
    {
        accessorKey: "index",
        header: "#"
    },

    {
        accessorKey: "title",
        header: "Page"
    },

    {
        accessorKey: "path",
        header: "Path"
    },

    {
        accessorKey: "views",
        header: "Total Page Views"
    },

    {
        accessorKey: "uniqueViews",
        header: "Total Unique Views"
    }
]