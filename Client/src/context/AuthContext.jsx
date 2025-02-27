import React, { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  // useEffect(() => {
  //   const checkAccessToken = async () => {
  //     const accessToken = localStorage.getItem("accessToken"); // Assuming you store the access token in local storage

  //     if (accessToken) {
  //       try {
  //         // Make a request to a protected route to check if the access token is valid
  //         await axios.get("http://localhost:8000/user/current", {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //         });
  //       } catch (error) {
  //         if (error.response.status === 403) {
  //           // Access token is expired, try to refresh it
  //           const refreshToken = localStorage.getItem("refreshToken"); // Assuming you store the refresh token in local storage

  //           if (refreshToken) {
  //             try {
  //               const response = await axios.post("/token", {
  //                 token: refreshToken,
  //               });
  //               const newAccessToken = response.data.accessToken;

  //               // Store the new access token
  //               localStorage.setItem("accessToken", newAccessToken);
  //             } catch (refreshError) {
  //               // Refresh token is also expired or invalid, redirect to login
  //               window.location.href = "/login";
  //             }
  //           } else {
  //             // No refresh token, redirect to login
  //             window.location.href = "/login";
  //           }
  //         }
  //       }
  //     } else {
  //       // No access token, redirect to login
  //       window.location.href = "/login";
  //     }
  //   };
  // }, []);

  const fetchUserData = async (navigate, location) => {
    try {
      console.log("FetchUserData");
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (accessToken) {
        console.log("inside accessToken");
        const res = await axios.get("http://localhost:8000/user/current", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Refresh-Token": refreshToken,
          },
        });
        setUser(res.data);
        navigate('/dashboard');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (creds, navigate, location) => {
    try {
      console.log("Inside login")
      const res = await axios.post("http://localhost:8000/user/login", creds);
      const { accessToken, refreshToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      await fetchUserData(navigate, location);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("Inside logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const register = async (creds, navigate) => {
    try {
      await axios.post("http://localhost:8000/user/register", creds);
      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
