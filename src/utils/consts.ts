import UserType from "@src/types/user"

export const defaultFirebaseProfilePicture = 'https://firebasestorage.googleapis.com/v0/b/chatalk-96c5b.appspot.com/o/public%2FdefaultProfilePicture.jpg?alt=media&token=ac1c66c3-903e-482b-8cce-4d945b2159c1'

export const defaultUser: UserType = {
    profilePicture: defaultFirebaseProfilePicture,
    name: '',
    age: 18,
    bio: '',
    gender: '',
    authenticated: false,
    id: '0'
}