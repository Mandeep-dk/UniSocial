import React from 'react'
import Header from '../components/Header'
import ProfilePageSettings from './ProfilePageSettings'
function Settings() {
  return (
    <>
        <Header/>
        <h1 className='mt-9 ml-10 text-3xl'>Settings</h1>
        <div className='flex flex-col gap-2 mt-9 ml-10 text-lg'>
            <a>Profile Settings</a>
            <a>Account Settings</a>
        </div>
        <div className="-mt-30 ml-72">
            <ProfilePageSettings/>
        </div>
    </>
  )
}

export default Settings