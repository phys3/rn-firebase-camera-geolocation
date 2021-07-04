import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MissingPermissionView from '../../components/MissingPermissionView';
import hasLocationPermission from './helpers/hasLocationPermission';

const LATITUDE_DELTA = 0.1;
const LONGITUDE_DELTA = 0.1;

const Container = styled.SafeAreaView`
  flex: 1;
`;

const MapScreen = ({navigation}) => {
  const [initialCoordinates, setInitialCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    const getUserCoordinates = async () => {
      const hasPermission = await hasLocationPermission();

      if (!hasPermission) {
        return;
      }
      if (hasPermission) {
        setLocationPermission(true);
        Geolocation.getCurrentPosition(
          position => {
            setInitialCoordinates({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          error => {
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    };
    getUserCoordinates();
  }, []);

  return (
    <Container>
      {locationPermission ? (
        <MapView
          style={{flex: 1}}
          provider={PROVIDER_GOOGLE}
          onPress={e =>
            navigation.navigate('Camera', {
              coordinate: e.nativeEvent.coordinate,
            })
          }
          region={{
            ...initialCoordinates,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          showsUserLocation={true}
        />
      ) : (
        <MissingPermissionView text="Location not authorized" />
      )}
    </Container>
  );
};

export default MapScreen;
