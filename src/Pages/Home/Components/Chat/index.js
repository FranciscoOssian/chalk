import * as React from 'react';
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    if(hours < 10) hours = '0' + hours
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

const Read = (view) =>
    <View style={{ marginHorizontal: 16 }}>
        {view ?
            <View style={{ borderRadius: 100, borderWidth: 2, borderColor: '#979797', width: 20, aspectRatio: 1 / 1 }}></View>
            :
            <View style={{ borderRadius: 100, borderWidth: 2, borderColor: '#979797', width: 20, aspectRatio: 1 / 1 }}>
                <Text style={{ color: '#979797' }}>V</Text>
            </View>
        }
    </View>

const Chat = ({ id, picture, name, lastMessage, yourUID, onPhotoPress }) => {
    return (
        <View style={styles.container}>
            <View style={styles.container2}>
                <TouchableOpacity
                    onPress={()=>{ onPhotoPress() }}
                >
                    <Image
                        style={styles.image}
                        source={{ uri: picture }}
                    />
                </TouchableOpacity>
                <View style={styles.containerText}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.content}>
                        {lastMessage.senderUID === yourUID ? 'you:' : ''}
                        {`${lastMessage.content.substring(0, 19)}${lastMessage.content.length > 19 ? '...' : ''}`}
                        {`   •   ${formatAMPM(lastMessage.timestamp)}`}
                    </Text>
                </View>
            </View>
            <Read view={lastMessage.view} />
        </View>
    )
}

export default Chat

const styles = StyleSheet.create({
    container: {
        width: '100%',
        aspectRatio: 375 / 76,

        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    container2: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',

        aspectRatio: 307 / 60
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 100,
    },
    containerText: {
        aspectRatio: 236 / 42,
        justifyContent: 'center',
        paddingLeft: 10
    },
    name: {
        fontFamily: 'Assistant',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 17,
        lineHeight: 22,
        /* identical to box height, or 129% */

        letterSpacing: -0.4,

        color: '#000000'
    },
    content: {
        fontFamily: 'Assistant',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 14,
        lineHeight: 20,
        /* identical to box height, or 143% */

        letterSpacing: -0.15,

        color: 'rgba(0, 0, 0, 0.5)'
    }
})
