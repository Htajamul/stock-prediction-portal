import React, { useState, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'
import { Link } from 'react-router-dom'
// import axiosInstance from '../axiosinstance'
// for google login
import { GoogleLogin } from '@react-oauth/google';
// for face book
import { FaFacebook } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { isLoggedIn, setLoggedIn } = useContext(AuthContext)


  const handlerSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const userData = { username, password }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/token/', userData)
      localStorage.setItem('accessToken', response.data.access)
      localStorage.setItem('refreshToken', response.data.refresh)
      setLoggedIn(true)
      navigate('/dashboard')
    } catch (error) {
      console.log(error.response)
      setError('invalid cridentials')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = async (credentialResponse) => {
    const id_token = credentialResponse.credential;
  
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/v1/google-login/', {
        token: id_token,
      });
      
      localStorage.setItem('accessToken', res.data.access);
      localStorage.setItem('refreshToken', res.data.refresh);

      setLoggedIn(true);
      navigate('/dashboard');
    } catch (err) {
      // console.log(err);
      setError('Google login failed');
    }

  }

  const handleFacebookLogin = () => {
    window.FB.login((response) => {
      processLogin(response);
    }, { scope: "email" });
  };

  const processLogin = async (response) => {
    if (response.authResponse) {
      const accessToken = response.authResponse.accessToken;
      // console.log(response, "token facebook")
      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/v1/facebook-login/",
          {
            access_token: accessToken,
          }
        );

        localStorage.setItem("accessToken", res.data.access);
        localStorage.setItem("refreshToken", res.data.refresh);

        // alert("Login successful");
        setLoggedIn(true)
        navigate('/dashboard');
      } catch (error) {
        setError('facebook login failed')
        alert("Backend error");
      }
    }
  };



  return (
    <>
      <div className="login-wrapper">
        <div className="login-card">

          <h3 className="title">Log In To Our Portal</h3>

          <form onSubmit={handlerSubmit} className="form">

            <input
              name="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
            />

            <input
              name="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />

            {error && <div className="error">{error}</div>}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Google */}
          <div className="social-btn google">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log("Login Failed")}
            />
          </div>

          {/* Facebook */}
          <button
            onClick={handleFacebookLogin}
            className="social-btn facebook"
          >
            <FaFacebook />
            Continue with Facebook
          </button>

          <Link to="/forget" className="forgot">
            Forgot Password?
          </Link>

        </div>
      </div>
    </>
    // <>
    //   <div className='container'>
    //     <div className='row justify-content-center'>
    //       <div className='col-md-6 bg-light-dark p-5 rounded'>
    //         <h3 className='text-light text-center mb-4'>Log In To Our Portal</h3>
    //         <form onSubmit={handlerSubmit}>
    //           <div className='mb-3'>
    //             <input name='username' type="text" className='form-control' placeholder='enter username' value={username} onChange={(e) => setUsername(e.target.value)} />
    //           </div>
    //           <div className='mb-3'>
    //             <input name='password' type="password" className='form-control' placeholder='set password' value={password} onChange={(e) => setPassword(e.target.value)} />
    //           </div>


    //           {error && <div className='text-danger'>{error}</div>}
    //           {loading ? (
    //             <button type='submit' className='btn btn-info d-block mx-auto' disabled><FontAwesomeIcon icon={faSpinner} spin /> Logging in...</button>
    //           ) : (
    //             <button type='submit' className='btn btn-info d-block mx-auto'>Login</button>
    //           )}

    //         </form>
    //         {/* for google auth */}
    //         <GoogleLogin
    //           onSuccess={handleSuccess}
    //           onError={() => console.log('Login Failed')}
    //         />
    //         {/* google auth end */}
    //         {/* FB auth end */}
    //         {/* <div>
    //           <button onClick={handleFacebookLogin}>
    //             Login with Facebook
    //           </button>
    //         </div> */}

    //         <div>
    //           <button
    //             onClick={handleFacebookLogin}
    //             style={{
    //               display: "flex",
    //               alignItems: "center",
    //               gap: "8px",
    //               padding: "10px 15px",
    //               backgroundColor: "#1877F2",
    //               color: "white",
    //               border: "none",
    //               borderRadius: "5px"
    //             }}
    //           >
    //             <FaFacebook />
    //             Login with Facebook
    //           </button>
    //         </div>
    //         {/* FB auth end */}
    //         <Link to="/forget" className="btn btn-outline-primary w-100 mt-2 mb-3">Forgot Password</Link>
    //       </div>
    //     </div>
    //   </div>
    // </>
  )
}

export default Login