"use client";

import React, { useRef, useState } from "react";
import { Button, Typography, Spin, Card, Input } from "antd";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { CameraOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const BarcodeScannerPage = () => {
   const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const scanSubscriptionRef = useRef<any>(null);

  const [scanning, setScanning] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const startScan = async () => {
    if (!videoRef.current) return;

    setLoading(true);
    setScanning(true);
    setResult("");

    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraOn(true);

      // Save subscription so we can stop later
      scanSubscriptionRef.current = codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, err) => {
          if (result) {
            setResult(result.getText());
            stopScan();
          }
          if (err && !(err.name === "NotFoundException")) {
            console.error(err);
          }
        }
      );
    } catch (err) {
      console.error("Camera error:", err);
      setCameraOn(false);
    } finally {
      setLoading(false);
    }
  };

  const stopScan = () => {
    setScanning(false);
    setCameraOn(false);

    const video = videoRef.current;
    if (video && video.srcObject) {
      const tracks = (video.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }

    // Stop ZXing decoding properly
    if (scanSubscriptionRef.current) {
      scanSubscriptionRef.current.stop?.(); // some versions have stop()
      scanSubscriptionRef.current = null;
    }

    codeReaderRef.current = null;
  };
    return (
        <div style={{ padding: 16 }}>
            <div
                style={{
                    maxWidth: 600,
                    textAlign: "center",
                }}
            >
             <div style={{ position: "relative", width: "100%", maxWidth: 480, margin: "0 auto" }}>
        <video
          ref={videoRef}
          style={{
            width: "100%",
            borderRadius: 8,
            backgroundColor: cameraOn ? "#000" : "#555",
            filter: cameraOn ? "none" : "brightness(0.5)",
          }}
          autoPlay
          muted
        />

        {/* Scan area overlay */}
        {cameraOn && (
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "20%",
              width: "60%",
              height: "30%",
              border: "2px dashed #00ff00",
              borderRadius: 8,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Camera off message */}
        {!cameraOn && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 14,
              textAlign: "center",
              pointerEvents: "none",
              gap: 6,
            }}
          >
            <CameraOutlined style={{ fontSize: 44, color: "#fff" }} />
            Please turn on your camera
          </div>
        )}
      </div>

                {loading && <Spin size="large" />}

                <div
                    style={{
                        margin: "20px 0",
                        display: "flex",
                        justifyContent: "center",
                        gap: 12,
                    }}
                >
                    {!scanning ? (
                        <Button type="primary" onClick={startScan}>
                            Start Scanning
                        </Button>
                    ) : (
                        <Button danger onClick={stopScan}>
                            Stop Scanning
                        </Button>
                    )}
                </div>

                <div style={{ marginTop: 16 }}>
                    <Text strong>Result:</Text>
                    <Input.TextArea
                        value={result}
                        rows={6}
                        placeholder="Scanned code will appear here..."
                        style={{ marginTop: 8 }}
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
};

export default BarcodeScannerPage;
