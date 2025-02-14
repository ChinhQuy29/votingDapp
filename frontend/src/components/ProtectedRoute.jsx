import React from "react";
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    let accessToken;

    try {
        accessToken= localStorage.getItem("accessToken");
    } catch(error) {
        console.log(error.message);
    }

    if (!accessToken) {
        console.log("Access Token missing")
        return <Navigate to='/' replace/>
    }
    const decoded= jwtDecode(accessToken);
    const currentTime= Date.now() / 1000;
    if (currentTime > decoded.exp) {
        console.log("Access Token expired");
        return <Navigate to='/' replace/>     
    }
    return children;
}

export default ProtectedRoute