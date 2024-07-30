import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { checkTokenValidity, isTokenValid } from "./tokenUtils";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    let [user, setUser] = useState(() => checkTokenValidity() ? jwtDecode(localStorage.getItem('authTokens')) : null)
    let [isAuthenticated, setisAuthenticated] = useState(() => checkTokenValidity() ? true : false)
    let [authTokens, setAuthTokens] = useState(() => checkTokenValidity() ? JSON.parse(localStorage.getItem('authTokens')) : null)
    const navigate = useNavigate();
    


    let registerUser = async (username, email, password) => {
        try{
            const values = { 'username': username, 'password': password, 'email': email }
            await api.post("/accounts/register/", values);
            navigate('/login')
        } catch(error){
            if (error.response){
                return error.response.data
            }
            console.error("Error during registration creation:", error);
        }


    };

    let genarateOtp = async (email) => {
        try{
            const values = { 'email': email }
            let response = await fetch("/accounts/genarate_otp/", values);
            return response.data;
        } catch (error){
            if (error.response){
                return error.response.data
            }
            console.error("Error during otp generation creation:", error);
        }
    }

    let forgotPass = async (email) => {
        try {
            const values = { 'email': email }
            let response = await api.post("/accounts/forgot_password/", values);
            return response.data
        } catch (error) {
            if (error.response){
                return error.response.data
            }
            console.error("Error during link creation:", error);
        }
    };

    let forgotPassConfirm = async (token) => {
        try {
            const values =  { 'token': token }
            let response = await api.post("/accounts/forgot_password_confirm/", values);
            localStorage.setItem('resetToken', token)
            navigate('/reset-password')
            return response.data
        } catch (error) {
            if (error.response){
                return error.response.data
            }
            console.error("Error during link creation:", error);
        }
    };

    let ResetPass = async (password) => {
        try {
            let ResetToken = "";
            ResetToken = localStorage.getItem('resetToken');
            const values =  { 'password': password, 'token': ResetToken }
            let response = await api.post("/accounts/reset_password/", values);

            localStorage.removeItem('resetToken')
            return response.data;
        } catch (error) {
            if (error.response){
                return error.response.data
            }
        }
    };

    let verifyOtp = async (email, otp) => {
        try {
            const values = { 'email': email, 'otp': otp }
            let response = await api.post("/accounts/verify_otp/", values);
            return response.data
        } catch (error) {
            if (error.response){
                return error.response.data
            }
        }
    }


    let loginUser = async (username, password) => {
        try{
            const values = { 'username': username, 'password': password };
            let response = await api.post("/accounts/login/", values);
            const data = response.data
            if (response.data.status) {
                setAuthTokens(data)
                setUser(jwtDecode(data.access))
                setisAuthenticated(true)
                localStorage.setItem('authTokens', JSON.stringify({ 'access': data.access, 'refresh': data.refresh }));
                navigate('/')
            }
            return data
        }catch (error){
            if (error.response){
                return error.response.data
            }
        }
    }

    let logoutUser = async () => {
        const refresh = authTokens?.refresh;
        try {
            const values = { 'refresh': refresh }
            let response = await api.post("/accounts/logout/", values);
            if (response.data.status) {
                setisAuthenticated(false)
                setAuthTokens(null);
                setUser(null);
                localStorage.removeItem('authTokens');
                navigate('/login');
            } else {
                console.log(response.data.message)
                navigate('/login');
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    let updateToken = async () => {
        try {
            const values = { 'refresh': authTokens.refresh }
            let response = await api.post("/accounts/login/refresh/", values);
            let data = response.data
            if (response.status === 200) {
                setAuthTokens(data)
                setUser(jwtDecode(data.access))
                localStorage.setItem('authTokens', JSON.stringify({ 'access': data.access, 'refresh': data.refresh }));
            } else {
                logoutUser()
            }
        } catch (error) {
            logoutUser()
            console.log("Error during refreshing token :", error)
        }
    }

    useEffect(() => {
        const fourMinutes = 1000 * 60 * 29
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, fourMinutes)
        return () => clearInterval(interval)
    }, [authTokens])

    const contextData = {
        user: user,
        authTokens: authTokens,
        isAuthenticated: isAuthenticated,
        loginUser: loginUser,
        logoutUser: logoutUser,
        registerUser: registerUser,
        verifyOtp: verifyOtp,
        genarateOtp: genarateOtp,
        forgotPass: forgotPass,
        forgotPassConfirm: forgotPassConfirm,
        ResetPass: ResetPass,
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}