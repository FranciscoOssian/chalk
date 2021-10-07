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

import BackScreen from '../../../../assests/images/global/navigation'

import { Row, Rows } from '../../../Components/Rows'

const Account = ({ navigation }) => {

    return (
        <ScrollView>
            <View style={styles.head}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    style={{ margin: 22, marginRight: '90%' }}
                ><BackScreen />
                </TouchableOpacity>
                <Image
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG' }}
                    style={{ width: 100, height: 100, borderRadius: 100 }}
                />
                <Text style={styles.name}>Jacob</Text>
                <Text style={styles.age}>20</Text>
                <Text style={styles.bio}>Hi, my name is Jacob, I like pizza, potato, tomato, sushi.</Text>
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