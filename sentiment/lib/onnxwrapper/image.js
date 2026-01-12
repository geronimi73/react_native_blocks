// import Canvas from 'canvas'
import jpeg from 'jpeg-js';
import {Buffer} from 'buffer';

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

    console.log("ImageData of len " + data.length)
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
}
