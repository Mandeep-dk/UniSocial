import React from 'react'
import { useNavigate } from 'react-router-dom'
function About() {
    
    const navigate=useNavigate();
 return (
    
    <>
    
    <div 
      id="about" 
      className="px-6 py-20 min-h-screen bg-gray-50 flex items-center"
    >
      <div className='max-w-6xl mx-auto'>
        <div className='max-w-3xl mx-auto text-center'>
          <h1 className="text-4xl font-bold mb-6">
            A discussion space built for AdtU students
          </h1>

          <p className="mb-8 text-gray-700 leading-relaxed text-lg">
            UniSocial is an independent platform designed exclusively for AdtU students. 
            Here, you can connect with classmates, join discussions, and share ideas in a safe, 
            student-friendly environment.
          </p>

          <div className='grid md:grid-cols-3 gap-8 mb-10'>
            <div>
              <div className='w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-white text-lg'>✓</span>
              </div>
              <h3 className='font-semibold mb-2'>Connect with classmates</h3>
              <p className='text-gray-600 text-sm'>Build meaningful connections with students across campus</p>
            </div>

            <div>
              <div className='w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-white text-lg'>✓</span>
              </div>
              <h3 className='font-semibold mb-2'>Join discussions</h3>
              <p className='text-gray-600 text-sm'>Engage in conversations about academics, hobbies, and campus life</p>
            </div>

            <div>
              <div className='w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-white text-lg'>✓</span>
              </div>
              <h3 className='font-semibold mb-2'>Safe environment</h3>
              <p className='text-gray-600 text-sm'>A student-friendly space designed with your privacy in mind</p>
            </div>
          </div>

          <button onClick={()=>navigate("/")} className="border rounded-lg px-8 py-3 bg-rose-500 text-white hover:bg-rose-600 transition">
            Sign up now and start the conversation!
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

export default About
