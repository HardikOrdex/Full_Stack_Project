import React, { useContext } from "react"
import { Navigate } from "react-router-dom"
import AuthContext from "../context/authContext"
import { toast } from "react-toastify";

const PrivateRoute = ({children}) => {
    const {user, loading} = useContext(AuthContext);
    if (loading){
        return <div>Loading...</div>
    } if(!user) {
        toast.info("User logged out");
        return <Navigate to="/login" />
    }
    return children;
}

export default PrivateRoute