import { useState } from 'react'
import HomePage from './HomePage'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Auth/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Auth/AuthContext';
import PrivateRoute from './Auth/PrivateRouter';
import Signup from './Auth/Signup';

function App() {
  // const {isAuthenticated} = useAuth()
  return (
    <>
      {/* <HomePage/> */}
      {/* <Login/> */}
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />

            {/* <Route path="/" element={<PrivateRoute component={HomePage} />} /> */}
            {/* <PrivateRoute path="/" element={<HomePage />} /> */}
            <Route path='/' element={<PrivateRoute component={HomePage}/>}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>

      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        className='md:left-[50px] md:bottom-[30px]'
      />
    </>
  )
}

export default App
