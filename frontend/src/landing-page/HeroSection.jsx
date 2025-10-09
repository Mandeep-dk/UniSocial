import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

function HeroSection() {
    const navigate=useNavigate();
  return (
    <div id="home" className='min-h-screen flex flex-col items-center justify-center px-4'>
      <h1 className='text-6xl md:text-7xl font-bold text-center mb-6'>
        Your university, your voice
      </h1>
      <p className='text-xl text-gray-600 text-center max-w-2xl mb-8'>
        Connect, discuss, and share with your fellow AdtU students in one place
      </p>
      <div className='flex gap-4'>
        <button onClick={()=>Navigate("/")} className='bg-rose-500 text-white px-8 py-3 rounded-lg hover:bg-rose-800'>
          Get Started
        </button>
       
      </div>
    </div>
  )
}

export default HeroSection