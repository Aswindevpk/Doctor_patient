import { jwtDecode } from "jwt-decode";

export const getToken = () => localStorage.getItem('authTokens') ? localStorage.getItem('authTokens') : null

export const isTokenValid = (token) => {
  if (!token) return false;
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; // in seconds
  if(decodedToken.exp > currentTime){
    return true;
  }else{
    localStorage.removeItem('authTokens');
    return false;
  }
};

export const checkTokenValidity = () => {
  const token = getToken();
  return isTokenValid(token);
};
