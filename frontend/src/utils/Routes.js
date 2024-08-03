import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';


const PrivateRoute = () => {
    const { user } = useContext(AuthContext)
    return user ? <Outlet /> : <Navigate to="/login" />;
}

const PublicRoute = () => {
    const { user } = useContext(AuthContext)
    return user ? <Navigate to="/" /> : <Outlet />;
}

const DoctorRoute = () => {
    const { user } = useContext(AuthContext)
    return user && user.user_type === 'doctor' ? <Outlet /> : <Navigate to="/" />;
};
const PatientRoute = () => {
    const { user } = useContext(AuthContext)
    return user && user.user_type === 'patient' ? <Outlet /> : <Navigate to="/doctor-home" />;
};


export { PublicRoute, PrivateRoute,DoctorRoute,PatientRoute};