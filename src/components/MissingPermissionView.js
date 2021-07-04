import React from 'react';
import {Text, View} from 'react-native';

const MissingPermissionView = ({text}) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text>{text}</Text>
  </View>
);

export default MissingPermissionView;
