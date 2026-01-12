import { Image } from '../lib/onnxwrapper/image.js';

async function testImage() {
	let img = await Image.from_file("assets/images/kitten.jpg")
	img = img.resize(224, 224)
	// await img.save("small_kitten.jpg")
	const t = await img.toTensor()
}

testImage();
