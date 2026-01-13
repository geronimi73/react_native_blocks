import { MobileNet } from 'tensor.rn/models';
import { Image } from 'tensor.rn';
import { softmax, top_k } from 'tensor.rn/utils';

import { imagenet_classes } from '../lib/onnxwrapper/in_classes.js';

async function testInference() {
  const img = await Image.from_file("assets/images/kitten.jpg")
  const model = new MobileNet("assets/models/mobilenetv2-12.onnx")
  await model.load()
  const results = await model.predict(img)

  const probs = softmax(Array.from(results.ort_tensor.cpuData));
  const top3 = top_k(probs, 3);

  top3.map((idx)=>{
    console.log(imagenet_classes[idx])
  })
}

testInference();
