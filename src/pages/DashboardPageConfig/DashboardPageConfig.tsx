import DashboardBlock from '@/components/custom/DashboardBlock'
import DashboardHeader from '@/components/custom/DashboardHeader'
import DashboardPageTitle from '@/components/custom/DashboardPageTitle'
import MainContent from '@/components/custom/MainContent'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { AlertCircleIcon, Pencil, PlusSquare, TabletSmartphone, Trash, Users } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from './data-table'
import { columns } from './columns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FieldDescription } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'

type Page = {
  _id: string,
  title: string,
  projectID: string,
  path: string,
  index?:number,
  options?: React.ReactNode
}



const DashboardPageConfig = () => {
const [pages, setPages] = useState<Page[]>([])
const [tableData, setTableData] = useState<Page[]>([])
const [deletionID, setDeletionID] = useState<string>("")
const [openDeletionDialog, setOpenDeletionDialog] = useState<boolean>(false)
const [openCreationDialog, setOpenCreationDialog] = useState<boolean>(false)
const [creation400err, setcreation400err] = useState<string>("")
const [creationFormData, setCreationFormData] = useState({
  title: "",
  path: ""})

const [updateData, setUpdateData] = useState<Page & {pathContaminated:boolean} | null>(null)
const [openEditDialo, setOpenEditDialog] = useState<boolean>(false)
const [updatePath, setUpdatePath] = useState<boolean>(true)
useEffect(()=>{
//onready
  getPages()
}, [])
const getPages = async()=>{
    let pages = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/page/get`, {
    projectID: sessionStorage.getItem('ActiveProject') //stranica je vec osigurana od nevalidnih id-eva, ali i backend ima zastitu vlasnistva
  })



  if (pages.status === 200) {
setPages(pages.data)
setTableData(pages.data.map((item:Page,index:number)=>{
                  item.index = index + 1
                  item.options = <div className="flex gap-2"><Button variant={'outline'} onClick={()=>{[setUpdatePath(true), setUpdateData({...item, pathContaminated: false}), setOpenEditDialog(true)]}}><Pencil></Pencil></Button>   <Button variant={'outline'} onClick={()=>{propmptDeletion(item._id)}}><Trash></Trash></Button></div>
                return item
              }))
  } else {
    toast('Greska prilikom fetchovanja stranica')
  }
  }

const propmptDeletion = async(pageID:string)=>{
  if (pageID) {
    setDeletionID(pageID)
    setOpenDeletionDialog(true)
  } else {
    toast.error('No deletion ID provided.')
  }
  
}



const deletePage = async(pageID:string) =>{
  try {
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND}/metrica/page/${sessionStorage.getItem('ActiveProject')}/${pageID}`)

    if (response.status === 200) {
      getPages()
      toast.success('Dleted page successfuly')
      setOpenDeletionDialog(false)
    }
  } catch (error) {
    toast.error('Error while deleting page.')
    setOpenDeletionDialog(false)
  }
}



const handleCreation = async()=>{
  setcreation400err("")
  try {
    if (!creationFormData.path || !creationFormData.title) {
      return
    }

    const response = await axios.post(`${import.meta.env.VITE_BACKEND}/metrica/page`, {
      title: creationFormData.title,
      path: creationFormData.path,
      projectID: sessionStorage.getItem('ActiveProject')
    })

    if (response.status === 201) {
      getPages()
      setOpenCreationDialog(false)
      setTimeout(() => {
        setCreationFormData({
          title: "",
          path: ""
                })
      }, 500);
    }
  } catch (error) {
    if (error.response.status === 400) {
      setcreation400err(error?.response?.data?.message)
    }
  }
}













const handleUpdate = async()=>{
  try {
    if(updateData) {
      if (!updateData.path || !updateData.title) {
      return
    }
    } else {
      return
    }
let updateOBJ = {}
  updateOBJ = {
    _id: updateData._id,
    title: updateData.title,
    projectID: sessionStorage.getItem('ActiveProject'),
    ...(updateData.pathContaminated === true && {
      path: updateData.path,
    PATHUPDATE: updatePath
    })

  }

    const response = await axios.put(`${import.meta.env.VITE_BACKEND}/metrica/page`, updateOBJ)

    if (response.status === 200) {
      getPages()
      setOpenEditDialog(false)
      setTimeout(() => {
        setUpdateData(null)
        setUpdatePath(false)
      }, 500);
    }
  } catch (error) {
    setTimeout(() => {
        setUpdateData(null)
        setUpdatePath(false)
      }, 500);
    if (error.response.status === 400 && error.response.data.message) {
      toast.error(error.response.data.message)
    } else {
      toast.error("Couldn't update Page.")
    }
  }
}






  return (
    <>
    <div id='dashboard-page-config'>
        <DashboardHeader></DashboardHeader>
        <MainContent enforceProtection>
          <DashboardPageTitle title='Pages Configuration' subtitle='Setup new and view existing tracked pages.'></DashboardPageTitle>
          <div className="w-full flex flex-col items-end gap-3">
            <Button onClick={()=>{setOpenCreationDialog(true)}}><PlusSquare></PlusSquare> Create new Page</Button>
            <DashboardBlock title='My Pages'>
              <DataTable columns={columns} data={tableData}></DataTable>
            </DashboardBlock>
          </div>
        </MainContent>
    </div>
    
    
    
    
    
    
    
     <AlertDialog open={openDeletionDialog}>
     
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to delete the page?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete page and all analytics linked to it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>{[setOpenDeletionDialog(false), setDeletionID("")]}}>Cancel</AlertDialogCancel>
          <Button variant={'destructive'} onClick={()=>{deletePage(deletionID)}}>Delete</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>







    <Dialog open={openCreationDialog}>

  <DialogContent className="sm:max-w-[425px]">
    {/* Formu stavljaš OVDE */}
    <form onSubmit={(e) => {[
      e.preventDefault(),
      handleCreation()
    ]}}>
      <DialogHeader>
        <DialogTitle>Create Page</DialogTitle>
        <DialogDescription>
          Please fill all fields.
        </DialogDescription>
      </DialogHeader>



      {creation400err && (
        <Alert variant="destructive" className='mt-2'>
        <AlertCircleIcon />
        <AlertTitle>Invalid request.</AlertTitle>
        <AlertDescription>
          <p>Message:</p>
          <p className='text-sm'>{creation400err}</p>
        </AlertDescription>
      </Alert>
      )}

      <div className="grid gap-4 py-4">
        <div className="grid gap-3">
          <Label htmlFor="create-title">Page Title</Label>
          <Input
            id="create-title" 
            name="title" 
            type="text" // Dodaj tip za bolju validaciju
            placeholder="" 
            required
            value={creationFormData.title}
            onChange={(e)=>{setCreationFormData(prev=>({...prev, title: e.target.value}))}}
            
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="create-path">Location Path</Label>
          <Input
            id="create-path" 
            name="path" 
            type="text" 
            required 
            value={creationFormData.path}
            onChange={(e)=>{setCreationFormData(prev =>({...prev, path: e.target.value}))}}
 
          />
          <FieldDescription>Please enter location path starting with "/":<br></br>/ (root)<br></br>/about for (example.com/about)<br></br>/oursite.html (for .html suffix)</FieldDescription>
        </div>



        
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={()=>{[setOpenCreationDialog(false), setTimeout(() => {setCreationFormData({title: "", path: ""})}, 500)]}}>Cancel</Button>
        </DialogClose>
        <Button id='loginsubmitbtn' type="submit" onClick={()=>{console.log(creationFormData)}}>Submit</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>











<Dialog open={openEditDialo}>

  <DialogContent className="sm:max-w-[425px]">
    <form onSubmit={(e) => {[
      e.preventDefault(),
      handleCreation()
    ]}}>
      <DialogHeader>
        <DialogTitle>Edit Page</DialogTitle>
        <DialogDescription>
          Please fill all fields.
        </DialogDescription>
      </DialogHeader>



      

      <div className="grid gap-4 py-4">
        <div className="grid gap-3">
          <Label htmlFor="create-title">Page Title</Label>
          <Input
            id="create-title" 
            name="title" 
            type="text" // Dodaj tip za bolju validaciju
            placeholder="" 
            required
            value={updateData?.title}
            onChange={(e)=>{setUpdateData(prev=>({...prev, title: e.target.value}))}}
            
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="create-path">Location Path</Label>
          <Input
            id="create-path" 
            name="path" 
            type="text" 
            required 
            value={updateData?.path}
            onChange={(e)=>{setUpdateData(prev =>({...prev, path: e.target.value, pathContaminated: true}))}}
 
          />
          <FieldDescription>Please enter location path starting with "/":<br></br>/ (root)<br></br>/about for (example.com/about)<br></br>/oursite.html (for .html suffix)</FieldDescription>
        </div>





        <div className="w-full">
          <Label className="hover:bg-blue/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
        <Checkbox
          id="toggle-2"
          checked={updatePath}
          onCheckedChange={(checked)=>{setUpdatePath(checked === true )}} //navodno postoji polovicni checked pa kao fallback je onda true 
          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
        />
        <div className="grid gap-1.5 font-normal">
          <p className="text-sm leading-none font-medium">
            Force Analytics Update
          </p>
          <p className="text-muted-foreground text-sm">
            {`Your current analytics for page "${updateData?.path}" is linked to current path, do you want to link them to new Page path if you change it in the field above.`}
            <br></br>
            <span className='text-red-600'>If you decide to not force the update, analytics for this page will be deleted.</span>
          </p>
        </div>
      </Label>
        </div>



      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={()=>{[setOpenEditDialog(false), setTimeout(() => {setUpdateData(null)}, 500)]}}>Cancel</Button>
        </DialogClose>
        <Button id='loginsubmitbtn' type="submit" onClick={()=>{handleUpdate()}}>Update</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>





    </>
  )
}

export default DashboardPageConfig