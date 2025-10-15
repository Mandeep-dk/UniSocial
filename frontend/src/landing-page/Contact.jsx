import React, { useState } from 'react';
import { contactApi } from '../api';

function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const res = await contactApi({
                name,
                email,
                message,
            });
            console.log(res.data);
            setStatus('success');
            setName('');
            setEmail('');
            setMessage('');
        } catch (e) {
            console.error(e.message);
            setStatus('error');
        }
    };

    return (
        <div id="contact" className='py-12 sm:py-16 md:py-20 bg-white min-h-screen flex items-center'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
                <div className='flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16'>
                    {/* Left Section */}
                    <div className='flex-1'>
                        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6'>Reach out</h1>
                        <p className='text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg'>
                            Have a question or need assistance? Reach out to me. I am here to help with any inquiries you may have.
                        </p>

                        <div className='space-y-4 sm:space-y-6'>
                            <div>
                                <h3 className='font-semibold mb-1 sm:mb-2 text-base sm:text-lg'>Response Time</h3>
                                <p className='text-gray-600 text-sm sm:text-base'>I typically respond within 24 hours</p>
                            </div>
                            <div>
                                <h3 className='font-semibold mb-1 sm:mb-2 text-base sm:text-lg'>Email</h3>
                                <p className='text-gray-600 text-sm sm:text-base break-all'>mandeepdeka492@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Form */}
                    <div className='flex-1'>
                        <div className='bg-gray-50 rounded-xl p-6 sm:p-8'>
                            <form onSubmit={handleSubmit} className='flex flex-col gap-4 sm:gap-6'>
                                <div>
                                    <label className='block text-sm font-medium mb-2'>Name</label>
                                    <input 
                                        type="text" 
                                        className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm sm:text-base' 
                                        placeholder='Your name'
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className='block text-sm font-medium mb-2'>Email</label>
                                    <input 
                                        type="email" 
                                        className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm sm:text-base' 
                                        placeholder='your.email@example.com'
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className='block text-sm font-medium mb-2'>Message</label>
                                    <textarea 
                                        className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-black text-sm sm:text-base' 
                                        rows='5'
                                        placeholder='How can we help you?'
                                        value={message} 
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    />
                                </div>

                                {status === 'success' && (
                                    <p className='text-green-600 text-sm'>Message sent successfully!</p>
                                )}
                                {status === 'error' && (
                                    <p className='text-red-600 text-sm'>Failed to send message. Please try again.</p>
                                )}

                                <button 
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className='w-full bg-black text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition text-sm sm:text-base'
                                >
                                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact;