import React, { useState, useEffect, useContext, createContext } from 'react'
import Core from '../../services/core'
import myDebug from '../../utils/debug'

import useAuth from '../Firebase/useAuth'

const core = new Core()
const userContext = createContext()
const debug = (...p) => myDebug('Hooks/localDatabase/user.js', p)


function useLocalUserProvider() {

    const [user, setUser] = useState(null)
    const { isSignedIn } = useAuth()

    useEffect(() => {
        const run  = async () => {
            const resp = await core.localDB.get.myUser()
            debug('setting user to useProvider... user id:', resp?.id)
            setUser( resp )
        }
        run()
        return () => {}
    }, [isSignedIn])

    const update = async ( user ) => {
        core.localDB.update.myUser(user)
        setUser(user)
    }

    return {
        user,
        update,
    }

}

export function LocalUserProvider({ children }) {
    const auth = useLocalUserProvider()
    return <userContext.Provider value={auth}>{children}</userContext.Provider>
}

export const useLocalUser = () => {
    return useContext(userContext)
}