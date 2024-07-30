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
    return user && user.userType === 'doctor' ? <Outlet /> : <Navigate to="/login" />;
};

const PatientRoute = () => {
    const { user } = useContext();
    return user && user.userType === 'patient' ? <Outlet /> : <Navigate to="/login" />;
};

export { PublicRoute, PrivateRoute,PatientRoute,DoctorRoute };