"use client";

import {
    Typography,
    Form,
    Input,
    DatePicker,
    Button,
    Select,
    Grid,
    Tag,
    Card,
    Checkbox,
    InputNumber,
    Row,
    Col,
    Upload,
    Modal,
} from "antd";
import type { UploadProps } from "antd";
import type { UploadFile } from "antd/es/upload/interface";

import {
    UploadOutlined,
    DownloadOutlined,
    ReloadOutlined,
    SettingOutlined,
    DashboardOutlined,
    ScheduleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect } from "react";
import Image from "next/image";
import { i } from "framer-motion/client";
import { oilBrands } from "@/constants/viscorion-oil-details";

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

/* =======================
   Types & Interfaces
======================= */

interface GearNextChange {
    date: string;
    km: number;
}

interface GearRecord {
    gearOilBrand?: string;
    gearModel?: string;
    gearViscosity?: string;
    gearLastChanged: string | null;
    gearNextChange: GearNextChange | null;
}

interface OilRecord {
    oilBrand: string;
    modelName: string;
    viscosity: string;
    lastChanged: string;
    currentKm: number;
    mesinNextChange: {
        date: string;
        km: number;
    };
    gear: GearRecord | null;
}

interface FormValues {
    oilBrand: string;
    modelName: string;
    viscosity: string;
    lastChanged: Dayjs;
    currentKm: number;
    newKm: number;
    gearOilBrand?: string;
    gearModel?: string;
    gearViscosity?: string;
    gearLastChanged?: Dayjs;
}

export default function DashboardPage() {
    const [form] = Form.useForm<FormValues>();
    const [record, setRecord] = useState<OilRecord | null>(null);
    const [includeGear, setIncludeGear] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [
        modalUploadOilDetailsProperties,
        setModalUploadOilDetailsProperties,
    ] = useState(false);
    const [showEngineRemaining, setShowEngineRemaining] = useState(false);
    const [showGearRemaining, setShowGearRemaining] = useState(false);
    const screens = useBreakpoint();

    const labelStyle = { fontSize: "12px" };
    const controlWrapperStyle = {
        marginTop: -24,
        display: "flex",
    };
    const placeholderSelectStyle = { fontSize: 11 };
    const placeholderInputStyle = { fontSize: 11, height: 24, width: "100%" };

    const getOilBrandLogo = (brand?: string) => {
        return oilBrands.find((b) => b.value === brand)?.logo;
    };
    const getGearOilBrandLogo = (brand?: string) => {
        return oilBrands.find((b) => b.value === brand)?.logo;
    };

    const brandLogo = getOilBrandLogo(record?.oilBrand);
    const brandGearLogo = record?.gear?.gearOilBrand
        ? getGearOilBrandLogo(record.gear.gearOilBrand)
        : null;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleFinish = (values: FormValues): void => {
        const {
            oilBrand,
            modelName,
            viscosity,
            lastChanged,
            currentKm,
            gearOilBrand,
            gearModel,
            gearViscosity,
            gearLastChanged,
        } = values;

        const mesinNextChangeDate = dayjs(lastChanged).add(3, "month");
        const mesinNextKm = currentKm + 2500;

        const gearRecord: GearRecord = {
            gearOilBrand,
            gearModel,
            gearViscosity,
            gearLastChanged: gearLastChanged
                ? dayjs(gearLastChanged).format("YYYY-MM-DD")
                : null,
            gearNextChange: gearLastChanged
                ? {
                      date: dayjs(gearLastChanged)
                          .add(6, "month")
                          .format("YYYY-MM-DD"),
                      km: currentKm + 5000,
                  }
                : null,
        };

        const newRecord: OilRecord = {
            oilBrand,
            modelName,
            viscosity,
            lastChanged: dayjs(lastChanged).format("YYYY-MM-DD"),
            currentKm,
            mesinNextChange: {
                date: mesinNextChangeDate.format("YYYY-MM-DD"),
                km: mesinNextKm,
            },
            gear: includeGear ? gearRecord : null,
        };

        setRecord(newRecord);
    };

    const handleDownload = (): void => {
        if (!record) return;

        const blob = new Blob([JSON.stringify(record, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "oil-record.json";
        a.click();

        URL.revokeObjectURL(url);
    };

    const handleUpload: UploadProps["beforeUpload"] = (file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const data: OilRecord = JSON.parse(e?.target?.result as string);

            if (data.gear) setIncludeGear(true);

            form.setFieldsValue({
                oilBrand: data.oilBrand,
                modelName: data.modelName,
                viscosity: data.viscosity,
                lastChanged: data.lastChanged
                    ? dayjs(data.lastChanged)
                    : undefined,
                currentKm: data.currentKm,
                gearOilBrand: data.gear?.gearOilBrand,
                gearModel: data.gear?.gearModel,
                gearViscosity: data.gear?.gearViscosity,
                gearLastChanged: data.gear?.gearLastChanged
                    ? dayjs(data.gear.gearLastChanged)
                    : undefined,
            });

            setRecord(data);
        };

        reader.readAsText(file);
        return false;
    };

    const handleFileRead = (file: File) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const data: OilRecord = JSON.parse(e?.target?.result as string);

            if (data.gear) setIncludeGear(true);

            form.setFieldsValue({
                oilBrand: data.oilBrand,
                modelName: data.modelName,
                viscosity: data.viscosity,
                lastChanged: data.lastChanged
                    ? dayjs(data.lastChanged)
                    : undefined,
                currentKm: data.currentKm,
                newKm: form.getFieldValue("newKm"),
                gearOilBrand: data.gear?.gearOilBrand,
                gearModel: data.gear?.gearModel,
                gearViscosity: data.gear?.gearViscosity,
                gearLastChanged: data.gear?.gearLastChanged
                    ? dayjs(data.gear.gearLastChanged)
                    : undefined,
            });

            setRecord(data);
        };

        reader.readAsText(file);
    };

    function getTimeLeftFromLastChange(
        lastChanged?: string | Date | null,
        intervalMonths = 6
    ): { monthsLeft: number | null; daysLeft: number | null } {
        if (!lastChanged) return { monthsLeft: null, daysLeft: null };

        const last = new Date(lastChanged);
        const next = new Date(last);
        next.setMonth(next.getMonth() + intervalMonths);

        const today = new Date();
        if (next <= today) return { monthsLeft: 0, daysLeft: 0 };

        let months =
            (next.getFullYear() - today.getFullYear()) * 12 +
            (next.getMonth() - today.getMonth());

        const temp = new Date(today);
        temp.setMonth(today.getMonth() + months);

        if (temp > next) {
            months--;
            temp.setMonth(temp.getMonth() - 1);
        }

        const days = Math.ceil(
            (next.getTime() - temp.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
            monthsLeft: months,
            daysLeft: days,
        };
    }

    const { monthsLeft: engineMonths, daysLeft: engineDays } =
        getTimeLeftFromLastChange(record?.lastChanged, 3);

    const engineKmLeft =
        record?.mesinNextChange?.km != null
            ? Math.max(
                  0,
                  record.mesinNextChange.km - (form.getFieldValue("newKm") ?? 0)
              )
            : null;

    const { monthsLeft: gearMonths, daysLeft: gearDays } =
        getTimeLeftFromLastChange(record?.gear?.gearLastChanged, 6);

    const gearKmLeft =
        record?.gear?.gearNextChange?.km != null
            ? Math.max(
                  0,
                  record.gear.gearNextChange.km -
                      (form.getFieldValue("newKm") ?? 0)
              )
            : null;

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Card
                        title={
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <span
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            fontSize: screens.xs
                                                ? "12px"
                                                : "14px",
                                        }}
                                    >
                                        Viscorion Oil Monitoring System
                                    </span>
                                </Col>
                            </Row>
                        }
                        style={{
                            borderRadius: 12,
                            overflow: "hidden",
                            width: "100%",
                        }}
                        styles={{
                            body: { padding: 16 },
                        }}
                    >
                        <div
                            style={{
                                display: "grid",
                                gap: 16,
                            }}
                        >
                            <section id="oil-record" style={{ padding: "0px" }}>
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleFinish}
                                    style={{
                                        marginTop: 0,
                                        background: "#fff",
                                        padding: 0,
                                        borderRadius: 8,
                                    }}
                                >
                                    <Row gutter={24}>
                                        {/* Engine Oil */}
                                        <Col xs={12} sm={12} md={12}>
                                            <Title
                                                style={{
                                                    fontSize: isMobile
                                                        ? 14
                                                        : 14,
                                                }}
                                            >
                                                <DashboardOutlined /> Engine Oil
                                            </Title>

                                            <Form.Item
                                                label={
                                                    <span style={labelStyle}>
                                                        Oil Brand
                                                    </span>
                                                }
                                                name="oilBrand"
                                                style={{ marginBottom: 10 }}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please select engine oil brand!",
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    size="small"
                                                    options={oilBrands}
                                                    placeholder="Brands"
                                                ></Select>
                                            </Form.Item>

                                            <Form.Item
                                                label={
                                                    <span style={labelStyle}>
                                                        Model
                                                    </span>
                                                }
                                                name="modelName"
                                                style={{ marginBottom: 10 }}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please enter model name!",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    size="small"
                                                    style={
                                                        placeholderInputStyle
                                                    }
                                                    placeholder="e.g. 7100, Power1"
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label={
                                                    <span style={labelStyle}>
                                                        Viscosity
                                                    </span>
                                                }
                                                name="viscosity"
                                                style={{ marginBottom: 10 }}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please enter viscosity!",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    size="small"
                                                    style={
                                                        placeholderInputStyle
                                                    }
                                                    placeholder="e.g. 15000"
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label={
                                                    <span style={labelStyle}>
                                                        Last Changed
                                                    </span>
                                                }
                                                name="lastChanged"
                                                style={{ marginBottom: 10 }}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please select a date!",
                                                    },
                                                ]}
                                            >
                                                <DatePicker
                                                    size="small"
                                                    style={{
                                                        fontSize: 11,
                                                        width: "100%",
                                                    }}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label={
                                                    <span style={labelStyle}>
                                                        Current KM
                                                    </span>
                                                }
                                                name="currentKm"
                                                style={{ marginBottom: 10 }}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please enter KM!",
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    size="small"
                                                    style={
                                                        placeholderInputStyle
                                                    }
                                                    placeholder="e.g. 15000"
                                                />
                                            </Form.Item>
                                        </Col>

                                        {/* Gear Oil */}
                                        <Col xs={12} sm={12} md={12}>
                                            <div style={{ display: "flex" }}>
                                                <Title
                                                    style={{
                                                        fontSize: isMobile
                                                            ? 14
                                                            : 14,
                                                    }}
                                                >
                                                    <SettingOutlined /> Gear Oil
                                                </Title>{" "}
                                                <div
                                                    style={{
                                                        marginTop: -4,
                                                        marginLeft: 6,
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={includeGear}
                                                        onChange={(e) =>
                                                            setIncludeGear(
                                                                e.target.checked
                                                            )
                                                        }
                                                    ></Checkbox>
                                                </div>{" "}
                                            </div>

                                            <Form.Item
                                                label={
                                                    <span style={labelStyle}>
                                                        Gear Oil Brand
                                                    </span>
                                                }
                                                name="gearOilBrand"
                                                style={{ marginBottom: 10 }}
                                            >
                                                <Select
                                                    size="small"
                                                    placeholder="Brands"
                                                    options={oilBrands}
                                                    disabled={!includeGear}
                                                ></Select>
                                            </Form.Item>
                                            <Form.Item
                                                label={
                                                    <span style={labelStyle}>
                                                        Gear Oil Model
                                                    </span>
                                                }
                                                name="gearModel"
                                                style={{ marginBottom: 10 }}
                                            >
                                                <Input
                                                    placeholder="e.g. Gear Oil EP"
                                                    style={
                                                        placeholderInputStyle
                                                    }
                                                    disabled={!includeGear}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label={
                                                    <span style={labelStyle}>
                                                        Gear Oil Viscosity
                                                    </span>
                                                }
                                                name="gearViscosity"
                                                style={{ marginBottom: 10 }}
                                            >
                                                <Input
                                                    placeholder="e.g. 80W-90"
                                                    style={
                                                        placeholderInputStyle
                                                    }
                                                    disabled={!includeGear}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label={
                                                    <span style={labelStyle}>
                                                        Last Changed
                                                    </span>
                                                }
                                                name="gearLastChanged"
                                                style={{ marginBottom: 10 }}
                                            >
                                                <DatePicker
                                                    size="small"
                                                    style={{
                                                        fontSize: 11,
                                                        width: "100%",
                                                    }}
                                                    disabled={!includeGear}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    {/* Buttons */}
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            style={{ marginRight: 6 }}
                                        >
                                            Summarize
                                        </Button>
                                        <Button
                                            danger
                                            icon={<ReloadOutlined />}
                                            style={{ marginRight: 6 }}
                                            onClick={() => {
                                                form.resetFields();
                                                setRecord(null);
                                                setIncludeGear(false);
                                            }}
                                        ></Button>
                                        <Button
                                            icon={<UploadOutlined />}
                                            style={{ marginRight: 6 }}
                                            onClick={() => {
                                                setModalUploadOilDetailsProperties(
                                                    true
                                                );
                                            }}
                                        ></Button>
                                        <Button
                                            icon={<DownloadOutlined />}
                                            onClick={handleDownload}
                                            style={{ marginRight: 6 }}
                                        ></Button>
                                    </Form.Item>
                                </Form>

                                {/* Record Card */}
                                {record && (
                                    <>
                                        <Card
                                            title={
                                                <Row
                                                    justify="space-between"
                                                    align="middle"
                                                >
                                                    <Col>
                                                        <span
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 6,
                                                                fontSize:
                                                                    screens.xs
                                                                        ? "12px"
                                                                        : "14px",
                                                            }}
                                                        >
                                                            <DashboardOutlined />{" "}
                                                            Engine Oil Change
                                                            Record
                                                        </span>
                                                    </Col>
                                                </Row>
                                            }
                                            style={{
                                                marginTop: 30,
                                                padding: 0,
                                                width: screens.xs
                                                    ? 270
                                                    : "100%",
                                            }}
                                            styles={{
                                                body: {
                                                    padding: screens.xs
                                                        ? "10px 12px"
                                                        : "12px 18px",
                                                },
                                            }}
                                        >
                                            <div
                                                style={{ position: "relative" }}
                                            >
                                                {/* fixed-position faded logo */}
                                                {brandLogo && (
                                                    <div
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            right: screens.xs
                                                                ? 8
                                                                : 16,
                                                            top: screens.xs
                                                                ? 0
                                                                : -12,
                                                            width: screens.xs
                                                                ? 96
                                                                : 160,
                                                            height: screens.xs
                                                                ? 96
                                                                : 160,
                                                            backgroundImage: `url(${brandLogo})`,
                                                            backgroundRepeat:
                                                                "no-repeat",
                                                            backgroundSize:
                                                                "contain",
                                                            backgroundPosition:
                                                                "center",
                                                            opacity: 0.08,
                                                            pointerEvents:
                                                                "none",
                                                            zIndex: 0,
                                                        }}
                                                    />
                                                )}

                                                {/* card content */}
                                                <div
                                                    style={{
                                                        display: "grid",
                                                        gridTemplateColumns:
                                                            "80px 1fr",
                                                        rowGap: 0,
                                                        columnGap: 0,
                                                        position: "relative",
                                                        zIndex: 1,
                                                        fontSize: screens.xs
                                                            ? "10px"
                                                            : "14px",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Brand
                                                    </span>
                                                    <span>
                                                        {record?.oilBrand ??
                                                            "-"}
                                                    </span>

                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Model
                                                    </span>
                                                    <span>
                                                        {record?.modelName ??
                                                            "-"}
                                                    </span>

                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Viscosity
                                                    </span>
                                                    <span>
                                                        {record?.viscosity ??
                                                            "-"}
                                                    </span>

                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Last Changed
                                                    </span>
                                                    <span>
                                                        {record?.lastChanged ??
                                                            "-"}
                                                    </span>

                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Current KM
                                                    </span>
                                                    <span>
                                                        {form.getFieldValue(
                                                            "newKm"
                                                        ) ?? "-"}
                                                    </span>

                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Next Change
                                                    </span>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 8,
                                                            marginTop: -3,
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: "red",
                                                            }}
                                                        >
                                                            {showEngineRemaining ? (
                                                                <>
                                                                    {record
                                                                        ?.mesinNextChange
                                                                        ?.date ??
                                                                        "-"}
                                                                    {" / "}
                                                                    {record
                                                                        ?.mesinNextChange
                                                                        ?.km ??
                                                                        "-"}{" "}
                                                                    KM
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {engineMonths !=
                                                                        null &&
                                                                    engineDays !=
                                                                        null
                                                                        ? `${
                                                                              engineMonths >
                                                                              0
                                                                                  ? `${engineMonths} mo `
                                                                                  : ""
                                                                          }${engineDays} d left`
                                                                        : "-"}
                                                                    {" / "}
                                                                    {engineKmLeft !=
                                                                    null
                                                                        ? `${engineKmLeft} KM left`
                                                                        : "-"}
                                                                </>
                                                            )}
                                                        </span>

                                                        <Button
                                                            type="link"
                                                            size="small"
                                                            style={{
                                                                fontSize:
                                                                    screens.xs
                                                                        ? 12
                                                                        : 14,
                                                                padding: 0,
                                                                marginTop: -1,
                                                            }}
                                                            onClick={() =>
                                                                setShowEngineRemaining(
                                                                    (v) => !v
                                                                )
                                                            }
                                                        >
                                                            {showEngineRemaining ? (
                                                                <ClockCircleOutlined />
                                                            ) : (
                                                                <ScheduleOutlined />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                        <Card
                                            title={
                                                <Row
                                                    justify="space-between"
                                                    align="middle"
                                                >
                                                    <Col>
                                                        <span
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 6,
                                                                fontSize:
                                                                    screens.xs
                                                                        ? "12px"
                                                                        : "14px",
                                                            }}
                                                        >
                                                            <SettingOutlined />{" "}
                                                            Gear Oil Change
                                                            Record
                                                        </span>
                                                    </Col>
                                                </Row>
                                            }
                                            style={{
                                                marginTop: 30,
                                                padding: 0,
                                                width: screens.xs
                                                    ? 270
                                                    : "100%",
                                            }}
                                            styles={{
                                                body: {
                                                    padding: screens.xs
                                                        ? "10px 12px"
                                                        : "12px 18px",
                                                },
                                            }}
                                        >
                                            <div
                                                style={{ position: "relative" }}
                                            >
                                                {" "}
                                                {brandGearLogo && (
                                                    <div
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            right: screens.xs
                                                                ? 8
                                                                : 16,
                                                            top: screens.xs
                                                                ? 0
                                                                : -12,
                                                            width: screens.xs
                                                                ? 96
                                                                : 160,
                                                            height: screens.xs
                                                                ? 96
                                                                : 160,
                                                            backgroundImage: `url(${brandGearLogo})`,
                                                            backgroundRepeat:
                                                                "no-repeat",
                                                            backgroundSize:
                                                                "contain",
                                                            backgroundPosition:
                                                                "center",
                                                            opacity: 0.08,
                                                            pointerEvents:
                                                                "none",
                                                            zIndex: 0,
                                                        }}
                                                    />
                                                )}
                                                <div
                                                    style={{
                                                        display: "grid",
                                                        gridTemplateColumns:
                                                            "80px 1fr",
                                                        rowGap: 0,
                                                        columnGap: 2,
                                                        fontSize: screens.xs
                                                            ? "10px"
                                                            : "14px",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Brand
                                                    </span>
                                                    <span>
                                                        {record?.gear
                                                            ?.gearOilBrand ??
                                                            "-"}
                                                    </span>

                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Model
                                                    </span>
                                                    <span>
                                                        {record?.gear
                                                            ?.gearModel ?? "-"}
                                                    </span>

                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Viscosity
                                                    </span>
                                                    <span>
                                                        {record?.gear
                                                            ?.gearViscosity ??
                                                            "-"}
                                                    </span>

                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Current KM
                                                    </span>
                                                    <span>
                                                        {form.getFieldValue(
                                                            "newKm"
                                                        ) ?? "-"}
                                                    </span>

                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Last Changed
                                                    </span>
                                                    <span>
                                                        {record?.gear
                                                            ?.gearLastChanged ??
                                                            "-"}
                                                    </span>

                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Next Change
                                                    </span>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 8,
                                                            marginTop: -3,
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: "red",
                                                            }}
                                                        >
                                                            {showGearRemaining ? (
                                                                <>
                                                                    {record
                                                                        ?.gear
                                                                        ?.gearNextChange
                                                                        ?.date ??
                                                                        "-"}
                                                                    {" / "}
                                                                    {record
                                                                        ?.gear
                                                                        ?.gearNextChange
                                                                        ?.km ??
                                                                        "-"}{" "}
                                                                    KM
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {gearMonths !=
                                                                        null &&
                                                                    gearDays !=
                                                                        null
                                                                        ? `${
                                                                              gearMonths >
                                                                              0
                                                                                  ? `${gearMonths} mo `
                                                                                  : ""
                                                                          }${gearDays} d left`
                                                                        : "-"}
                                                                    {" / "}
                                                                    {gearKmLeft !=
                                                                    null
                                                                        ? `${gearKmLeft} KM left`
                                                                        : "-"}
                                                                </>
                                                            )}
                                                        </span>

                                                        <Button
                                                            type="link"
                                                            size="small"
                                                            style={{
                                                                fontSize:
                                                                    screens.xs
                                                                        ? 12
                                                                        : 14,
                                                                padding: 0,
                                                                marginTop: -1,
                                                            }}
                                                            onClick={() =>
                                                                setShowGearRemaining(
                                                                    (v) => !v
                                                                )
                                                            }
                                                        >
                                                            {showGearRemaining ? (
                                                                <ClockCircleOutlined />
                                                            ) : (
                                                                <ScheduleOutlined />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </>
                                )}
                            </section>
                        </div>
                        <div
                            style={{
                                borderTop: "1px solid #f0f0f0",
                                paddingTop: 8,

                                fontSize: 10,
                                // fontStyle: "italic",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    gap: 4,
                                    fontSize: 10,
                                    fontStyle: "italic",
                                    textAlign: "right",
                                }}
                            >
                                <span>Integrated with</span>

                                <div style={{ marginTop: 0 }}>
                                    <Image
                                        src="/assets/images/viscorion/viscorion-logo01.svg"
                                        alt="IMG integration"
                                        width={70}
                                        height={22}
                                        style={{ opacity: 0.7 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Modal
                        title={
                            <span
                                style={{
                                    fontSize: screens.xs ? 12 : 16,
                                    fontWeight: 600,
                                }}
                            >
                                Upload Record
                            </span>
                        }
                        open={modalUploadOilDetailsProperties}
                        onOk={() => {
                            const file = fileList[0]?.originFileObj;
                            if (file) {
                                handleFileRead(file);
                            }
                            setModalUploadOilDetailsProperties(false);
                        }}
                        onCancel={() =>
                            setModalUploadOilDetailsProperties(false)
                        }
                        okText="Save"
                        width={screens.xs ? "70%" : 500}
                    >
                        <Form form={form} layout="vertical">
                            {/* Current KM */}
                            <Form.Item
                                label={
                                    <span
                                        style={{
                                            fontSize: screens.xs ? 12 : 14,
                                        }}
                                    >
                                        Current KM
                                    </span>
                                }
                                name="newKm"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter current KM",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    min={0}
                                    placeholder="e.g. 12450"
                                />
                            </Form.Item>
                            <Text
                                type="secondary"
                                style={{
                                    display: "block",
                                    marginTop: -24,
                                    marginLeft: 8,
                                    marginBottom: 20,
                                    fontSize: 12,
                                }}
                            >
                                Last KM: {record?.currentKm ?? "-"}
                            </Text>

                            {/* Upload */}
                            <Form.Item
                                label={
                                    <span
                                        style={{
                                            fontSize: screens.xs ? 12 : 14,
                                        }}
                                    >
                                        Upload Details
                                    </span>
                                }
                            >
                                <Upload
                                    beforeUpload={() => false} // still needed to stop auto upload
                                    maxCount={1}
                                    fileList={fileList}
                                    onChange={({ fileList }) => {
                                        setFileList(fileList);

                                        // 🚨 file removed or none selected
                                        if (fileList.length === 0) {
                                            form.resetFields();
                                            setRecord(null);
                                            setIncludeGear(false);
                                            return;
                                        }

                                        const file = fileList[0]?.originFileObj;
                                        if (!file) return;

                                        handleFileRead(file);
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>
                                        Select File
                                    </Button>
                                </Upload>
                                {/* <Upload
                                            beforeUpload={handleUpload}
                                            showUploadList={false}
                                            style={{ marginRight: 6 }}
                                        >
                                            <Button
                                                icon={<UploadOutlined />}
                                            ></Button>
                                        </Upload> */}
                            </Form.Item>
                        </Form>
                    </Modal>
                </Col>
            </Row>
        </>
    );
}
