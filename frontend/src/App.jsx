
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './assets/css/style.css'
import Main from './components/Main'
import Header from './components/Header'
import Footer from './components/Footer'
import Register from './pages/Register'
import Login from './pages/Login'
import AuthProvider from './AuthProvider'
import Dashboard from './components/dashboard/Dashboard'
import PrivateRout from './PrivateRout'
import PublicRout from './PublicRout'
import ForGetPassword from './pages/ForGetPassword'
import ResetPassword from './pages/ResetPassword'
function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/forget' element={<ForGetPassword/>} />
            <Route path='/reset/:uid/:token' element={<ResetPassword/>} />
            <Route path='/register' element={<PublicRout><Register /></PublicRout>} />
            <Route path='/login' element={<PublicRout><Login /></PublicRout>} />
            <Route path='/dashboard' element={<PrivateRout><Dashboard /></PrivateRout>} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>

    </>
  )
}

export default App
