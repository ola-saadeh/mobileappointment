import React, { useState } from 'react';
import { View, Button } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';

const App = () => {
  const [file, setFile] = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      setFile(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Canceled');
      } else {
        console.log('Unknown Error: ' + JSON.stringify(err));
        console.error('Error picking document:', err);
      }
    }
  };

  const uploadFile = async () => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });

      const response = await axios.post('http://10.0.2.2:3003/student/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
    } catch (error) {
      console.log('Error uploading file:', error);
    }
  };

  return (
    <View>
      <Button title="Pick Document" onPress={pickDocument} />
      {file && <Button title="Upload File" onPress={uploadFile} />}
    </View>
  );
};

export default App;
