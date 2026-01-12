export const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

let ort

export async function getOrt() {
  if (ort) return ort

  if (isReactNative) {
    ort = await import('onnxruntime-react-native');
  } else {
    ort = await import('onnxruntime-web');
  }

  return ort
}

