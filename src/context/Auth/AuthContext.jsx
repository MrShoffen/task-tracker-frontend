import React, {createContext, useContext, useEffect, useState} from "react";
import {checkJwt} from "../../services/fetch/jwt/CheckJwt.js";
import {useLocation, useNavigate} from "react-router-dom";
import {useNotification} from "../Notification/NotificationProvider.jsx";
import ConflictException from "../../exception/ConflictException.jsx";
import UnauthorizedException from "../../exception/UnauthorizedException.jsx";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState(extractAuthUser);

    function extractAuthUser() {
        const isAuth = localStorage.getItem("isAuthenticated");
        const userData = localStorage.getItem("user");

        if (isAuth && userData) {
            return {isAuthenticated: true, user: JSON.parse(userData)};
        }
        return {isAuthenticated: false, user: null};
    }

    const login = (userInfo) => {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(userInfo));
        setAuth({isAuthenticated: true, user: userInfo});
    }

    const logout = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        setAuth({isAuthenticated: false, user: null});
    }


    const urlLocation = useLocation();
    const [pageVisits, setPageVisits] = useState(0);
    const navigate = useNavigate();

    const {showError} = useNotification();
    const validateJwt = async () => {
            try {
                const user = await checkJwt();
                if (user !== auth.user) {
                    login(user);
                }
            } catch (error) {
                logout();
                setTimeout(() => {
                    navigate("/login");
                    showError("Session is expired! Please login again", 4000)
                }, 300)
            }
    };

    useEffect(() => {
        setPageVisits((prev) => prev + 1);

        if (pageVisits >= 3) {
            validateJwt();
        }
    }, [urlLocation.pathname]);


    useEffect(() => {
        validateJwt();
    }, []);


    return (
        <AuthContext.Provider value={{auth, login, logout, validateJwt}}>
            {children}
        </AuthContext.Provider>
    );
};