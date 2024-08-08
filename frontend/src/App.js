import './App.css';
import { PrivateRoute, PublicRoute, DoctorRoute, PatientRoute } from './utils/Routes';
import { Login, Register, UserProfile, Home, WriteBlog, BlogView, Homedoctor,AppointmentDetails,AppointmentForm } from './pages';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import './App.css';
//contains authentication related
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components';

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path='/profile' element={<UserProfile />} />
              <Route path='/blog/:id' element={<BlogView />} />
              <Route element={<PatientRoute />}>
                <Route path='/' element={<Home />} />
                <Route path='/appointment-form/:id/:doctor' element={<AppointmentForm/>} />
                <Route path='/appointments/:id' element={<AppointmentDetails/>} />
              </Route>
              <Route element={<DoctorRoute />}>
                <Route path='/doctor-home' element={<Homedoctor />} />
                <Route path='/write' element={<WriteBlog />} />
                <Route path='/write/:id' element={<WriteBlog />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
