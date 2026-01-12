import { Tensor } from 'onnxruntime-web';

async function testInference() {
  const inputTensor = new Tensor('float32', new Float32Array([1, 2, 3]), [1, 3]);
  console.log(inputTensor);
}

testInference();
