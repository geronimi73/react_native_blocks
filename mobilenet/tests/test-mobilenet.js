import { load_model } from '../lib/onnxwrapper/mobilenet.js';

async function testInference() {
  load_model()
}

testInference();
