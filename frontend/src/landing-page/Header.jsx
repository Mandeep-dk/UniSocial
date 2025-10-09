import React, {useEffect} from 'react'
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
function Header() {
    const navigate=useNavigate();
    return (
        <>
            <div className='flex items-center p-4 mx-10 justify-between'>
                <h1 className='text-3xl font-bold text-rose-500 '>UniSocial</h1>

                <div className='flex text-lg space-x-6 mx-auto'>
                    <ScrollLink to="home" smooth={true} duration={500} className='cursor-pointer'>
                        Home
                    </ScrollLink>
                    <ScrollLink to="about" smooth={true} duration={500} className='cursor-pointer'>
                        About
                    </ScrollLink>
                    <ScrollLink to="contact" smooth={true} duration={500} className='cursor-pointer'>
                        Contact
                    </ScrollLink>
                </div>

                <div className='flex space-x-4'>

                    <button className='bg-rose-500 p-2 rounded-[10px] text-white' onClick={()=>navigate("/SignIn")} >LogIn</button>
                    <button onClick={()=>navigate("/")}>SignUp</button>
                </div>
            </div>
        </>
    )
}

export default Header