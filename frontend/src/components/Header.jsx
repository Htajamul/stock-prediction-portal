import React, { useContext } from 'react'
import Button from './Button'
import { Link,useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'

const Header = () => {
  const { isLoggedIn, setLoggedIn } = useContext(AuthContext)
  const navigate = useNavigate()
  const handleLogOut = ()=>{
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setLoggedIn(false)
    navigate('/login')
  }
  return (
    <>
      <nav className='navbar container pt-3 pb-3 align-items-start'>
        <Link className='navbar-brand text-light' to="/">Stock Prediction Potal</Link>
        <div>
          {isLoggedIn ? (
            <button className='btn btn-outline-danger' onClick={handleLogOut}>LogOut</button>
          ) : (
            <>
              <Button text='login' class='btn-outline-info' url='/login' />
              &nbsp;
              <Button text='Register' class='btn-info' url='/register' />
            </>
          )}

        </div>
      </nav>
    </>
  )
}

export default Header