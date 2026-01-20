"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type React from "react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type Pagecolumns = {
  index?: number,
  title: string,
  path: string,
  options: React.ReactNode
}

export const columns: ColumnDef<Pagecolumns>[] = [
  {
    accessorKey: "index",
    header: "#",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },

  {
    accessorKey: 'options',
    header: 'Options',
    cell: ({row})=>{
      return row.original.options
    }
  }
]