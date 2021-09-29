import * as React from 'react';
import { Text, View, Image, StyleSheet, ScrollView } from 'react-native'

const MyMessage = ({ content, profilePicture }) => {
    return (
        <View style={[styles.message, { justifyContent: 'flex-end' }]}>
            <View style={[styles.content, styles.contentMyMessage]}>
                <Text>{content}</Text>
            </View>
            <Image
                source={{ uri: profilePicture }}
                style={{ width: 28, height: 28, borderRadius: 100 }}
            />
        </View>
    )
}

const FriendMessage = ({ content, profilePicture }) => {
    return (
        <View style={[styles.message]}>
            <Image
                source={{ uri: profilePicture }}
                style={{ width: 28, height: 28, borderRadius: 100 }}
            />
            <View style={[styles.content, styles.contentFriendMessage]}>
                <Text>{content}</Text>
            </View>
        </View>
    )
}

const Message = ({ content, profilePicture, timestamp, from, yourUID }) => {

    const yourMessage = from === yourUID

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