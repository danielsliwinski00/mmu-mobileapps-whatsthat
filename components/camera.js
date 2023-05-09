/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
/* eslint-disable global-require */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable no-var */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable quote-props */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-template */
/* eslint-disable no-undef */
/* eslint-disable no-throw-literal */
/* eslint-disable no-else-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
/* eslint-disable react/sort-comp */
/* eslint-disable import/extensions */
// eslint-disable-next-line no-else-return
import {
  Camera, CameraType,
} from 'expo-camera';
import { useState } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    padding: 5,
    margin: 5,
    borderRadius: 15,
    backgroundColor: '#2A2F4F',
    borderWidth: 2,
    borderColor: '#ffffff',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);

  function toggleCameraType() {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
    console.log('Camera: ', type);
  }

  async function sendToServer(data) {
    console.log('HERE', data.uri);

    const res = await fetch(data.uri);
    const blob = await res.blob();

    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + await AsyncStorage.getItem('whatsthatID') + '/photo',
      {
        method: 'POST',
        headers: { 'Content-Type': 'image/png', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
        body: blob,
      },
    )
      .then((response) => {
        if (response.status == 200) {
          toast.show('Successfully Updated Photo', { type: 'success' });
        } else if (response.status == 500) {
          throw 'Server Error';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function takePhoto() {
    if (camera) {
      const options = { quality: 0.5, base64: true, onPictureSaved: (data) => sendToServer(data) };
      const data = await camera.takePictureAsync(options);
      console.log(data.uri);
    }
  }

  if (!permission || !permission.granted) {
    return (<Text>No access to camera</Text>);
  } else {
    return (
      <View style={{ flex: 1 }}>
        <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }} />
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={[styles.buttonContainer, { alignSelf: 'flex-end', flex: 1 }]}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                  <Text style={styles.text}>Flip Camera</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.buttonContainer, { alignSelf: 'flex-end', flex: 1 }]}>
                <TouchableOpacity style={styles.button} onPress={takePhoto}>
                  <Text style={styles.text}>Take Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Camera>
      </View>
    );
  }
}
