import { Image } from 'image-js';
const ASCII = ['@', '#', '$', 'S', '%', '?', '*', '+', 'o', ':', '.'];
const getConvertedChar = (val) => ASCII[Math.floor(val / 25)];

const getGrayscaleResult = async (url, width) => {
  const image = await Image.load(url);
  const gray = image.grey().resize({ width: width });

  let string = '';
  for (let i = 0; i < gray.data.length; i++) {
    const char = getConvertedChar(gray.data[i]);
    string += char + char;
    if ((i + 1) % gray.width === 0) string += '\n';
  }
  return string;
};

const getColorfulResult = async (url, width) => {
  let image = await Image.load(url);
  image = image.resize({ width: width });
  const { channels } = image;

  let html = '';
  for (let i = 0; i < image.data.length; i += channels) {
    const mean = (image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3;
    const char = getConvertedChar(mean);
    const color = `rgb(${image.data[i]}, ${image.data[i + 1]}, ${
      image.data[i + 2]
    })`;
    html +=
      `<span style="color: ${color}; ">${char}</span>` +
      `<span style="color: ${color}; ">${char}</span>`;
    if ((i + channels) % (image.width * channels) === 0) html += '<br />';
  }
  return html;
};

export { getGrayscaleResult, getColorfulResult };
