import RNFS from 'react-native-fs';

const dirPictures = `${RNFS.DocumentDirectoryPath}/captures`;

const moveAttachment = async (filePath, newFilepath) => {
  return new Promise((resolve, reject) => {
    RNFS.mkdir(dirPictures)
      .then(() => {
        RNFS.moveFile(filePath, newFilepath)
          .then(() => {
            console.log('FILE MOVED', filePath, newFilepath);
            resolve(true);
          })
          .catch(error => {
            console.log('moveFile error', error);
            reject(error);
          });
      })
      .catch(err => {
        console.log('mkdir error', err);
        reject(err);
      });
  });
};

const saveImage = async filePath => {
  try {
    const newImageName = `captured-${new Date().toISOString()}.jpg`;
    const newFilepath = `${dirPictures}/${newImageName}`;

    await moveAttachment(filePath, newFilepath);
    return newFilepath;
  } catch (error) {
    console.log(error);
  }
};

export default saveImage;
