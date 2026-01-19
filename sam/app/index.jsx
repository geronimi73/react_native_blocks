import { useEffect, useState } from 'react';

import { Button, View, Text, Platform, StyleSheet, Image, ActivityIndicator, TouchableHighlight } from 'react-native';
import { CachesDirectoryPath, downloadFile } from 'react-native-fs';

import * as ImagePicker from 'expo-image-picker';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

import { Image as Img } from 'tensor.rn';
import { AutoModel, AutoImageProcessor } from 'tensor.rn';

export default function HomeScreen() {
  const [image, setImage] = useState(null);
  const [imageDataURL, setImageDataURL] = useState(null);
  const [classes, setClasses] = useState([]);

  const [model, setModel] = useState(null);
  const [preprocessor, setPreprocessor] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelRunning, setModelRunning] = useState(false);

  async function loadImage() {
    const exampleImage = require('@/assets/images/burns.jpg')
    const exampleImageUri = Image.resolveAssetSource(exampleImage).uri
    let img = await Img.from(exampleImageUri)
    img = img.convert("L")
    // setImage(img)
    const dataURL = img.toDataURL('jpeg', 85);
    setImageDataURL(dataURL);

    // console.log(img)
  }

  async function loadModel() {
    setModelLoading(true)
    let start = Date.now();

    const encoder_uri = Image.resolveAssetSource(require("../assets/models/slimsam/vision_encoder.onnx")).uri
    const decoder_uri = Image.resolveAssetSource(require("../assets/models/slimsam/prompt_encoder_mask_decoder.onnx")).uri

    await downloadFile({fromUrl: encoder_uri, toFile: `${CachesDirectoryPath}/vision_encoder.onnx`}).promise;
    await downloadFile({fromUrl: decoder_uri, toFile: `${CachesDirectoryPath}/prompt_encoder_mask_decoder.onnx`}).promise;

    const model = await AutoModel.from_pretrained("Xenova/slimsam-77-uniform", CachesDirectoryPath)
    await model.load()

    console.log(`model load finished in ${(Date.now() - start)/1000} seconds`)

    const img_processor = await AutoImageProcessor.from_pretrained("Xenova/slimsam-77-uniform")
    setPreprocessor(img_processor)

    setModel(model)
    setModelLoading(false)
  }

  async function runModel(img) {
    img = await preprocessor.process(img)

    let tensor = await img.toTensor()
    tensor = tensor.permute([2, 0, 1]).unsqueeze_(0)
    let {image_embeddings, image_positional_embeddings} = await model.encode(tensor)

    console.log(image_embeddings.shape)
   // const start = Date.now();
    // const results = (await model.predict(img)).softmax()
    // console.log(`model run finished in ${(Date.now() - start)/1000} seconds`)

    // const top3 = results.topk(3)
    // const top3Classes = top3.map((idx) => {
    //   return IN1kClasses[idx] + ` (p=${results.data[idx].toFixed(2)})`
    // })

    // setClasses(top3Classes)
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
      const img = await Img.from(imgUri)

      await runModel(img)
      setModelRunning(false)
    }
  };

  useEffect(() => {
    loadModel()
    // loadImage()
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
{/*        {imageDataURL && (
          <Image
            source={{ uri: imageDataURL }}
            style={styles.image}
            resizeMode="contain"
          />
        )}*/}

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
