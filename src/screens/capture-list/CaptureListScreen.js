import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {FlatList} from 'react-native';
import CaptureListItem from './components/CaptureListItem';
import firestore from '@react-native-firebase/firestore';

const Container = styled.SafeAreaView`
  flex: 1;
`;

const CaptureListScreen = () => {
  const [captures, setCaptures] = useState([])
  useEffect(() => {
    const subscriber = firestore()
      .collection('captures')
      .onSnapshot(querySnapshot => {
        const captures = [];
  
        querySnapshot.forEach(documentSnapshot => {
          captures.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
  
        setCaptures(captures);
      });
  
    return () => subscriber();
  }, []);
  const sortedData = captures
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const renderItem = useCallback(
    ({item}) => <CaptureListItem capture={item} />,
    [],
  );

  const keyExtractor = useCallback(item => item.image_uri, []);

  return (
    <Container>
      <FlatList
        data={sortedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </Container>
  );
};

export default CaptureListScreen
