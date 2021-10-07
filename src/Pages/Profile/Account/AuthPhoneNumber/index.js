import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert
} from 'react-native'


import BackScreen from '../../../../../assests/images/global/navigation'

const Account = ({ navigation }) => {

    const [sended, setSended] = useState(false)

    return (
        <ScrollView>
            <View style={styles.head}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Account')}
                    style={{ margin: 22, marginRight: '90%' }}
                ><BackScreen />
                </TouchableOpacity>
                <Image
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG' }}
                    style={{ width: 100, height: 100, borderRadius: 100 }}
                />
            </View>

            <View
                style={{ width: '100%', alignItems: 'center', paddingTop: '50%' }}
            >

                {
                    !sended?
                        <TextInput
                            style={styles.TextInput}
                            keyboardType="phone-pad"
                            textContentType="telephoneNumber"
                            placeholder="put your phone number to auth"
                        />
                        :
                        <TextInput
                            style={styles.TextInput}
                            keyboardType="numeric"
                            placeholder="code"
                        />
                }

                <TouchableOpacity
                    onPress={() => {
                        console.log('send')
                        Alert.alert('code sent, check yoyr messages')
                        setSended(true)
                    }}
                >
                    <Text
                        style={{ width: 50, height: 50, fontSize: 40, backgroundColor: '#0584FE', justifyContent: 'center', textAlign: 'center', borderRadius: 100, color: 'white' }}
                    >{`>`}</Text>
                </TouchableOpacity>

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

        width: '60%',
        height: 45,

        marginVertical: 20,

        justifyContent: 'center',
    },
})

export default Account;