import React from 'react'
import { useNavigate } from 'react-router-dom'

function HeroSection() {
    const navigate = useNavigate();
    
    return (
        <div id="home" className='min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8'>
            <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-4 sm:mb-6 leading-tight'>
                Your university, your voice
            </h1>
            <p className='text-base sm:text-lg md:text-xl text-gray-600 text-center max-w-2xl mb-6 sm:mb-8 px-4'>
                Connect, discuss, and share with your fellow AdtU students in one place
            </p>
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4'>
                <button 
                    onClick={() => navigate("/")} 
                    className='bg-rose-500 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-rose-600 transition text-sm sm:text-base w-full sm:w-auto'
                >
                    Get Started
                </button>
            </div>
        </div>
    )
}

export default HeroSection