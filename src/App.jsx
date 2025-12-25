import React, { useState } from 'react'
import './App.css'
import {Routes, Route, Navigate} from "react-router-dom"
import LandingPage from './pages/landing'
import LoginPage from './pages/login'
import SignupPage from './pages/signup'
import Home from './pages/home'
import Dashboard from './pages/Dashboard'
import { useAuth } from './context/AuthContext'
import FileUploadArea from './components/pages/test'



const ProtectedRoute = ({ children }) => {
  const { admin } = useAuth();
  return admin ? children : <Navigate to="/login" />;
};
function App() {

  return (
   
    <Routes>
      
      <Route path='/' element={<Navigate to="/landing"/>}/>
      <Route path='/landing' element={<LandingPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/signup' element={<SignupPage/>}/>
      <Route path='test' element = {<FileUploadArea/>}/>

      <Route path='/home' element={ 
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>}/>
      <Route path='/dashboard' element={ 
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }/>

    </Routes>
  
  )
}

export default App
