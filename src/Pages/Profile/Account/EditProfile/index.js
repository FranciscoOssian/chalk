import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView
} from 'react-native'

import { launchImageLibrary } from 'react-native-image-picker'
import { Picker } from '@react-native-picker/picker';

import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage';

import getRealm from '../../../../services/realm'

import { useLocalUser } from '../../../../Hooks/localDatabase/user'

import Core from '../../../../services/core'

const core = new Core()

let changeImage = false

const EditProfile = ({ navigation }) => {

    const { user } = useLocalUser()

    const [name, setName] = useState('')
    const [age, setAge] = useState(18)
    const [bio, setBio] = useState('')
    const [profileImageUri, setProfileImageUri] = useState('https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG')

    useEffect(() => {
        const run = async () => {
            setName(user.name)
            setAge(user.age)
            setBio(user.bio)
            setProfileImageUri(user.profilePicture)
        }
        run()
    }, [user])

    const onHandleImageChange = () => {
        launchImageLibrary({
            mediaType: 'photo'
        }, result => {
            if (result.didCancel || result.errorCode) return
            setProfileImageUri(result.assets[0].uri)
            changeImage = true
        })
    }

    const editUserInFirebase = async (user) => {
        firestore().collection('Users').doc(user.id)
            .set(user)
    }

    const onHandleDone = async (userRecived) => {
        const realm = await getRealm()

        const me = core.localDB.get.myUser()

        let profilePicture = profileImageUri

        if (changeImage) {
            const reference = storage().ref(`users/${me.id}/profilePicture.jpg`);
            await reference.putFile(profilePicture);
            profilePicture = await reference.getDownloadURL()
        }

        realm.write(() => {
            me.email = userRecived.email
            me.name = userRecived.name
            me.age = userRecived.age
            me.bio = userRecived.bio
            me.profilePicture = profilePicture
        });

        await editUserInFirebase({
            email: userRecived.email,
            name: userRecived.name,
            age: userRecived.age,
            bio: userRecived.bio,
            profilePicture: profilePicture,
            id: userRecived.id,
        })

    }

    return (
        <ScrollView>
            <View style={styles.head}>
                <TouchableOpacity
                    onPress={async () => {
                        navigation.push('Account')
                        onHandleDone({
                            id: user.id,
                            email: user.email,
                            name: name,
                            bio: bio,
                            age: age
                        })
                    }}
                    style={{ width: '90%' }}
                >
                    <Text style={styles.done}>done</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onHandleImageChange()}
                >
                    <Image
                        source={{ uri: profileImageUri }}
                        style={{ width: 100, height: 100, borderRadius: 100 }}
                    />
                </TouchableOpacity>

                <Text style={styles.name}>{name}</Text>
                <Text style={styles.age}>{age}</Text>
                <Text style={styles.bio}>{bio}</Text>
            </View>

            <View style={styles.formContainer}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Name"
                    value={name}
                    onChangeText={(txt) => setName(txt)}
                />

                <View
                    style={styles.TextInput}
                >
                    <Picker
                        selectedValue={age}
                        onValueChange={(v, i) =>
                            setAge(v)
                        }
                    >
                        {
                            Array.from({ length: 100 }, (_, i) => i + 1).map(age =>
                                <Picker.Item
                                    label={`${age}`}
                                    value={age}
                                    key={age}
                                />
                            )
                        }
                    </Picker>
                </View>



                <TextInput
                    style={{ ...styles.TextInput, height: 200 }}
                    multiline={true}
                    placeholder="Bio"
                    value={bio}
                    onChangeText={(txt) => setBio(txt)}
                />
            </View>
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
    },
    TextInput: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 18,

        width: '71.2%',
        height: 45,

        marginVertical: 20,

        justifyContent: 'center',
    },
    done: {
        fontFamily: 'Assistant',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 17,
        lineHeight: 22,
        /* identical to box height, or 129% */
        letterSpacing: -0.33,

        color: '#000000',

        textAlign: 'right',

        width: '100%',

        marginRight: 75,
        marginTop: 25
    },
    formContainer: {
        alignItems: 'center',
    }
})

export default EditProfile;