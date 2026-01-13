import { useEffect, useState } from 'react';

import { Button, View, Text, Platform, StyleSheet, Image, ActivityIndicator, TouchableHighlight } from 'react-native';

// import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

import { Image as Img } from '@/lib/onnxwrapper/image';
import { load_model } from '@/lib/onnxwrapper/mobilenet';
import { softmax, top_k } from '@/lib/onnxwrapper/utils';
import { imagenet_classes } from '@/lib/onnxwrapper/in_classes.js';

export default function HomeScreen() {
  const [image, setImage] = useState(null);
  const [classes, setClasses] = useState([]);

  const [model, setModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelRunning, setModelRunning] = useState(false);

  async function loadModel() {
    setModelLoading(true)
    let start = Date.now();
    const model_ = await load_model()
    console.log(`model load finished in ${(Date.now() - start)/1000} seconds`)

    setModel(model_)
    setModelLoading(false)
  }

  async function runModel(tensor) {
    // const tensor = await loadImage()
    console.log(tensor.dims, tensor.type);
    const start = Date.now();
    const results = await model.run({
      input: tensor,
    });
    console.log(`model run finished in ${(Date.now() - start)/1000} seconds`)

    const probs = softmax(Array.from(results.output.cpuData));
    const top3 = top_k(probs, 3);
    // console.log(top3);
    // top3.map((idx)=>{
    //   console.log(imagenet_classes[idx])
    // })
    const top3Classes = top3.map((idx)=>imagenet_classes[idx])
    setClasses(top3Classes)
  }

  async function loadImage(uri) {
    if (!uri) {
      const exampleImage = require('@/assets/images/burns.jpg')
      const exampleImageUri = ImageRN.resolveAssetSource(exampleImage).uri
      uri = exampleImageUri
    }
    let img = await Img.from_file(uri)
    img = img.resize(224, 224)
    const tensor = await img.toTensor()
    
    return tensor
  }

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const imgUri = result.assets[0].uri

      setImage(imgUri)
      setModelRunning(true)
      const imgTensor = await loadImage(imgUri)
      await runModel(imgTensor)
      setModelRunning(false)
    }
  };

  useEffect(() => {
    loadModel()
  }, []);


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo}/>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <View style={styles.mainContainer}>
        { 
          modelLoading &&
          <View style={styles.modelLoadingContainer}>
            <ActivityIndicator />
            <ThemedText>Loading Model</ThemedText>
          </View>
        }
        { 
          modelRunning &&
          <View style={styles.modelLoadingContainer}>
            <ActivityIndicator />
            <ThemedText>Processing image</ThemedText>
          </View>
        }
        { !image && <Button title="Press me" onPress={pickImage}/> }
        { 
          image && 
          <TouchableHighlight onPress={pickImage}>
            <Image source={{ uri: image }} style={styles.image} />
          </TouchableHighlight>
        }
      </View>
      <View style={styles.classContainer}>
        {classes.map((item, index) => (
          <ThemedText key={index}>{item.substring(item.indexOf(" ") + 1)}</ThemedText>
        ))}

      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  defaultText: {
    // color: 'white',
  },
  mainContainer: {
    alignItems: 'center',
    gap: 12,
  },
  classContainer: {
    alignItems: 'center',
    gap: 12,
  },
  modelLoadingContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
