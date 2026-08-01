import React from 'react'
import { useAuthStore } from '../stores/useAuthStore.js';

const LogoutPage = () => {
  const { logout } = useAuthStore();

  function handleLogout(){
    logout();
  }
  return (
    <div>
    <button onClick={handleLogout} className='border-4 m-2 p-2'>Logout</button>
    </div>
  )
}

export default LogoutPage