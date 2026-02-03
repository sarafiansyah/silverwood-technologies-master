'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button, Typography } from 'antd';
const { Title, Text } = Typography;

const PIXEL_TO_CM = 0.026;

const ARRulerPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [distanceCm, setDistanceCm] = useState<number>(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(true);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play();
      }
      setStream(s);
      setCameraOn(true);
    } catch (err) {
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraOn(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (points.length > 0) {
      ctx.fillStyle = 'red';
      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    if (points.length === 2) {
      ctx.strokeStyle = 'lime';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[1].x, points[1].y);
      ctx.stroke();

      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      const midX = (points[0].x + points[1].x) / 2;
      const midY = (points[0].y + points[1].y) / 2;
      ctx.fillText(`${distanceCm.toFixed(2)} cm`, midX + 10, midY - 10);
    }
  }, [points, distanceCm]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoints = [...points, { x, y }];
    setPoints(newPoints);

    if (newPoints.length === 2) {
      const dx = newPoints[1].x - newPoints[0].x;
      const dy = newPoints[1].y - newPoints[0].y;
      const distPx = Math.sqrt(dx * dx + dy * dy);
      setDistanceCm(distPx * PIXEL_TO_CM);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ position: 'absolute', top: 0, left: 0 }}
        onClick={handleCanvasClick}
      />

      <div style={{ position: 'absolute', top: 16, left: 16 }}>
        <Title level={3} style={{ color: 'white' }}>AR Ruler</Title>
        <Text style={{ color: 'white' }}>Distance: {distanceCm.toFixed(2)} cm</Text>

        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          <Button onClick={() => { setPoints([]); setDistanceCm(0); }}>
            Reset
          </Button>
          <Button onClick={cameraOn ? stopCamera : startCamera}>
            {cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ARRulerPage;
