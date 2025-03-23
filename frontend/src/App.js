import {Routes, Route, Navigate} from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ResumeBuilder from './pages/ResumeBuilder';
import MyResumes from './pages/MyResumes';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import { useState } from 'react';
import jsCookie from 'js-cookie'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!jsCookie.get('token'));
  const [role, setRole] = useState(jsCookie.get('role') || '');

  const handleLogout = () =>{
    jsCookie.remove('token');
    jsCookie.remove('role');
    setIsLoggedIn(false);
    setRole('');
    alert("You have been logged out.")
    window.location.href = "/"
  }

  return (
    <div >
      <Navbar isLoggedIn={isLoggedIn} role={role} handleLogout={handleLogout}/>
      <div className='container'>
      <Routes>
        <Route path='/' element={<HomePage key={isLoggedIn} isLoggedIn={isLoggedIn} role= {role} handleLogout={handleLogout} />} />
        <Route path='/login' element={<LoginPage setIsLoggedIn = {setIsLoggedIn} setRole={setRole} />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/generate-resume' element={
          <PrivateRoute isLoggedIn ={isLoggedIn}>
            <ResumeBuilder />
          </PrivateRoute>
            } />
        <Route path='/my-resumes' element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <MyResumes />
          </PrivateRoute>
        } />
        <Route path='/admin-dashboard' element={
          <AdminRoute isLoggedIn={isLoggedIn} role= {role}>
            <AdminDashboard/>
          </AdminRoute>
        } />
        <Route path='*' element= {<Navigate to="/" />} />
      </Routes>
      </div>
      
    </div>
  );
}

export default App;
