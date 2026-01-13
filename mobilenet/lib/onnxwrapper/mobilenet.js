import { ort, isReactNative } from './ort'

export async function load_model() {
  const onnxPath = "assets/models/mobilenetv2-12.onnx"
  let ortPath

  if (isReactNative) {
    const RNFS = require('react-native-fs'); 
    const rn = require('react-native'); 

    const assetPath = require('../../' + onnxPath)
    const assetPathUri = rn.Image.resolveAssetSource(assetPath).uri
    const localPath = `${RNFS.CachesDirectoryPath}/model.onnx`;
    await RNFS.downloadFile({fromUrl: assetPathUri, toFile: localPath}).promise;

    ortPath = localPath
  } else {
    ortPath = './' + onnxPath
  }

  const session = await ort.InferenceSession.create(ortPath);

  console.log(session)
  console.log(session.inputNames, session.outputNames);

  return session
}