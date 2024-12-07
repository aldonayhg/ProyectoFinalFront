import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CrearProducto from './Components/CrearProducto'
import DetalleProducto from './Components/DetalleProducto'
import MisReservas from './Components/MisReservas'

function App() {

  return (
    <>
      <CrearProducto />
      <DetalleProducto />
      <MisReservas />
    </>
  )
}

export default App
