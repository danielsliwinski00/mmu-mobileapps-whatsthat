import { Camera, CameraType, onCameraReady, CameraPictureOptions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const navigation = useNavigation();

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    console.log("Camera: ", type)
  }

  async function takePhoto() {
    if (camera) {
      const options = { quality: 0.5, base64: true, onPictureSaved: (data) => sendToServer(data) }
      const data = await camera.takePictureAsync(options)
      console.log(data.uri)
    }

  }

  async function sendToServer(data) {
    console.log("HERE", data.uri)

    let res = await fetch(data.uri);
    let blob = await res.blob()

    return fetch("http://localhost:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID") + "/photo",
      {
        method: 'POST',
        headers: { 'Content-Type': 'image/png', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
        body: blob
      })
      .then((response) => {
        if (response.status == 200) {
          toast.show("Successfully Updated Photo", { type: 'success' });
        }
        else if (response.status == 500) {
          throw "Server Error"
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (!permission || !permission.granted) {
    return (<Text>No access to camera</Text>)
  } else {
    return (
      <View style={{ flex: 1 }}>
        <Camera style={styles.camera} type={type} ref={ref => setCamera(ref)}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    padding: 5,
    margin: 5,
    backgroundColor: 'white'
  },
  button: {
    width: '100%',
    height: '100%'
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000'
  }
})