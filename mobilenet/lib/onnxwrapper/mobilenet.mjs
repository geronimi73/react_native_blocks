import { Image as ImageRN } from 'react-native';

let RNFS, ort
try { 
  RNFS = require('react-native-fs'); 
  ort = require('onnxruntime-react-native')
} catch(e) {}

if (!RNFS) {
  ort = import('onnxruntime-web')
}

// import {Image} from 'react-native';
import pkg from 'react-native';
const {Image} = pkg;

export async function load_model() {
  // const inputTensor = new Tensor('float32', new Float32Array([1, 2, 3]), [1, 3]);
  // console.log(inputTensor);
  const modelPath = require('../../assets/models/mobilenetv2-12.onnx')
  const modelPathUri = ImageRN.resolveAssetSource(modelPath).uri
  // console.log(modelPath)
  // console.log(modelPathUri)
  const localPath = `${RNFS.CachesDirectoryPath}/model.onnx`;
  await RNFS.downloadFile({fromUrl: modelPathUri, toFile: localPath}).promise;
  const session = await ort.InferenceSession.create(localPath);

  // const session = await ort.InferenceSession.create('./assets/models/mobilenetv2-12.onnx');
  // const session = await ort.InferenceSession.create(modelPathUri);
	// const canvas = new document.createElement('canvas');
  console.log(session)
  console.log(session.inputNames, session.outputNames);

  return session
}