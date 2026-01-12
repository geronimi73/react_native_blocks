import { getOrt } from '../lib/onnxwrapper/ort.js';

async function testTensor() {
  const ort = await getOrt()
  const inputTensor = new ort.Tensor('float32', new Float32Array([1, 2, 3]), [1, 3]);
  // console.log(inputTensor);
}

testTensor();
