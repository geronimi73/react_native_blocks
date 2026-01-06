import { useState, useEffect, useRef } from 'react';

import { Button, View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { caption_image } from '@/lib/moondream_api';

export function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('front');
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);

  async function takePicture() {
    if (!cameraRef.current) {
      console.log('Camera not ready or ref not available');
      return;
    }
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
      });
      
      return photo.uri

    } catch (err) {
      console.error('Error taking picture:', err);
    }
  };

  async function labelPicture() {
    try {
      setIsProcessing(true);
      
      const imgUri = await takePicture();
      
      if (!imgUri) {
        setIsProcessing(false);
        Alert.alert('Error', 'Failed to capture image');
        return;
      }
            
      const caption = await caption_image(imgUri);
      
      setIsProcessing(false);
      Alert.alert('Image Analysis', caption);
      
    } catch (error) {
      setIsProcessing(false);
      console.error('Error in labelPicture:', error);
      Alert.alert('Error', `Failed to analyze image: ${error.message}`);
    }
  }


  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  useEffect(() => {
    requestPermission()
  }, []);


  if (!permission) {
    // Camera permissions are still loading.
    return (
      <View>
        <Text>Loading Camera</Text>
      </View>
    )
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      
      {/* Processing Overlay */}
      {isProcessing && (
        <View style={styles.overlay}>
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.spinnerText}>Analyzing Image...</Text>
          </View>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={labelPicture}>
          <Text style={styles.text}>Label!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10,
  },
  spinnerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  spinnerText: {
    color: 'white',
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'col',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
    gap: 40
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});