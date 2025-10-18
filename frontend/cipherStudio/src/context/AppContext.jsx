import {createContext, useContext, useState, useEffect} from "react";
import axios from "axios";
import {toast} from "react-hot-toast";
import {useNavigate} from "react-router-dom";

axios.defaults.baseURL = "http://localhost:5000";

const AppContext = createContext();

export const AppProvider = ({children}) => {
    const navigate = useNavigate();``
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);

    const fetchUser = async() => {
        try {
            const {data} = await axios.get('/api/auth/data');
            if (data.success) {
                setUser(data.user);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = token; // no Bearer prefix (matches your middleware)
            fetchUser();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
    }, [token]);

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        axios.defaults.headers.common['Authorization'] = '';
        toast.success('You have been logged out');
        navigate('/');
    }

    const value = {
        navigate, axios, user, setUser, token, setToken, fetchUser,
        showLogin, setShowLogin, logout
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext);
}