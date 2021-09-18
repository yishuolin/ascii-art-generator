import React, { useState, useRef } from 'react';
import Head from 'next/head';
import styled from '@emotion/styled';
import { CustomSlider, Step } from '../components';
import { getGrayscaleResult, getColorfulResult } from '../helpers';
import { MAIN, MAIN_DARK, MAIN_LIGHT } from '../util/Theme';

const ButtonContainer = styled.div`
  margin-left: 9.3%;
  margin-top: 20px;
  width: 200px;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  background-color: ${MAIN_LIGHT};
  color: #ffffff;
  font-size: 16px;
  font-family: Verdana;
  padding: 4px 6px;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  & > label {
    cursor: pointer;
  }
`;

const Heading = styled.h1`
  padding-top: 40px;
  padding-left: 5%;
  padding-bottom: 30px;
  margin: 0;
  color: white;
  font-size: 50px;
  font-family: Verdana;
  background-color: ${MAIN_LIGHT};
`;

const FileNameContainer = styled.div`
  font-size: 10px;
  margintop: 10px;
  margin-left: 9.3%;
  color: ${MAIN_DARK};
  & > div {
    width: 15%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const Loading = styled.span`
  margin-left: 30%;
  margin-top: 20px;
  color: ${MAIN};
`;

const Result = styled.div`
  font-family: monospace;
  font-size: ${(props) => props.fontSize};
  position: absolute;
  left: 580px;
  top: 250px;
`;

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
        <meta
          name="description"
          content="Generate ASCII art from your own image."
        />
        <meta name="keywords" content="ascii, ascii art" />
        <meta property="og:title" content="ASCII Art Generator" />
        <meta
          property="og:image"
          content="https://ascii-art-generator.vercel.app/og-image.png"
        />
        <meta
          property="og:description"
          content="Generate ASCII art from your own image."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Heading>
          ASCII Art<br></br>
          Generator
        </Heading>

        <Step count="1" description="Upload a picture."></Step>

        <input
          accept="image/png, image/jpeg"
          id="contained-button-file"
          type="file"
          hidden
          onChange={handleUpdateFile}
        />
        <ButtonContainer>
          <Button>
            <label htmlFor="contained-button-file">Upload</label>
          </Button>
        </ButtonContainer>

        <FileNameContainer>
          File name:
          {file && <div>{file.name}</div>}
        </FileNameContainer>

        <Step count="2" description="Character density."></Step>

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
        {loading && <Loading>Loading.....</Loading>}

        <Step count="3" description="Choose the color scheme generated."></Step>

        <ButtonContainer>
          <Button disabled={!file} onClick={handleGrayscaleImage}>
            Grayscale
          </Button>

          <Button disabled={!file} onClick={handleColorfulImage}>
            Colorful
          </Button>
        </ButtonContainer>

        <Step
          count="4"
          description="Download. Please open it with monospace font."></Step>

        <ButtonContainer>
          <Button>
            <a
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                output,
              )}`}
              download={output.startsWith('<div') ? 'art.html' : 'art.txt'}>
              Download
            </a>
          </Button>
        </ButtonContainer>

        <Result ref={result} fontSize={fontSize}></Result>
      </div>
    </div>
  );
}
