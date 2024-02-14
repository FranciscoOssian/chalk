import React, { useEffect, useRef, useState } from 'react';
import { Camera as CameraExpoOrigin, CameraType, FlashMode } from 'expo-camera';
import { manipulateAsync, FlipType, SaveFormat, ImageResult } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, View, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { ImagePickerAsset } from 'expo-image-picker';

export { CameraType } from 'expo-camera';

export type { ImageResult } from 'expo-image-manipulator';

interface CameraTypes {
  camera: {
    type: CameraType;
    visible: boolean;
    front?: {
      flip?: boolean;
    };
  };
  onTakePicture: (photo: ImageResult | ImagePickerAsset) => void;
  onCameraClose: () => void;
}

interface CameraButtonTypes {
  children: any;
  onTakePicture?: (photo: ImageResult | ImagePickerAsset) => void;
  camera?: {
    type?: CameraType;
    front?: {
      flip?: boolean;
    };
  };
}

export const CameraButton = ({ children, onTakePicture, camera }: CameraButtonTypes) => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>{children}</TouchableOpacity>
      <Camera
        camera={{
          type: camera?.type ?? CameraType.front,
          visible: visible,
          front: {
            flip: camera?.front?.flip ?? true,
          },
        }}
        onTakePicture={(result) => {
          setVisible(false);
          onTakePicture ? onTakePicture(result) : [];
        }}
        onCameraClose={() => setVisible(false)}
      />
    </>
  );
};

const flipImage = async (uri: string) =>
  manipulateAsync(uri, [{ rotate: 180 }, { flip: FlipType.Vertical }], {
    compress: 1,
    format: SaveFormat.JPEG,
  });

export const Camera = ({ camera, onTakePicture, onCameraClose }: CameraTypes) => {
  const cameraExpoOriginRef = useRef<any>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraType, setCameraType] = useState(camera?.type ?? CameraType.back);
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off);
  const [supportedRatios, setSupportedRatios] = useState<[number, number][]>([[4, 3]]);

  useEffect(() => {
    const run = async () => {
      if (!cameraExpoOriginRef?.current?.getSupportedRatiosAsync) return;
      const radios = await cameraExpoOriginRef?.current?.getSupportedRatiosAsync();
      setSupportedRatios(radios.map((r: string) => r.split(':').map(Number)));
    };
    run();
  }, [cameraExpoOriginRef]);

  const handleTakePhoto = async () => {
    const { status } = await CameraExpoOrigin.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      console.error('Camera permission not granted');
      return;
    }

    if (!cameraReady) return;

    let photo = await cameraExpoOriginRef.current.takePictureAsync();

    if (camera?.front?.flip && cameraType === CameraType.front) {
      const old = photo.uri;
      photo = await flipImage(photo.uri);
      FileSystem.deleteAsync(old);
    }

    onTakePicture(photo);
  };

  const onHandleCameraClose = () => {
    onCameraClose();
  };

  return (
    <Modal visible={camera.visible}>
      <View style={styles.modalStyle}>
        <CameraExpoOrigin
          ratio={supportedRatios[0]?.join(':') ?? '4:3'}
          ref={cameraExpoOriginRef}
          onCameraReady={() => setCameraReady(true)}
          style={[
            styles.expoCamera,
            {
              width: Dimensions.get('screen').width,
              height:
                (Dimensions.get('screen').width * supportedRatios[0][0]) / supportedRatios[0][1],
            },
          ]}
          type={cameraType}
          flashMode={flashMode}></CameraExpoOrigin>

        <TouchableOpacity
          style={[styles.cameraIcon, styles.cameraButton]}
          onPress={() => {
            handleTakePhoto();
          }}
        />
        <TouchableOpacity
          style={[styles.cameraFlipIcon, styles.cameraButton, styles.cameraButtonSecondary]}
          onPress={() =>
            setCameraType((type) => (type === CameraType.back ? CameraType.front : CameraType.back))
          }>
          <MaterialIcons name="flip-camera-android" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cameraFlashModeIcon, styles.cameraButton, styles.cameraButtonSecondary]}
          onPress={() => {
            if (cameraType === CameraType.front) return;
            setFlashMode((p) =>
              p === FlashMode.auto
                ? FlashMode.off
                : p === FlashMode.off
                ? FlashMode.on
                : p === FlashMode.on
                ? FlashMode.torch
                : FlashMode.auto
            );
          }}>
          {flashMode === FlashMode.auto && cameraType === CameraType.back ? (
            <MaterialIcons name="flash-auto" size={24} color="black" />
          ) : flashMode === FlashMode.off && cameraType === CameraType.back ? (
            <MaterialIcons name="flash-off" size={24} color="black" />
          ) : flashMode === FlashMode.on && cameraType === CameraType.back ? (
            <MaterialIcons name="flash-on" size={24} color="black" />
          ) : flashMode === FlashMode.torch && cameraType === CameraType.back ? (
            <MaterialCommunityIcons name="torch" size={24} color="black" />
          ) : (
            <MaterialIcons name="flash-off" size={24} color="black" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cameraGallery, styles.cameraButton, styles.cameraButtonSecondary]}
          onPress={async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: supportedRatios[0],
              quality: 1,
            });
            if (!result.canceled) {
              onTakePicture(result.assets[0]);
            }
          }}>
          <AntDesign name="picture" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cameraClose, styles.cameraButton, styles.cameraButtonSecondary]}
          onPress={async () => {
            onHandleCameraClose();
          }}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    backgroundColor: '#362246',
    flex: 1,
  },
  cameraButton: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButtonSecondary: {
    width: 40,
    height: 40,
  },
  cameraIcon: {
    bottom: (2 * Dimensions.get('screen').width) / 25,
    left: (2 * Dimensions.get('screen').width) / 5 /* (width/2) - (width/5) / 2 */,
    width: Dimensions.get('screen').width / 5,
    height: Dimensions.get('screen').width / 5,
  },
  cameraFlipIcon: {
    bottom: (2 * Dimensions.get('screen').width) / 7.5,
    right: Dimensions.get('screen').width / 5,
  },
  cameraFlashModeIcon: {
    bottom: (2 * Dimensions.get('screen').width) / 7.5,
    left: Dimensions.get('screen').width / 5,
  },
  cameraGallery: {
    bottom: (2 * Dimensions.get('screen').width) / 5,
    left: Dimensions.get('screen').width / 2 - 20,
  },
  cameraClose: {
    bottom: (2 * Dimensions.get('screen').width) / 4 - 10,
    left: Dimensions.get('screen').width - 40,
  },
  expoCamera: {
    backgroundColor: 'black',
  },
});
