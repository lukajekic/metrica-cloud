
import './App.css'
// @ts-check
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import { Toaster } from "@/components/ui/sonner"
import DashboardHome from './pages/DashboardHome';
import ProjectProtectionFunc from './utils/ProjectProtection';
import SwitchProject from './pages/SwitchProject';

function App() {
ProjectProtectionFunc()
  return (
    <>
    <Toaster></Toaster>
    <BrowserRouter>

    <Routes>
      <Route path='/' element={<Landing></Landing>}></Route>
      <Route path='/switch' element={<SwitchProject></SwitchProject>}></Route>
      <Route path='/dashboard/home' element={<DashboardHome></DashboardHome>}></Route>
      <Route path='/dashboard/dev' element={<p>dev</p>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
