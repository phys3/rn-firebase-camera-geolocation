import {Platform} from 'react-native';

const createFormData = (image_uri, body) => {
    const NAME_REGEX = /captures\/(.+.jpg)/;
    const data = new FormData();
    let imageName = `${new Date().toISOString()}.jpg`;
    if (NAME_REGEX.test(image_uri)) {
      imageName = image_uri.match(/captures\/(.+.jpg)/);
    }
  
    data.append('photo', {
      name: imageName,
      type: 'image/jpeg',
      uri:
        Platform.OS === 'android' ? image_uri : image_uri.replace('file://', ''),
    });
  
    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
  
    return data;
};

export default createFormData;
