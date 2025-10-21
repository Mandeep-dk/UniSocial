import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className='sticky top-0 bg-white shadow-sm z-50'>
            <div className='flex items-center p-4 px-4 sm:px-6 lg:px-10 justify-between'>
                <a href='/'  className='text-2xl sm:text-3xl font-bold text-rose-500'>UniSocial</a>

                {/* Desktop Navigation */}
                <nav className='hidden md:flex text-base lg:text-lg space-x-4 lg:space-x-6'>
                    <ScrollLink 
                        to="home" 
                        smooth={true} 
                        duration={500} 
                        className='cursor-pointer hover:text-rose-500 transition'
                    >
                        Home
                    </ScrollLink>
                    <ScrollLink 
                        to="about" 
                        smooth={true} 
                        duration={500} 
                        className='cursor-pointer hover:text-rose-500 transition'
                    >
                        About
                    </ScrollLink>
                    <ScrollLink 
                        to="contact" 
                        smooth={true} 
                        duration={500} 
                        className='cursor-pointer hover:text-rose-500 transition'
                    >
                        Contact
                    </ScrollLink>
                </nav>

                {/* Desktop Auth Buttons */}
                <div className='hidden md:flex space-x-3 lg:space-x-4'>
                    <button 
                        className='bg-rose-500 px-4 lg:px-6 py-2 rounded-lg text-white hover:bg-rose-600 transition text-sm lg:text-base' 
                        onClick={() => navigate("/signIn")}
                    >
                        LogIn
                    </button>
                    <button 
                        className='border border-gray-300 px-4 lg:px-6 py-2 rounded-lg hover:bg-gray-50 transition text-sm lg:text-base'
                        onClick={() => navigate("/signup")}
                    >
                        SignUp
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className='md:hidden text-2xl'
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className='md:hidden bg-white border-t'>
                    <nav className='flex flex-col p-4 space-y-4'>
                        <ScrollLink 
                            to="home" 
                            smooth={true} 
                            duration={500} 
                            className='cursor-pointer hover:text-rose-500 transition py-2'
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </ScrollLink>
                        <ScrollLink 
                            to="about" 
                            smooth={true} 
                            duration={500} 
                            className='cursor-pointer hover:text-rose-500 transition py-2'
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </ScrollLink>
                        <ScrollLink 
                            to="contact" 
                            smooth={true} 
                            duration={500} 
                            className='cursor-pointer hover:text-rose-500 transition py-2'
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact
                        </ScrollLink>
                        <div className='flex flex-col space-y-3 pt-4 border-t'>
                            <button 
                                className='bg-rose-500 py-2 rounded-lg text-white hover:bg-rose-600 transition' 
                                onClick={() => {
                                    navigate("/signIn");
                                    setIsMenuOpen(false);
                                }}
                            >
                                LogIn
                            </button>
                            <button 
                                className='border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition'
                                onClick={() => {
                                    navigate("/signup");
                                    setIsMenuOpen(false);
                                }}
                            >
                                SignUp
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}

export default Header