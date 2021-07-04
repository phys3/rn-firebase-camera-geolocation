import React, {useEffect, useState} from 'react';
import {Button} from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import createFormData from './helpers/createFormData';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 136px;
  padding-right: 16px;
  margin-bottom: 16px;
`;
const Temperature = styled.Text``;

const Tumbnail = styled.Image`
  width: 33%;
  height: 136px;
  resize-mode: cover;
`;

const API_KEY = '3d846cf2c81f43438f09beced4a909b6';

const CaptureListItem = ({capture}) => {
  const {
    coordinates: {latitude, longitude},
    image_uri,
    created_at,
  } = capture;
  const [temperature, setTemperature] = useState('');

  const handleUploadPhoto = () => {
    fetch('http://this.is.a.test/api/capture', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: createFormData(image_uri, {
        userId: 'test123',
        coordinates: {latitude, longitude},
        created_at,
      }),
    })
      .then(response => response.json())
      .then(response => {
        console.log('upload succes', response);
        alert('Upload success!');
      })
      .catch(error => {
        console.log('upload error', error.message);
        alert('Upload failed!');
      });
  };

  useEffect(() => {
    fetch(
      `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${API_KEY}`,
    )
      .then(response => response.json())
      .then(json => {
        setTemperature(
          _.get(json, 'data[0].temp', 'Temperature unavailable').toString(),
        );
      })
      .catch(error => console.error(error));
  }, [latitude, longitude]);

  return (
    <Container>
      <Tumbnail source={{uri: image_uri}} />
      <Temperature>{temperature || 'Loading temperature'}</Temperature>
      <Button title="Sync" onPress={handleUploadPhoto} />
    </Container>
  );
};

export default CaptureListItem;
