import * as React from 'react';
import { Text, View, Image, StyleSheet, ScrollView } from 'react-native'

import myDebug from '../../../../utils/debug/index'
const debug = (...p) => myDebug('pages/Chat/Components/Message', p)

const MyMessage = ({ content, profilePicture }) => {

    const isImageContent = content.contentType === 'image' ? true : false

    return (
        <View style={[styles.message, { justifyContent: 'flex-end' }]}>
            <View style={[styles.content, styles.contentMyMessage]}>
                {
                    isImageContent ?
                        <Image
                            source={{ uri: content.value }}
                            style={{width: '100%', height: 150}}
                        />
                        :
                        <Text>{content.value}</Text>
                }
            </View>
            <Image
                source={{ uri: profilePicture }}
                style={{ width: 28, height: 28, borderRadius: 100 }}
            />
        </View>
    )
}

const FriendMessage = ({ content, profilePicture }) => {

    const isImageContent = content.contentType === 'image' ? true : false
    //source={{ uri: 'data:image/png;base64,' + content.value }}

    return (
        <View style={[styles.message]}>
            <Image
                source={{ uri: profilePicture }}
                style={{ width: 28, height: 28, borderRadius: 100 }}
            />
            <View style={[styles.content, styles.contentFriendMessage]}>
                {
                    isImageContent ?
                        <Image
                            source={{ uri: content.value }}
                            style={{width: '100%', height: 150}}
                        />
                        :
                        <Text>{content.value}</Text>
                }
            </View>
        </View>
    )
}

const Message = ({ content, profilePicture, timestamp, from, yourUID }) => {

    const yourMessage = from.id === yourUID

    return (
        <View style={styles.container}>
            {
                yourMessage ?
                    <MyMessage content={content} profilePicture={profilePicture} />
                    :
                    <FriendMessage content={content} profilePicture={profilePicture} />
            }
        </View>
    )
}

export default Message

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    content: {
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,

        height: 'auto',

        width: '50%',

        justifyContent: 'center',

        padding: 10,

        fontFamily: 'Assistant',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 17,
        lineHeight: 22,
        letterSpacing: -0.41,

        color: '#000000',
    },
    contentFriendMessage: {
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 18,

    },
    contentMyMessage: {
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 4,
    },
    message: {
        width: '100%',
        flexDirection: 'row',

        alignItems: 'flex-end',
    }
})