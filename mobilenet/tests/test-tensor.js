import { ort } from 'tensor.rn';

async function testTensor() {
  const inputTensor = new ort.Tensor('float32', new Float32Array([1, 2, 3]), [1, 3]);
  console.log(inputTensor);
}

testTensor();
