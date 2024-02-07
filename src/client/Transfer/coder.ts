import QR from 'qrcode';

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var length = bytes.byteLength;
  for (let i = 0; i < length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/* CTRC = ColorTransferRedundantCode */
// 1 byte = 8 bits = 2^8 states = 256 states
// 1 color dim = 1 cdim = 256 states to 16 states | ColorRedundant 1 / 16
// 1 cdim = 16 states = 4 bits
// 1 pixel = 3 cdims = 16 * 16 * 16 states = 12 bits = 8 bits data + 4 bits hash
// 1 block = 2 * 2 pixels = 4 pixels to 1 pixel | SpaceRedundant 1 / 4
// 4 pixels => 1 byte + 4 bits
// 1MB = 1 * 1024 * 1024 bytes = 65536 blocks = 256 * 256 blocks = 512 * 128 blocks (w * h | h * w)
// 1MB / s = 1GB / 1024s => 1024s => 17min

export function stringToImageDataByCTRC(input: string, scale: number, width: number): Uint8ClampedArray {
  const toWideColor = (value: number): number => value << 4 | value; // 0 => 00; F => FF
  const arrayBuffer = new Uint8ClampedArray(input.length * scale * scale * 4);
  for (let i = 0; i < input.length; i += 1) {
    const valueByte = input.charCodeAt(i);
    const valueR = toWideColor(valueByte >> 4);
    const valueG = toWideColor(valueByte & 0x0F);
    const valueB = valueR ^ valueG;
    const valueA = 255;
    const logicX = i % width;
    const logicY = Math.floor(i / width);
    for (let x = 0; x < scale; x += 1) {
      for (let y = 0; y < scale; y += 1) {
        const index = ((logicY * scale + y) * width * scale + logicX * scale + x) * 4;
        arrayBuffer[index + 0] = valueR;
        arrayBuffer[index + 1] = valueG;
        arrayBuffer[index + 2] = valueB;
        arrayBuffer[index + 3] = valueA;
      }
    }
  }
  console.log({ input, arrayBuffer });
  return arrayBuffer;
}

export async function drawImageDataByQR(canvas: HTMLCanvasElement, input: string): Promise<void> {
  return new Promise((resolve, reject) => {
    QR.toCanvas(canvas, input, error => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });    
  });
}