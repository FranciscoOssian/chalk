import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native'

import { launchImageLibrary } from 'react-native-image-picker'

import getRealm from '../.././../services/realm'

import BackScreen from '../../../../assests/images/global/navigation'

import { Row, Rows } from '../../../Components/Rows'

import auth from '@react-native-firebase/auth'

const Account = ({ navigation }) => {

    const [name, setName] = useState('')
    const [age, setAge] = useState(18)
    const [bio, setBio] = useState('')
    const [profileImageUri, setProfileImageUri] = useState('https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG')

    useEffect(() => {
        const run = async () => {
            const realm = await getRealm()
            const user = await realm.objects('User').filtered(`id == '${auth().currentUser.uid}'`)[0]
            console.log(user)
            setName(user.name)
            setAge(user.age)
            setBio(user.bio)
            setProfileImageUri(user.profilePicture)
        }
        run()
    },[])

    return (
        <ScrollView>
            <View style={styles.head}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    style={{ margin: 22, marginRight: '90%' }}
                ><BackScreen />
                </TouchableOpacity>
                <Image
                    source={{ uri: profileImageUri }}
                    style={{ width: 100, height: 100, borderRadius: 100 }}
                />
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.age}>{age}</Text>
                <Text style={styles.bio}>{bio}</Text>
            </View>

            <Rows>
                <Row
                    name='Edit profile'
                    onPress={ () => navigation.navigate('EditProfile') }
                />
                <Row
                    name='Verify account with phone number'
                    onPress={ () => navigation.navigate('AuthPhoneNumber') }
                />
                <Row
                    name='LogOut Account'
                    onPress={ () => {
                        auth().signOut().then(() => navigation.navigate('SignUp') );
                    }}
                />
            </Rows>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    head: {
        alignItems: 'center',
    },
    name: {
        fontFamily: 'Assistant',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 24,
        lineHeight: 31,
        textAlign: 'center',
        letterSpacing: 0.33,
    },
    age: {
        fontFamily: 'Assistant',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 24,
        lineHeight: 31,
        textAlign: 'center',
        letterSpacing: -0.2,

        color: 'rgba(0, 0, 0, 0.5)'
    },
    bio: {
        fontFamily: 'Assistant',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 15,
        lineHeight: 20,
        /* identical to box height */

        textAlign: 'center',
        letterSpacing: -0.2,

        color: 'rgba(0, 0, 0, 0.5)',

        margin: 40,
        marginTop: 50,
    }
})

export default Account;