import './App.css';
import { PrivateRoute,PublicRoute,DoctorRoute,PatientRoute }from './utils/Routes';
import { Login,Register,PatientDashboard,DoctorDashboard } from './pages';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import './App.css';
//contains authentication related
import { AuthProvider } from './context/AuthContext';


function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          {/* <Navbar /> */}
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Route>
            <Route exact path='/' element={<PrivateRoute />}>
              <Route exact path='/doctor' element={<DoctorRoute />}>
                <Route path='/doctor/' element={<DoctorDashboard />} />
              </Route>
              <Route exact path='/patient' element={<PatientRoute />}>
                <Route path='/patient/' element={<PatientDashboard />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
