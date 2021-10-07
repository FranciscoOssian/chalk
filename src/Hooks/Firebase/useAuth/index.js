import React, { useEffect, useState } from 'react';

import auth from '@react-native-firebase/auth'

const useAuth = () => {

    const [authState, setAuthState] = useState(
        {
            isSignedIn: false,
            pending: true,
            user: null,
        }
    )

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(
            user => setAuthState(
                {
                    user,
                    pending: false,
                    isSignedIn: !!user
                }
            )
        );
        return subscriber;
    }, []);


    return { ...authState }
}

export default useAuth