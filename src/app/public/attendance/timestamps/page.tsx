"use client";

import { useEffect, useState, useRef } from "react";
import {
    Button,
    Card,
    Select,
    Space,
    Table,
    Typography,
    message,
    Modal,
    Upload,
    Input,
    Spin,
} from "antd";
import { UploadOutlined, CameraOutlined } from "@ant-design/icons";
import { BrowserMultiFormatReader } from "@zxing/browser";
import axios from "axios";

const { Title, Text } = Typography;

interface Employee {
    id: string;
    name: string;
}

interface Attendance {
    id: string;
    employeeId: string;
    date: string;
    checkIn: string;
    checkOut: string;
    status: string;
}

interface Checkpoint {
    id: string;
    name: string;
    location: string;
}

interface Visit {
    id: string;
    attendanceId: string;
    employeeId: string;
    checkpointId: string;
    visitTime: string;
    evidence: string;
}

export default function AttendancePage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [employeeId, setEmployeeId] = useState<string>();
    const [photo, setPhoto] = useState<File | null>(null);
    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [selectedCheckpoint, setSelectedCheckpoint] = useState<string>();
    const fileRef = useRef<HTMLInputElement>(null);
    const [visits, setVisits] = useState<Visit[]>([]);
    const [checkpointPhotos, setCheckpointPhotos] = useState<
        Record<string, File>
    >({});
    const videoRef = useRef<HTMLVideoElement>(null);
    const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
    const scanSubscriptionRef = useRef<any>(null);

    const [scanning, setScanning] = useState(false);
    const [cameraOn, setCameraOn] = useState(false);
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasScanned, setHasScanned] = useState(false);
    const [scannedCheckpoint, setScannedCheckpoint] =
        useState<Checkpoint | null>(null);
    const [checkpointPhoto, setCheckpointPhoto] = useState<File>();

    async function loadEmployees() {
        const res = await axios.get("/api/attendance/members");
        setEmployees(res.data);
    }

    async function loadAttendance() {
        const res = await axios.get("/api/attendance/timestamps");
        setAttendance(res.data);
    }

    useEffect(() => {
        loadEmployees();
        loadAttendance();
        loadCheckpoints();
        loadVisits();
    }, []);

    // async function checkIn() {
    //     if (!employeeId) {
    //         message.warning("Select employee");
    //         return;
    //     }

    //     try {
    //         await axios.post("/api/attendance/timestamps", {
    //             employeeId,
    //             type: "checkin",
    //         });

    //         message.success("Checked In");

    //         loadAttendance();
    //     } catch (e: any) {
    //         Modal.error({
    //             title: "Check In Failed",
    //             content: e.response?.data?.message || "Something went wrong.",
    //             okText: "OK",
    //             centered: true,
    //         });
    //     }
    // }

    async function checkIn() {
        if (!employeeId) {
            Modal.warning({
                title: "Employee Required",
                content: "Please select an employee.",
            });
            return;
        }

        if (!photo) {
            Modal.warning({
                title: "Photo Required",
                content: "Please select a photo first.",
            });
            return;
        }

        setLoading(true);

        try {
            // Step 1: Upload photo
            const formData = new FormData();
            formData.append("photo", photo);
            formData.append("employeeId", employeeId);

            const uploadRes = await axios.post(
                "/api/attendance/evidence",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            const photoId = uploadRes.data.fileId;

            // Step 2: Save attendance
            await axios.post("/api/attendance/timestamps", {
                employeeId,
                type: "checkin",
                photoId,
            });

            Modal.success({
                title: "Success",
                content: "Checked in successfully.",
            });

            setPhoto(null);
            loadAttendance();
        } catch (error: any) {
            Modal.error({
                title: "Check In Failed",
                content:
                    error.response?.data?.message ?? "Something went wrong.",
            });
        } finally {
            setLoading(false);
        }
    }

    async function checkOut() {
        if (!employeeId) {
            message.warning("Select employee");
            return;
        }

        setLoading(true);

        try {
            await axios.post("/api/attendance/timestamps", {
                employeeId,
                type: "checkout",
            });

            message.success("Checked Out");

            loadAttendance();
        } catch (e: any) {
            Modal.error({
                title: "Check Out Failed",
                content: e.response?.data?.message || "Something went wrong.",
                okText: "OK",
                centered: true,
            });
        } finally {
            setLoading(false);
        }
    }

    async function loadCheckpoints() {
        const res = await axios.get("/api/attendance/checkpoints");

        setCheckpoints(res.data);
    }

    function onVisit(checkpointId: string) {
        if (!employeeId) {
            Modal.warning({
                title: "Employee Required",
                content: "Please select an employee first.",
            });

            return;
        }

        setSelectedCheckpoint(checkpointId);

        fileRef.current?.click();
    }

    async function uploadVisit(checkpointId: string, file?: File) {
        if (!employeeId) {
            Modal.warning({
                title: "Employee Required",
                content: "Please select an employee.",
            });
            return;
        }

        if (!file) {
            Modal.warning({
                title: "Photo Required",
                content: "Please select a photo.",
            });
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append("photo", file);
            formData.append("employeeId", employeeId);

            const upload = await axios.post(
                "/api/attendance/evidence",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            await axios.post("/api/attendance/visits", {
                employeeId,
                checkpointId,
                evidence: upload.data.url,
            });

            Modal.success({
                title: "Success",
                content: "Checkpoint visited successfully.",
            });

            loadVisits();

            // Clear the selected photo for this checkpoint
            setCheckpointPhotos((prev) => {
                const updated = { ...prev };
                delete updated[checkpointId];
                return updated;
            });
        } catch (error: any) {
            Modal.error({
                title: "Visit Failed",
                content:
                    error.response?.data?.message ?? "Something went wrong.",
            });
        } finally {
            setLoading(false);
        }
    }

    async function loadVisits() {
        const res = await axios.get("/api/attendance/visits");

        setVisits(res.data);
    }

    const startScan = async () => {
        if (!videoRef.current) return;

        setLoading(true);
        setScanning(true);
        setHasScanned(false);
        setResult("");

        const codeReader = new BrowserMultiFormatReader();
        codeReaderRef.current = codeReader;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });
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
                    if (result && !hasScanned) {
                        setHasScanned(true);

                        const scannedId = result.getText().trim();

                        const checkpoint = checkpoints.find(
                            (c) => c.id === scannedId,
                        );

                        if (!checkpoint) {
                            Modal.error({
                                title: "Checkpoint not found",
                                content: scannedId,
                            });

                            stopScan();
                            return;
                        }

                        setResult(scannedId);
                        setScannedCheckpoint(checkpoint);

                        stopScan();
                    }
                },
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
            tracks.forEach((track) => track.stop());
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
        <div style={{ padding: 0 }}>
            {/* <Title>Attendance</Title> */}
            <Card
                title={
                    <span
                        style={{
                            fontSize: "14px",
                            fontWeight: 600,
                        }}
                    >
                        Check In
                    </span>
                }
                style={{ marginBottom: 20 }}
            >
                <Space orientation="vertical" style={{ width: "100%" }}>
                    <Select
                        placeholder="Select Employee"
                        options={employees.map((e) => ({
                            label: e.name,
                            value: e.id,
                        }))}
                        onChange={setEmployeeId}
                    />

                    <Space>
                        <Button
                            type="primary"
                            onClick={checkIn}
                            loading={loading}
                            disabled={loading}
                        >
                            Check In
                        </Button>

                        <Button
                            onClick={checkOut}
                            loading={loading}
                            disabled={loading}
                        >
                            Check Out
                        </Button>
                    </Space>
                    <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setPhoto(file);
                        }}
                    />

                    <label
                        htmlFor="photo-upload"
                        style={{
                            display: "inline-block",
                            width: "100%",
                            padding: "6px",
                            border: "2px solid #1677ff",
                            borderRadius: "8px",
                            backgroundColor: "#1677ff",
                            color: "#fff",
                            textAlign: "center",
                            cursor: "pointer",
                            fontWeight: 500,
                        }}
                    >
                        {photo ? photo.name : "Choose Photo"}
                    </label>
                </Space>
            </Card>
            <Card
                title={
                    <span
                        style={{
                            fontSize: "14px",
                            fontWeight: 600,
                        }}
                    >
                        View Complete Data
                    </span>
                }
                style={{ marginBottom: 20 }}
            >
                <Space orientation="vertical" style={{ width: "100%" }}>
                    <Button
                        type="primary"
                        onClick={() =>
                            window.open(
                                "https://docs.google.com/spreadsheets/u/1/d/1ANnxDkVygxcquCL2PIsYiKpQ7Fl0WLLtMabHlNHia8s/edit?gid=2018031072#gid=2018031072",
                                "_blank",
                            )
                        }
                    >
                        View Google Sheets
                    </Button>
                    <Button
                        type="primary"
                        onClick={() =>
                            window.open(
                                "https://drive.google.com/drive/u/1/folders/1LRHDJM2NFcyvgNwket7Dcj0umDk6_3o7",
                                "_blank",
                            )
                        }
                    >
                        View Google Drive
                    </Button>
                </Space>
            </Card>
            <Card
                title={
                    <span
                        style={{
                            fontSize: "14px",
                            fontWeight: 600,
                        }}
                    >
                        Checkpoints
                    </span>
                }
                styles={{
                    body: {
                        padding: 10, // Reduce from the default 24px
                    },
                }}
            >
                <div style={{ padding: 0 }}>
                    <div
                        style={{
                            maxWidth: 600,
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                maxWidth: 480,
                                margin: "0 auto",
                            }}
                        >
                            <video
                                ref={videoRef}
                                style={{
                                    width: "100%",
                                    borderRadius: 8,
                                    backgroundColor: cameraOn ? "#000" : "#555",
                                    filter: cameraOn
                                        ? "none"
                                        : "brightness(0.5)",
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
                                    <CameraOutlined
                                        style={{ fontSize: 44, color: "#fff" }}
                                    />
                                    Please turn on your camera
                                </div>
                            )}
                        </div>

                        {/* {loading && <Spin size="large" />} */}

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

                        {/* <div style={{ marginTop: 16 }}>
                            <Text strong>Result:</Text>
                            <Input.TextArea
                                value={result}
                                rows={6}
                                placeholder="Scanned code will appear here..."
                                style={{ marginTop: 8 }}
                                readOnly
                            />
                        </div> */}
                    </div>
                </div>
                {scannedCheckpoint && (
                    <Card title="Scanned Checkpoint" style={{ marginTop: 24 }}>
                        <Input
                            addonBefore="ID"
                            value={scannedCheckpoint.id}
                            disabled
                        />

                        <Input
                            addonBefore="Name"
                            value={scannedCheckpoint.name}
                            disabled
                            style={{ marginTop: 12 }}
                        />

                        <Input
                            addonBefore="Location"
                            value={scannedCheckpoint.location}
                            disabled
                            style={{ marginTop: 12 }}
                        />

                        <Select
                            style={{ width: "100%", marginTop: 12 }}
                            placeholder="Select Employee"
                            value={employeeId}
                            options={employees.map((e) => ({
                                label: e.name,
                                value: e.id,
                            }))}
                            onChange={setEmployeeId}
                        />

                        <input
                            id="checkpoint-photo"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            hidden
                            onChange={(e) => {
                                const file = e.target.files?.[0];

                                if (file) {
                                    setCheckpointPhoto(file);
                                }
                            }}
                        />

                        <label
                            htmlFor="checkpoint-photo"
                            style={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "12px",
                                padding: "10px",
                                border: "2px solid #1677ff",
                                borderRadius: "8px",
                                backgroundColor: "#1677ff",
                                color: "#fff",
                                textAlign: "center",
                                cursor: "pointer",
                                fontWeight: 500,
                                boxSizing: "border-box",
                            }}
                        >
                            {checkpointPhoto
                                ? checkpointPhoto.name
                                : "Select Evidence Photo"}
                        </label>

                        <Button
                            type="primary"
                            loading={loading}
                            disabled={loading}
                            style={{
                                marginTop: 12,
                                width: "100%",
                            }}
                            onClick={() =>
                                uploadVisit(
                                    scannedCheckpoint.id,
                                    checkpointPhoto,
                                )
                            }
                        >
                            Submit Visit
                        </Button>
                    </Card>
                )}
            </Card>
            <Table
                rowKey="id"
                columns={[
                    {
                        title: "Employee",
                        render: (_, row) =>
                            employees.find((e) => e.id === row.employeeId)
                                ?.name,
                    },
                    {
                        title: "Date",
                        dataIndex: "date",
                    },
                    {
                        title: "Check In",
                        dataIndex: "checkIn",
                    },
                    {
                        title: "Check Out",
                        dataIndex: "checkOut",
                    },
                    {
                        title: "Status",
                        dataIndex: "status",
                    },
                ]}
                dataSource={attendance}
            />
            <Card
                title={
                    <span
                        style={{
                            fontSize: "14px",
                            fontWeight: 600,
                        }}
                    >
                        Visit History
                    </span>
                }
                style={{ marginTop: 24 }}
            >
                <Table
                    rowKey="id"
                    dataSource={visits}
                    pagination={{ pageSize: 10 }}
                    columns={[
                        {
                            title: "Employee",
                            render: (_, row) =>
                                employees.find((e) => e.id === row.employeeId)
                                    ?.name,
                        },
                        {
                            title: "Checkpoint",
                            render: (_, row) =>
                                checkpoints.find(
                                    (c: any) => c.id === row.checkpointId,
                                )?.name,
                        },
                        {
                            title: "Visit Time",
                            dataIndex: "visitTime",
                        },
                        {
                            title: "Evidence",
                            render: (_, row) => (
                                <a
                                    href={row.evidence}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    View Photo
                                </a>
                            ),
                        },
                    ]}
                />
            </Card>
        </div>
    );
}
