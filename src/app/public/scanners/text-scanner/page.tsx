'use client';

import React, { useRef, useState } from 'react';
import { Button, Input, Typography, Spin } from 'antd';
import Tesseract from 'tesseract.js';
import { CameraOutlined } from '@ant-design/icons';

const { Title } = Typography;

const OCRScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false); // camera starts OFF
  const [scannedText, setScannedText] = useState('');
  const [loading, setLoading] = useState(false);

  // Start camera
  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
      setStream(s);
      setCameraOn(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraOn(false);
  };

  // Capture image from video
  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scanWidth = videoRef.current.videoWidth * 0.6;
    const scanHeight = videoRef.current.videoHeight * 0.3;
    const scanX = (videoRef.current.videoWidth - scanWidth) / 2;
    const scanY = (videoRef.current.videoHeight - scanHeight) / 2;

    canvas.width = scanWidth;
    canvas.height = scanHeight;

    ctx.drawImage(
      videoRef.current,
      scanX, scanY, scanWidth, scanHeight,
      0, 0, scanWidth, scanHeight
    );

    const dataUrl = canvas.toDataURL('image/png');

    setLoading(true);
    try {
      const result = await Tesseract.recognize(dataUrl, 'eng', { logger: m => console.log(m) });
      const cleanText = result.data.text.replace(/[^a-zA-Z0-9\s]/g, '');
      setScannedText(cleanText);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 16 }}>
  <div style={{ position: 'relative', width: '100%', maxWidth: 480, margin: '0 auto' }}>
  <video
    ref={videoRef}
    style={{
      width: '100%',
      borderRadius: 8,
      backgroundColor: cameraOn ? '#000' : '#555',
      filter: cameraOn ? 'none' : 'brightness(0.5)'
    }}
    autoPlay
    muted
  />

  {/* Scan area overlay */}
  {cameraOn && (
    <div
      style={{
        position: 'absolute',
        top: '35%',
        left: '20%',
        width: '60%',
        height: '30%',
        border: '2px dashed #00ff00',
        borderRadius: 8,
        pointerEvents: 'none'
      }}
    />
  )}

  {/* Camera off message */}
  {!cameraOn && (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        pointerEvents: 'none',
        gap: 6
      }}
    >
      <CameraOutlined style={{ fontSize: 44, color: '#fff' }} />
    Please turn on your camera
    </div>
  )}
</div>


      <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'center' }}>
        <Button onClick={captureAndScan} disabled={!cameraOn}>Scan Text</Button>
        <Button onClick={cameraOn ? stopCamera : startCamera}>
          {cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        </Button>
      </div>

      <div style={{ marginTop: 16 }}>
        <Input.TextArea
          value={scannedText}
          rows={6}
          placeholder="Scanned text will appear here..."
        />
        {loading && <Spin style={{ marginTop: 8 }} tip="Scanning..." />}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default OCRScanner;
