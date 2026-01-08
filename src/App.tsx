
import './App.css'
// @ts-check
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import { Toaster } from "@/components/ui/sonner"
import DashboardHome from './pages/DashboardHome';
import ProjectProtectionFunc from './utils/ProjectProtection';
import SwitchProject from './pages/SwitchProject';
import DashboardPageViews from './pages/DashboardPageViews';
import DashboardPageConfig from './pages/DashboardPageConfig/DashboardPageConfig';
import DashboardPageGeolocation from './pages/DashboardPageGeolocation/DashboardPageGeolocation';
import EarlyAccessAcountCreation from './pages/EarlyAccessAcountCreation';
import CreateProject from './pages/CreateProject';

function App() {
  return (
    <>
    <Toaster></Toaster>
    <BrowserRouter>

    <Routes>
      <Route path='/' element={<Landing></Landing>}></Route>
      <Route path='/account/create/earlyaccess' element={<EarlyAccessAcountCreation></EarlyAccessAcountCreation>}></Route>
      <Route path='/switch' element={<SwitchProject></SwitchProject>}></Route>
      <Route path='/dashboard/home' element={<DashboardHome></DashboardHome>}></Route>
      <Route path='/dashboard/page/views' element={<DashboardPageViews></DashboardPageViews>}></Route>
      <Route path='/dashboard/page/configuration' element={<DashboardPageConfig></DashboardPageConfig>}></Route>
      <Route path='/dashboard/page/geolocation' element={<DashboardPageGeolocation></DashboardPageGeolocation>}></Route>
      <Route path='/dashboard/dev' element={<p>dev</p>}></Route>
      <Route path='/project/create' element={<CreateProject></CreateProject>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
