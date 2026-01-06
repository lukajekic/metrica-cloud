import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import axios from 'axios'
import {ProjectsGlobalProvider, UserDataProvider} from './context/GlobalContext.tsx'

axios.defaults.withCredentials = true
axios.interceptors.response.use(response =>{
  return response
}, error =>{
  if (error.response.status === 401 ) {
    
    if (location.pathname.includes('dashboard')) {
      console.log("Nije autorizovano")
    location.href = '/'
    }
  } 

  return Promise.reject(error)
})
createRoot(document.getElementById('root')!).render(

    <UserDataProvider>
      <ProjectsGlobalProvider>
        <App />
      </ProjectsGlobalProvider>
    </UserDataProvider>
)
