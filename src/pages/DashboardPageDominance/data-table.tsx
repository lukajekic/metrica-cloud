
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React, { useMemo } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const uniqueDates = useMemo(() => {
    if (!data) return []
    
    const dateStrings = data.map((item: any) => 
      new Date(item.date).toDateString()
    )
    
    const unique = Array.from(new Set(dateStrings))
    
    return unique
  }, [data])

  return (
    <div className="h-full max-h-full rounded-md border overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="font-bold">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {uniqueDates.length > 0 ? (
            uniqueDates.map((dateGroup) => {
              // Filtriramo redove za trenutni datum u mapi
              const rowsInGroup = table.getRowModel().rows.filter(
                (row) => new Date((row.original as any).date).toDateString() === dateGroup
              )

              return (
                <React.Fragment key={dateGroup}>
                  {/* Separator red */}
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableCell colSpan={columns.length} className="font-bold px-4">
                      {dateGroup}
                    </TableCell>
                  </TableRow>

                  {/* Redovi podataka */}
                  {rowsInGroup.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell className="py-0" key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </React.Fragment>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        <TableFooter className="sticky top-0 z-10 bg-background">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="font-bold">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableFooter>
      </Table>
    </div>
  )
}