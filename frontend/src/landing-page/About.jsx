import React from 'react'
import { useNavigate } from 'react-router-dom'

function About() {
    const navigate = useNavigate();
    
    return (
        <div 
            id="about" 
            className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 min-h-screen bg-gray-50 flex items-center"
        >
            <div className='max-w-6xl mx-auto w-full'>
                <div className='max-w-3xl mx-auto text-center'>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-4">
                        A discussion space built for AdtU students
                    </h1>

                    <p className="mb-6 sm:mb-8 text-gray-700 leading-relaxed text-base sm:text-lg px-4">
                        UniSocial is an independent platform designed exclusively for AdtU students. 
                        Here, you can connect with classmates, join discussions, and share ideas in a safe, 
                        student-friendly environment.
                    </p>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10 px-4'>
                        <div className='text-center'>
                            <div className='w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                                <span className='text-white text-lg'>✓</span>
                            </div>
                            <h3 className='font-semibold mb-2 text-base sm:text-lg'>Connect with classmates</h3>
                            <p className='text-gray-600 text-sm'>Build meaningful connections with students across campus</p>
                        </div>

                        <div className='text-center'>
                            <div className='w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                                <span className='text-white text-lg'>✓</span>
                            </div>
                            <h3 className='font-semibold mb-2 text-base sm:text-lg'>Join discussions</h3>
                            <p className='text-gray-600 text-sm'>Engage in conversations about academics, hobbies, and campus life</p>
                        </div>

                        <div className='text-center'>
                            <div className='w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                                <span className='text-white text-lg'>✓</span>
                            </div>
                            <h3 className='font-semibold mb-2 text-base sm:text-lg'>Safe environment</h3>
                            <p className='text-gray-600 text-sm'>A student-friendly space designed with your privacy in mind</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate("/signup")} 
                        className="border rounded-lg px-6 sm:px-8 py-2 sm:py-3 bg-rose-500 text-white hover:bg-rose-600 transition text-sm sm:text-base w-full sm:w-auto"
                    >
                        Sign up now and start the conversation!
                    </button>
                </div>
            </div>
        </div>
    )
}

export default About
