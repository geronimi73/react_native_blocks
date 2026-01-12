import { load_model } from '../lib/onnxwrapper/mobilenet.js';
import { Image as Img } from '../lib/onnxwrapper/image.js';
import { imagenet_classes } from '../lib/onnxwrapper/in_classes.js';
import { softmax, top_k } from '../lib/onnxwrapper/utils.js';

async function testInference() {
  const model = await load_model()

  let img = await Img.from_file("assets/images/kitten.jpg")
  img = img.resize(224, 224)
  const imgTensor = await img.toTensor()
  const results = await model.run({
    input: imgTensor,
  });

  const probs = softmax(Array.from(results.output.cpuData));
  const top3 = top_k(probs, 3);

  top3.map((idx)=>{
    console.log(imagenet_classes[idx])
  })
}

testInference();
