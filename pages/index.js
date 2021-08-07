import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { Image } from 'image-js';
import { Button, Slider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
const ASCII = ['@', '#', '$', 'S', '%', '?', '*', '+', 'o', ':', '.'];
const getConvertedChar = (val) => ASCII[Math.floor(val / 25)];
const MIN_RESOLUTION = 50;
const MAX_RESOLUTION = 500;
const PrettoSlider = withStyles({
  root: {
    color: '#52af77',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  mark: {
    height: 0,
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

export default function Home() {
  const [resolution, setResolution] = useState(100);
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const fontSize = 600 / resolution;
  const result = useRef(null);

  const handleGreyscaleImage = async (url) => {
    result.current.innerHTML = '';
    setLoading(true);
    const image = await Image.load(url);
    const grey = image.grey().resize({ width: resolution });

    let string = '';
    for (let i = 0; i < grey.data.length; i++) {
      const char = getConvertedChar(grey.data[i]);
      string += char + char;
      if ((i + 1) % grey.width === 0) string += '\n';
    }

    setTimeout(() => {
      result.current.innerText = string;
      setLoading(false);
    }, 100);
    setOutput(string);
  };

  const handleColorfulImage = async (url) => {
    result.current.innerText = '';
    setLoading(true);
    let image = await Image.load(url);
    image = image.resize({ width: resolution });
    const {channels} = image

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

    setTimeout(() => {
      setLoading(false);
      result.current.innerHTML = html;
    }, 1000);
    setOutput(
      `<div style="font-family: monospace; font-size: ${fontSize}px">` +
        html +
        '</div>',
    );
  };

  const handleUpdateFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdateResolution = (e, newValue) => {
    result.current.innerText = '';
    result.current.innerHTML = '';
    setResolution(newValue);
  };

  return (
    <div>
      <Head>
        <title>ASCII Art Generator</title>
        <meta name="description" content="ascii art generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <input
          accept="image/png, image/jpeg"
          id="contained-button-file"
          type="file"
          hidden
          onChange={handleUpdateFile}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span">
            Upload
          </Button>
        </label>
        <span>{file && file.name}</span>
        <div style={{ width: '200px', marginLeft: '50px' }}>
          <PrettoSlider
            defaultValue={resolution}
            value={resolution}
            onChange={handleUpdateResolution}
            marks
            min={MIN_RESOLUTION}
            max={MAX_RESOLUTION}
            valueLabelDisplay="auto"
          />
        </div>
        <Button
          variant="outlined"
          color="primary"
          component="span"
          disabled={!file}
          onClick={() => handleGreyscaleImage(URL.createObjectURL(file))}>
          greyscale
        </Button>
        <Button
          variant="outlined"
          color="primary"
          component="span"
          disabled={!file}
          onClick={() => handleColorfulImage(URL.createObjectURL(file))}>
          colorful
        </Button>
        <Button variant="contained" color="primary" component="span">
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(output)}`}
            download={output.startsWith('<div') ? 'art.html' : 'art.txt'}>
            Download
          </a>
        </Button>

        {loading && <div>Loading.....</div>}

        <div ref={result} style={{ fontFamily: 'monospace', fontSize }}></div>
      </div>
    </div>
  );
}
