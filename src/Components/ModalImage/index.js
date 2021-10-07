import React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native'

const ModalImage = ({modalVisible, modelImageSelected}) => {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
        >
            <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    style={{ width: '50%', height: '25%' }}
                    source={{ uri: modelImageSelected }}
                />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
});

export default ModalImage;