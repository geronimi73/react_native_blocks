import jpeg from 'jpeg-js';
import { Buffer } from 'buffer';
import fs from 'fs';

let RNFS, Canvas
try { 
  RNFS = require('react-native-fs'); 
} catch(e) {}

if (!RNFS) {
  Canvas = import('canvas')
}

export class Image {

  constructor(width, height, data) { 
    this.width = width; 
    this.height = height; 
    this.data = data; 

    console.log(`New Image (h=${height}, w=${width}, data len=${data.length})`)
  }
  
  static async from_file(path) {
    if (RNFS) {
      console.log("Using RNFS ")
      const localPath = `${RNFS.CachesDirectoryPath}/temp.jpg`;
      await RNFS.downloadFile({ fromUrl: path, toFile: localPath }).promise;

      const base64 = await RNFS.readFile(localPath, 'base64');
      const buffer = Buffer.from(base64, 'base64');
      const {width, height, data} = jpeg.decode(Buffer.from(base64, 'base64'), { useTArray: true });

      return new Image(width, height, data);

    } else {
      Canvas = await Canvas
      const img = await Canvas.loadImage(path);
      const canvas = Canvas.createCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      return new Image(img.width, img.height, imageData.data);
    }
  }

  resize(new_w, new_h) {
    const resized = new Uint8ClampedArray(new_w * new_h * 4);
    const x_ratio = this.width / new_w;
    const y_ratio = this.height / new_h;
    for (let i = 0; i < new_h; i++) {
      for (let j = 0; j < new_w; j++) {
        const px = Math.floor(j * x_ratio);
        const py = Math.floor(i * y_ratio);
        const src_idx = (py * this.width + px) * 4;
        const dst_idx = (i * new_w + j) * 4;
        resized[dst_idx] = this.data[src_idx];
        resized[dst_idx + 1] = this.data[src_idx + 1];
        resized[dst_idx + 2] = this.data[src_idx + 2];
        resized[dst_idx + 3] = this.data[src_idx + 3];
      }
    }
    return new Image(new_w, new_h, resized);

  }

  save(path) {
    const encoded = jpeg.encode(
      {width: this.width, height: this.height, data: this.data}, 
      90
    );

    if (RNFS) {
      return RNFS.writeFile(path, encoded.data.toString('base64'), 'base64');
    } else {
      return fs.writeFileSync(path, encoded.data);
    }
  }

}
