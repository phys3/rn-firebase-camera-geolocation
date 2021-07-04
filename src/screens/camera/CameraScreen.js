import React, {useRef} from 'react';
import styled from 'styled-components/native';
import {RNCamera} from 'react-native-camera';
import {Button} from 'react-native';
import {useIsFocused} from '@react-navigation/core';
import firestore from '@react-native-firebase/firestore';

import MissingPermissionView from '../../components/MissingPermissionView';
import saveImage from './helpers/saveImage';

const Container = styled.SafeAreaView`
  flex: 1;
`;

const CameraScreen = ({navigation, route, addCapture}) => {
  const camera = useRef();
  const isFocused = useIsFocused();

  const capturePicture = async () => {
    const options = {quality: 0.5, base64: true};
    const data = await camera.current.takePictureAsync(options);
    const image_uri = await saveImage(data.uri);
    
    firestore()
      .collection('captures')
      .add({
        image_uri: `file://${image_uri}`,
        coordinates: {
          latitude: route.params.coordinate.latitude,
          longitude: route.params.coordinate.longitude,
        },
        created_by: 'Damjan',
        created_at: new Date().toISOString(),
      })
      .then(() => {
        console.log('Capture added!');
      }).catch(error => {
        console.log(error)
      });

    navigation.goBack();
  };
  if (isFocused) {
    return (
      <Container>
        <RNCamera
          ref={camera}
          style={{flex: 1, justifyContent: 'flex-end'}}
          type={RNCamera.Constants.Type.back}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          captureAudio={false}>
          {({status}) => {
            if (status !== 'READY') {
              return <MissingPermissionView text="Camera not authorized" />;
            }
            return <Button title="Capture" onPress={capturePicture} />;
          }}
        </RNCamera>
      </Container>
    );
  } else {
    return null;
  }
};

export default CameraScreen;
