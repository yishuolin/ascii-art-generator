import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { Button } from '@material-ui/core';
import { CustomSlider } from '../components';
import { getGrayscaleResult, getColorfulResult } from '../helpers';

export default function Home() {
  const MIN_WIDTH = 50;
  const MAX_WIDTH = Math.floor(800 / 12); // 12px

  const [width, setWidth] = useState(MIN_WIDTH);
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const fontSize = 800 / width;
  const result = useRef(null);

  const handleGrayscaleImage = async () => {
    result.current.innerHTML = '';
    setLoading(true);
    const string = await getGrayscaleResult(URL.createObjectURL(file), width);

    setTimeout(() => {
      result.current.innerText = string;
      setLoading(false);
    }, 1000);
    setOutput(string);
  };

  const handleColorfulImage = async () => {
    result.current.innerText = '';
    setLoading(true);
    const html = await getColorfulResult(URL.createObjectURL(file), width);

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

  const handleUpdateWidth = (e, newValue) => {
    result.current.innerText = '';
    result.current.innerHTML = '';
    setWidth(newValue);
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
        {file && <span>${file.name}</span>}
        <div style={{ width: '200px', marginLeft: '50px' }}>
          <CustomSlider
            defaultValue={width}
            value={width}
            onChange={handleUpdateWidth}
            marks
            min={MIN_WIDTH}
            max={MAX_WIDTH}
            valueLabelDisplay="auto"
          />
        </div>
        <Button
          variant="outlined"
          color="primary"
          component="span"
          disabled={!file}
          onClick={handleGrayscaleImage}>
          grayscale
        </Button>
        <Button
          variant="outlined"
          color="primary"
          component="span"
          disabled={!file}
          onClick={handleColorfulImage}>
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

        <div
          ref={result}
          style={{
            fontFamily: 'monospace',
            fontSize,
          }}></div>
      </div>
    </div>
  );
}
