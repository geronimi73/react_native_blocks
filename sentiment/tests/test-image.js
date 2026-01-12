import { Image } from '../lib/onnxwrapper/image.js';

async function testLoadImage() {
	const img = Image.from_file("assets/images/kitten.jpg")

}

testLoadImage();
