import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';

function crc32(buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return ~crc >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function png(size, pixels) {
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y += 1) {
    const offset = y * (stride + 1);
    raw[offset] = 0;
    pixels.copy(raw, offset + 1, y * stride, y * stride + stride);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function covers(x, y, size, radius) {
  const inset = radius;
  if (x >= inset && x < size - inset) return true;
  if (y >= inset && y < size - inset) return true;
  const cx = x < inset ? inset : size - inset;
  const cy = y < inset ? inset : size - inset;
  const dx = x + 0.5 - cx;
  const dy = y + 0.5 - cy;
  return dx * dx + dy * dy <= radius * radius;
}

function draw(size) {
  const pixels = Buffer.alloc(size * size * 4);
  const radius = size * 0.22;
  const ringOuter = size * 0.3;
  const ringInner = size * 0.2;
  const dot = size * 0.075;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      if (!covers(x, y, size, radius)) continue;
      const dx = x + 0.5 - size / 2;
      const dy = y + 0.5 - size / 2;
      const distance = Math.hypot(dx, dy);
      let red = 17;
      let green = 24;
      let blue = 39;
      if (distance <= dot) {
        red = 37;
        green = 99;
        blue = 235;
      } else if (distance >= ringInner && distance <= ringOuter) {
        red = 255;
        green = 255;
        blue = 255;
      }
      pixels[index] = red;
      pixels[index + 1] = green;
      pixels[index + 2] = blue;
      pixels[index + 3] = 255;
    }
  }
  return pixels;
}

mkdirSync('public/icon', { recursive: true });
for (const size of [16, 32, 48, 128]) {
  writeFileSync(`public/icon/${size}.png`, png(size, draw(size)));
}
