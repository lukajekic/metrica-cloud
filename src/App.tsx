
import './App.css'
// @ts-check
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import { Toaster } from "@/components/ui/sonner"
import DashboardHome from './pages/DashboardHome';
import ProjectProtectionFunc from './utils/ProjectProtection';
import SwitchProject from './pages/SwitchProject';
import DashboardPageViews from './pages/DashboardPageViews/DashboardPageViews';
import DashboardPageConfig from './pages/DashboardPageConfig/DashboardPageConfig';
import DashboardPageGeolocation from './pages/DashboardPageGeolocation/DashboardPageGeolocation';
import EarlyAccessAcountCreation from './pages/EarlyAccessAcountCreation';
import CreateProject from './pages/CreateProject';
import Waitlist from './pages/AdminWaitlist/Waitlist';
import DashboardPageDominance from './pages/DashboardPageDominance/DashboardPageDominance';
import PrintApiKey from './pages/PrintApiKey';
import MyProfile from './pages/MyProfile';
import DashboardPagesTop from './pages/DashboardPagesTop/DashboardPagesTop';
import DashboardEventConfig from './pages/DashboardEventConfig/DashboardEventConfig';
import DashboardEventTriggers from './pages/DashboardEventTriggers/DashboardEventTriggers';
import DashboardEventsTop from './pages/DashboardEventsTop/DashboardEventsTop';
import DashboardEventGeolocation from './pages/DashboardEventGeolocation/DashboardEventGeolocation';
import DashboardEventDominance from './pages/DashboardEventDominance/DashboardEventDominance';

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
      <Route path='/dashboard/page/dominance' element={<DashboardPageDominance></DashboardPageDominance>}></Route>
      <Route path='/dashboard/page/top' element={<DashboardPagesTop></DashboardPagesTop>}></Route>
      <Route path='/dashboard/dev' element={<p>dev</p>}></Route>
      <Route path='/dashboard/projects/create' element={<CreateProject></CreateProject>}></Route>
      <Route path='/apikeyprint' element={<PrintApiKey></PrintApiKey>}></Route>
      <Route path='/dashboard/waitlist' element={<Waitlist></Waitlist>}></Route>
      <Route path='/dashboard/profile' element={<MyProfile></MyProfile>}></Route>



      {/* EVENTOVI */}
      <Route path='/dashboard/event/configuration' element={<DashboardEventConfig></DashboardEventConfig>}></Route>
      <Route path='/dashboard/event/triggers' element={<DashboardEventTriggers></DashboardEventTriggers>}></Route>
      <Route path='/dashboard/event/top' element={<DashboardEventsTop></DashboardEventsTop>}></Route>
      <Route path='/dashboard/event/geolocation' element={<DashboardEventGeolocation></DashboardEventGeolocation>}></Route>
      <Route path='/dashboard/event/dominance' element={<DashboardEventDominance></DashboardEventDominance>}></Route>

    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
