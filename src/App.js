import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Components/Login'
import Purchase from './Components/Purchase'
import Navbar from './Components/Navbar'
import Sales from './Components/Sales'
import Inventory from './Components/Inventory'
import CustomerVendor from './Components/CustomerVendor'
import Prod from './Components/Prod'
import Company from './Components/Company'
import Payments from './Components/Payments'
import RegisterAd from './Components/RegisterAd'
import RegisterSA from './Components/RegisterSA'
import Home from './Components/Home'
import Reports from './Components/Reports'

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/purchase"
          element={
            <>
              <Purchase />

              <Prod />
            </>
          }
        />
       <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/sales' element={<Sales />} />
        <Route path='/inventory' element={<Inventory />} />
        <Route path='/customerven' element={<CustomerVendor />} />
        <Route path='/company' element={<Company />} />
        <Route path='/payments' element={<Payments />} />
        <Route path='/regad' element={<RegisterAd />} />
        <Route path='/regsa' element={<RegisterSA />} />
        <Route path='/reports' element={<Reports />} />








      </Routes>
    </div>
  )
}
