import { createContext } from 'react';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { cleanup } from '@testing-library/react';

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState({
        
    });
    const [id, setID] = useState();

    function getUserFromToken(token) {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken;
        } catch (error) {
            if (error.name === 'InvalidTokenError') {
                console.log('Invalid token specified');
            } else {
                console.log('Error decoding token:', error.message);
            }
        }
    }

    useEffect(() => {
        const fetchAPI = async () => {
            const IdFromToken = localStorage.getItem('access-token');
            const result = getUserFromToken(IdFromToken)
            setID(result.id);
    
            try {
                const response = await axios.get(`http://localhost:8000/user/${id}`)
                
                setUser(response.data.user)
            } catch (error) {
                console.log(error);
            }
        };
        fetchAPI();
        
    },[id]); 
    

    return <AppContext.Provider value={{ user }}>{children}</AppContext.Provider>;
};
