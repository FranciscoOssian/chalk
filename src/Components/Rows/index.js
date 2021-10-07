import React from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet
} from 'react-native'

const Rows = (props) => {
    return (
        <View style={{ width: '100%' }}>
            {props.children}
        </View>
    )
}

const Row = (props) => {
    return (
        <TouchableOpacity
            onPress={() => props.onPress()}
        >
            <View
                style={styles.container}
            >
                <Text style={styles.name}>{props.name}</Text>
                <Text>{'>'}</Text>
            </View>
        </TouchableOpacity>
    )
}

export { Row, Rows }

const styles = StyleSheet.create({
    name: {
        fontFamily: 'Assistant',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 17,
        lineHeight: 22,
        letterSpacing: -0.41,
        color: '#000000',
    },
    container: {
        width: '80%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        margin: 20,
        marginLeft: 40
    }
})