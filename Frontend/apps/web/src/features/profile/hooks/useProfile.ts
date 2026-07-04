import { useEffect, useState } from 'react';
import {getUserById} from '../api/getUser';
import type { UserProfile } from '../types/profile.types';

export function useUser(userId:number){
    const [user, setUser] = useState<UserProfile>();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(()=>{
        if (!userId) return;

        
        async function loadProfile(){
            setIsLoading(true);
            setErrorMessage('');
            try {
                const data = await getUserById(userId)
                setUser( data);
            } catch (error) {
                setErrorMessage('Failed to load profile.');
            } finally{
                setIsLoading(false)
            }
        }
       
        loadProfile();
    }, [userId]);
    
    return {user, isLoading, errorMessage}

}