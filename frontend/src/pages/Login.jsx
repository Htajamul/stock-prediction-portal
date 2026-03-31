import React,{useState,useContext} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import {useNavigate} from'react-router-dom'
import { AuthContext } from '../AuthProvider'
import { Link } from 'react-router-dom'


const Login = () => {
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  const [error,setError] = useState('')
  const {isLoggedIn,setLoggedIn} = useContext(AuthContext)


  const handlerSubmit = async (e)=>{
    e.preventDefault()
    setLoading(true)

    const userData = { username, password }
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/token/',userData)
      localStorage.setItem('accessToken',response.data.access)
      localStorage.setItem('refreshToken',response.data.refresh)
      console.log('login successfully')
      setLoggedIn(true)
      navigate('/dashboard')
    } catch (error) {
      console.log(error.response.data)
      setError('invalid cridentials')
      console.log("invalid cridentials")
    }finally{
      setLoading(false)
    }
  }


  return (
    <>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-6 bg-light-dark p-5 rounded'>
            <h3 className='text-light text-center mb-4'>Log In To Our Portal</h3>
            <form onSubmit={handlerSubmit}>
              <div className='mb-3'>
                <input name='username' type="text" className='form-control' placeholder='enter username' value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className='mb-3'>
                <input name='password' type="password" className='form-control' placeholder='set password' value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Link to="/forget" className="btn btn-outline-primary w-100 mt-2 mb-3">Forgot Password</Link>
              {error && <div className='text-danger'>{error}</div>}
              {loading ? (
                <button type='submit' className='btn btn-info d-block mx-auto' disabled><FontAwesomeIcon icon={faSpinner} spin /> Logging in...</button>
              ) : (
                <button type='submit' className='btn btn-info d-block mx-auto'>Login</button>
              )}

            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login