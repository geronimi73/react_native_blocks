import { useEffect } from 'react';

import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

// import { env, Tensor } from 'onnxruntime-react-native';

import { Image as Img } from '@/lib/onnxwrapper/image';
import { load_model } from '@/lib/onnxwrapper/mobilenet';
import { Image as ImageRN } from 'react-native';

export default function HomeScreen() {
  function softmax(arr) {
    const max = Math.max(...arr);
    const exps = arr.map(x => Math.exp(x - max));
    const sum = exps.reduce((a,b) => a + b, 0);
    return exps.map(x => x / sum);
  }

  function top_k(arr, k) {
    return arr.map((v,i) => [v,i]).sort((a,b) => b[0] - a[0]).slice(0,k).map(x => x[1]);
  }

  async function loadModel() {
    const model = await load_model()
    const tensor = await loadImage()

    console.log(tensor.dims, tensor.type);
    const start = Date.now();
    const results = await model.run({
      input: tensor,
    });
    // console.log(results)
    console.log(`model finished in ${(Date.now() - start)/1000} seconds`)

    const probs = softmax(Array.from(results.output.cpuData));
    const top3 = top_k(probs, 3);
    console.log(top3);
  }

  async function loadImage() {
    const exampleImage = require('@/assets/images/kitten.jpg')
    const exampleImageUri = ImageRN.resolveAssetSource(exampleImage).uri
    let img = await Img.from_file(exampleImageUri)
    img = img.resize(224, 224)
    const tensor = await img.toTensor()
    // console.log(tensor)
    console.log("Image loaded!")
    return tensor
  }


  useEffect(() => {
    loadModel()
  }, []);


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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
