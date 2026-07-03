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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

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
        }
    }

    async function checkOut() {
        if (!employeeId) {
            message.warning("Select employee");
            return;
        }

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

    async function onPhotoSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file || !selectedCheckpoint || !employeeId) {
            return;
        }

        await uploadVisit(file);

        // Allow selecting the same file again later
        e.target.value = "";
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
        }
    }

    async function loadVisits() {
        const res = await axios.get("/api/attendance/visits");

        setVisits(res.data);
    }

    return (
        <div style={{ padding: 40 }}>
            {/* <Title>Attendance</Title> */}

            <Card style={{ marginBottom: 20 }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                    <Select
                        placeholder="Select Employee"
                        options={employees.map((e) => ({
                            label: e.name,
                            value: e.id,
                        }))}
                        onChange={setEmployeeId}
                    />

                    <Space>
                        <Button type="primary" onClick={checkIn}>
                            Check In
                        </Button>

                        <Button danger onClick={checkOut}>
                            Check Out
                        </Button>
                    </Space>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (file) {
                                setPhoto(file);
                            }
                        }}
                    />
                </Space>
            </Card>
            <Card title="Today's Checkpoints">
                {checkpoints.map((checkpoint: Checkpoint) => (
                    <Card key={checkpoint.id} style={{ marginBottom: 16 }}>
                        <h3>{checkpoint.name}</h3>

                        <p>{checkpoint.location}</p>

                        <Upload
                            beforeUpload={(file) => {
                                setCheckpointPhotos((prev) => ({
                                    ...prev,
                                    [checkpoint.id]: file,
                                }));

                                return false; // Prevent auto upload
                            }}
                            maxCount={1}
                            showUploadList
                        >
                            <Button icon={<UploadOutlined />}>
                                Select Photo
                            </Button>
                        </Upload>

                        <Button
                            type="primary"
                            style={{ marginTop: 12 }}
                            onClick={() =>
                                uploadVisit(
                                    checkpoint.id,
                                    checkpointPhotos[checkpoint.id],
                                )
                            }
                        >
                            Visit
                        </Button>
                    </Card>
                ))}
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
            <Card title="Visit History" style={{ marginTop: 24 }}>
                <Table
                    rowKey="id"
                    dataSource={visits}
                    pagination={{ pageSize: 5 }}
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
