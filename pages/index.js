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

        <div style={{paddingTop: '40px' , paddingLeft: '80px' , paddingBottom: '30px' , color: '#FFFFFF' , fontSize: '50px' , fontFamily: 'Verdana'  , backgroundColor: '#9faeda'}}>
          ASCII Art 
        <div> Generator</div>
        </div>

        <div style={{marginTop: '60px' , marginLeft: '80px' , color: '#657ec3' , fontSize: '15px' , fontFamily: 'Verdana' }}>
          <span style={{fontWeight: "bold" , color: '#526ebc'}}>Step 1:</span> Upload a picture.
        </div>

        <div>
        <label htmlFor="contained-button-file">
          <Button style = {{ marginTop: '20px' , marginLeft: '150px'}}
            variant="contained" color="primary" component="span">
            Upload
          </Button>
        </label>
        </div>

        <div style={{fontSize: '10px' , marginTop: '10px' , marginLeft: '150px', color: '#526ebc'}}>
          File name:
          {file && <div>${file.name}</div>}
        </div>
        
        <div style={{marginTop: '50px' , marginLeft: '80px' , color: '#657ec3' , fontSize: '15px' , fontFamily: 'Verdana' }}>
          <span style={{fontWeight: "bold", color: '#526ebc'}}>Step 2:</span> Character density.
          <div></div>
        </div>

        <div>
        <CustomSlider style={{ width: '250px' , marginTop: '20px' , marginLeft: '150px'}}
            defaultValue={width}
            value={width}
            onChange={handleUpdateWidth}
            marks
            min={MIN_WIDTH}
            max={MAX_WIDTH}
            valueLabelDisplay="auto"
            color="#3354a1"
          />
          {loading && <span style={{marginLeft: '440px' , marginTop: '20px' , color: '#657ec3'}}>Loading.....</span>}
        </div>

        <div style={{marginTop: '50px' , marginLeft: '80px' , color: '#657ec3' , fontSize: '15px' , fontFamily: 'Verdana' }}>
        <span style={{fontWeight: "bold" , color: '#526ebc'}}>Step 3:</span> Choose the color scheme generated.
        </div>
        
        <div style={{marginTop: '20px'}}>
        <Button style={{marginLeft: '150px'}}
          variant="contained"
          color="primary"
          component="span"
          disabled={!file}
          onClick={handleGrayscaleImage}>
          grayscale         
        </Button>
        </div>
        <div>
        <Button style={{marginLeft: '150px' , marginTop: '10px'}}
          variant="contained"
          color="primary"
          component="span"
          disabled={!file}
          onClick={handleColorfulImage}>
          colorful
        </Button>
        </div>

        <div style={{marginTop: '50px' , marginLeft: '80px' , color: '#657ec3' , fontSize: '15px' , fontFamily: 'Verdana' }}>
          <span style={{fontWeight: "bold" , color: '#526ebc'}}>Step 4:</span> Download.
        </div>

        <div>
        <Button style={{marginTop: '20px' , marginLeft: '150px'}}
          variant="contained" color="primary" component="span">
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(output)}`}
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
            marginLeft: '450px',
            marginTop: '-520px',
          }}></div>

      </div>
    </div>
  );
}