import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { Button } from '@material-ui/core';
import { CustomSlider } from '../components';
import { getGrayscaleResult, getColorfulResult } from '../helpers';
import styled from '@emotion/styled';

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

  const Button = styled.button`
    margin-left: 9.3%;
    margin-top: 20px;
    background-color: #9faeda;
    color: #ffffff;
    font-size: 16px;
    font-family: Verdana;
  `;

  const Heading = styled.div`
    padding-top: 40px;
    padding-left: 5%;
    padding-bottom: 30px;
    color: white;
    font-size: 50px;
    font-family: Verdana;
    background-color: #9faeda;
  `;

  const Steps = styled.span`
    font-weight: bold;
    color: #526ebc;
  `;

  const ContentText = styled.div`
    margin-top: 50px;
    margin-left: 5%;
    color: #657ec3;
    font-size: 15px;
    font-family: Verdana;
  `;

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

        <Heading>
          ASCII Art
          <div> Generator</div>
        </Heading>

        <ContentText>
          <Steps>Step 1: </Steps>
          Upload a picture.
        </ContentText>

        <div>
          <Button>
            <label htmlFor="contained-button-file">Upload</label>
          </Button>
        </div>

        <div
          style={{
            fontSize: '10px',
            marginTop: '10px',
            marginLeft: '9.3%',
            color: '#526ebc',
          }}>
          File name:
          {file && <div>${file.name}</div>}
        </div>

        <ContentText>
          <Steps>Step 2:</Steps> Character density.
        </ContentText>

        <div>
          <CustomSlider
            style={{ width: '250px', marginTop: '20px', marginLeft: '9.3%' }}
            defaultValue={width}
            value={width}
            onChange={handleUpdateWidth}
            marks
            min={MIN_WIDTH}
            max={MAX_WIDTH}
            valueLabelDisplay="auto"
          />
          {loading && (
            <span
              style={{
                marginLeft: '30%',
                marginTop: '20px',
                color: '#657ec3',
              }}>
              Loading.....
            </span>
          )}
        </div>

        <ContentText>
          <Steps>Step 3:</Steps> Choose the color scheme generated.
        </ContentText>

        <div>
          <Button disabled={!file} onClick={handleGrayscaleImage}>
            Grayscale
          </Button>
        </div>
        <div>
          <Button disabled={!file} onClick={handleColorfulImage}>
            Colorful
          </Button>
        </div>

        <ContentText>
          <Steps>Step 4:</Steps> Download.
        </ContentText>

        <div>
          <Button>
            <a
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                output,
              )}`}
              download={output.startsWith('<div') ? 'art.html' : 'art.txt'}>
              Download
            </a>
          </Button>
        </div>

        <div
          ref={result}
          style={{
            fontFamily: 'monospace',
            fontSize,
            marginLeft: '29.5%',
            marginTop: '-535px',
          }}></div>
      </div>
    </div>
  );
}
