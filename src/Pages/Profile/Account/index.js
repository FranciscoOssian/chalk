import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native'

import { launchImageLibrary } from 'react-native-image-picker'

const Pencil = () => {
    return <Text>✏️</Text>
}

const Account = ({ navigation }) => {

    const [bio, setBio] = useState('')
    const [name, setName] = useState('')
    const [photoUri, setPhotoUri] = useState('https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg')

    useEffect(() => {
        setBio('fkbjrjkrfgkjrgb')
        setName('eçkgnrlekgn')
    }, [])

    const onHandleSetPhotoUri = () => {
        launchImageLibrary({
            mediaType: 'photo'
        }, (result) => {
            if (result.didCancel || result.errorCode) return
            setPhotoUri(result.assets[0].uri)
        })
    }

    return (
        <View>
            <View style={styles.done}>
                <Text
                    style={[styles.doneText, styles.font]}
                    onPress={() => console.log('done')}
                >Done</Text>
            </View>
            <View style={styles.info}>
                <TouchableOpacity
                    onPress={onHandleSetPhotoUri}
                >
                    <Image
                        source={{ uri: photoUri }}
                        style={{ width: 130, height: 130, borderRadius: 100 }}
                    />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Pencil />
                    <TextInput
                        onChangeText={(txt) => setName(txt)}
                        value={name}
                        style={[styles.name, styles.font]}
                    />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Pencil />
                    <TextInput
                        onChangeText={(txt) => setBio(txt)}
                        value={bio}
                        style={{ marginHorizontal: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)', width: '80%' }}
                        multiline
                    />
                </View>


            </View>
            <View style={styles.rows}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    font: {
        fontFamily: 'Assistant',
        fontStyle: 'normal',
        fontWeight: 'bold',
    },
    done: {
        paddingRight: 30,
        marginTop: 45,

        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    doneText: {
        fontSize: 17,
        lineHeight: 22,
        textAlign: 'right',
        letterSpacing: -0.33,
    },
    name: {
        fontSize: 30,
        lineHeight: 39,
        textAlign: 'center',
        letterSpacing: 0.33,
    },
    info: {
        alignItems: 'center',
    }
})

export default Account;