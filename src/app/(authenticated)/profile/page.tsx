"use client"; // Required for client-side components in Next.js App Router

import React, { useEffect } from "react";
import {
    Layout,
    Card,
    Table,
    Statistic,
    Row,
    Col,
    Grid,
    Tag,
    Typography,
    Avatar,
    Button,
    Select,
    Input,
    Modal,
    Alert,
    notification,
} from "antd";
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    UserOutlined,
    DollarOutlined,
    ExperimentOutlined,
    LockOutlined,
    DeploymentUnitOutlined,
    InstagramOutlined,
    TwitterOutlined,
    GithubOutlined,
    FacebookOutlined,
    MessageOutlined,
    RetweetOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { RootState } from "@/store/store";
import { setUser } from "@/store/userSlice";
import type { UserState } from "@/store/userSlice";
import { useSelector, useDispatch } from "react-redux";
import DashboardCard from "@/components/Card/DashboardCard";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";
import AnimatedModal from "@/components/Modal/Animated";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;

const { useBreakpoint } = Grid;

// Define types for data
interface DashboardData {
    key: string;
    name: string;
    value: number;
    change: number;
}

type NotificationType = "success" | "info" | "warning" | "error";

const Profile: React.FC = () => {
    const screens = useBreakpoint();
    const dispatch = useDispatch();
    const firstName = useSelector((state: RootState) => state.user.firstName);
    const lastName = useSelector((state: RootState) => state.user.lastName);
    const userAvatar = useSelector((state: RootState) => state.user.avatarId);
    const userDataDetails = useSelector((state: RootState) => state.user);
    const [editUser, setEditUser] = useState<UserState>({
        ...userDataDetails,
    });
const [saving, setSaving] = useState(false);
    const [flipped, setFlipped] = useState(false);
    const [onEditMode, setOnEditMode] = useState(false);
    const [avatarModalOpen, setAvatarModalOpen] = useState(false);
    const [avatarList, setAvatarList] = useState<string[]>([]);
   const [avatarUnsaved, setAvatarUnsaved] = useState<string | undefined>(
  userAvatar
);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (!avatarModalOpen) return;

        fetch("/api/avatars")
            .then((res) => res.json())
            .then((data) => setAvatarList(data));
    }, [avatarModalOpen]);

    useEffect(() => {
  if (onEditMode) {
    setEditUser(userDataDetails);
    setAvatarUnsaved(userDataDetails.avatarId);
  }
}, [onEditMode]);

const handleSave = () => {
  setSaving(true);
  setTimeout(() => {
    dispatch(setUser(editUser)); 
    setSaving(false);
    setOnEditMode(false);
  }, 2000);
};

    const openNotificationWithIcon = (type: NotificationType) => {
        api[type]({
            title: <span style={{ fontWeight: 600 }}>Temporary Edit</span>,
            description:
                "Changes are temporary and saved only during your session. Signing out will reset everything.",
        });
    };

    return (
        <>
            {contextHolder}
            <Row justify="center" style={{ marginTop: 0 }}>
                <Col>
                    {onEditMode ? (
                        // Profile Card Edit Mode
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                style={{
                                    width: screens.xs ? 300 : 420,
                                    borderRadius: 16,
                                    background: "#fff",
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                                    padding: 24,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 16,
                                    margin: "0 auto",
                                }}
                            >
                                {/* Header */}
                                <Title
                                    level={4}
                                    style={{ margin: 0, textAlign: "center" }}
                                >
                                    Edit Profile
                                </Title>

                                {/* Avatar Section */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 8,
                                    }}
                                >
                                    <Avatar
                                        size={96}
                                     
                                        src={`/assets/images/avatar/${avatarUnsaved??userAvatar}.png`}
                                    />
                                    <Button
                                        size="small"
                                        type="link"
                                        onClick={() => setAvatarModalOpen(true)}
                                    >
                                        Change Avatar
                                    </Button>
                                </div>

                                {/* Form Fields */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 12,
                                    }}
                                >
                                    <Input
                                        placeholder="First Name"
                                        value={editUser.firstName}
                                        onChange={(e) =>
                                            setEditUser({
                                                ...editUser,
                                                firstName: e.target.value,
                                            })
                                        }
                                    />

                                    <Input
                                        placeholder="Last Name"
                                        value={editUser.lastName}
                                        onChange={(e) =>
                                            setEditUser({
                                                ...editUser,
                                                lastName: e.target.value,
                                            })
                                        }
                                    />

                                    <Input
                                        placeholder="Email"
                                        value={editUser.email}
                                        onChange={(e) =>
                                            setEditUser({
                                                ...editUser,
                                                email: e.target.value,
                                            })
                                        }
                                    />

                                    <Input
                                        placeholder="Phone Number"
                                        value={editUser.phoneNumber}
                                        onChange={(e) =>
                                            setEditUser({
                                                ...editUser,
                                                phoneNumber: e.target.value,
                                            })
                                        }
                                    />

                                    <Select
                                        placeholder="Member Type"
                                        value={editUser.memberType}
                                        onChange={(value) =>
                                            setEditUser({
                                                ...editUser,
                                                memberType: value,
                                            })
                                        }
                                        options={[
                                            { label: "Basic", value: "Basic" },
                                            {
                                                label: "Premium",
                                                value: "Premium",
                                            },
                                        ]}
                                    />

                                    <Select
                                        placeholder="Status"
                                        value={editUser.status}
                                        onChange={(value) =>
                                            setEditUser({
                                                ...editUser,
                                                status: value,
                                            })
                                        }
                                        options={[
                                            {
                                                label: "Online",
                                                value: "Online",
                                            },
                                            {
                                                label: "Offline",
                                                value: "Offline",
                                            },
                                        ]}
                                    />
                                </div>

                                {/* Actions */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: 8,
                                        gap:12
                                    }}
                                >
                                    <Button
                                        onClick={() => setOnEditMode(false)}
                                    >
                                 
                                        Cancel
                                    </Button>
                               <Button
  type="primary"
  loading={saving}
  disabled={saving}
  onClick={handleSave}
>
  {saving ? "Saving..." : "Save"}
</Button>
                                </div>
                            </motion.div>
                        </>
                    ) : (
                        // Profile Card Display
                        <div
                            style={{
                                perspective: 1000,
                                width: screens.xs ? 300 : "100vw", // small on XS, full width otherwise
                                height: screens.xs ? 460 : 650, // small on XS, full height otherwise
                                maxWidth: screens.xs ? "100%" : "80%", // optional: limit max width on large screens
                                margin: screens.xs ? 0 : "0 auto", // center horizontally when full width
                            }}
                        >
                            <motion.div
                                animate={{ rotateY: flipped ? 180 : 0 }}
                                transition={{ duration: 0.6 }}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    position: "relative",
                                    transformStyle: "preserve-3d",
                                    borderRadius: 16,
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                                    cursor: "pointer",
                                }}
                            >
                                {/* Front */}
                                <div
                                    style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                        backfaceVisibility: "hidden",
                                        backgroundColor: "#fff",
                                        borderRadius: 16,
                                        overflow: "hidden",
                                    }}
                                >
                                    {/* Top gradient */}
                                    <div
                                        style={{
                                            height: 190,
                                            backgroundImage: `url("/assets/images/background/bg-profile.jpg")`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "flex-end",
                                            position: "relative",
                                        }}
                                    >
                                        {/* Flip Button - top right corner */}
                                        {/* <Button
                                            size="small"
                                            onClick={() => setFlipped(!flipped)}
                                            style={{
                                                position: "absolute",
                                                top: 8,
                                                right: 8,
                                                zIndex: 10,
                                                gap: 2,
                                                fontSize: 10,
                                                padding: "0 8px",
                                            }}
                                        >
                                            <RetweetOutlined /> FLIP
                                        </Button> */}

                                        {/* Half-circle separator */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: -10,
                                                width: "100%",
                                                height: 40,
                                                background: "#fff",
                                                borderTopLeftRadius: "20% 20px",
                                                borderTopRightRadius:
                                                    "20% 20px",
                                            }}
                                        />

                                        {/* Avatar */}
                                        <Avatar
                                            size={80}
                                            src={`/assets/images/avatar/${userAvatar}.png`}
                                            style={{
                                                position: "relative",

                                                zIndex: 2,
                                            }}
                                        />
                                    </div>

                                    {/* Name & Role */}
                                    <div
                                        style={{
                                            textAlign: "center",
                                            marginTop: 6,
                                        }}
                                    >
                                        <Title
                                            level={4}
                                            style={{
                                                margin: 0,
                                                fontSize: screens.xs ? 16 : 20,
                                            }}
                                        >
                                            {firstName
                                                ? `${firstName} ${lastName}`
                                                : ""}
                                        </Title>
                                        <Text
                                            style={{
                                                display:"flex",
                                                textAlign:'center',
                                                    justifyContent:'center',

                                                fontSize: screens.xs ? 12 : 16,
                                                 margin:  screens.xs ? -2 : 0,
                                            }}
                                        >
                                            {userDataDetails.roles
                                                ? `${userDataDetails.roles}`
                                                : ""}
                                        </Text>
                                    </div>

                                    {/* Details */}
                                    {/* Details */}
                                    <div
                                        style={{
                                            padding: "16px 24px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: screens.xs ? 8 : 16, // spacing between items
                                        }}
                                    >
                                        {[
                                            ["Email", userDataDetails.email],
                                            [
                                                "Phone Number",
                                                userDataDetails.phoneNumber,
                                            ],
                                            [
                                                "Date Joined",
                                                userDataDetails.dateJoined,
                                            ],
                                            [
                                                "Member Type",
                                                userDataDetails.memberType,
                                            ],
                                            ["Status", userDataDetails.status],
                                        ].map(([label, value]) => (
                                            <div
                                                key={label}
                                                style={{
                                                    display: "flex",
                                                    flexDirection: screens.xs
                                                        ? "row"
                                                        : "column", // row if xs, column otherwise
                                                    justifyContent: screens.xs
                                                        ? "space-between"
                                                        : "flex-start",
                                                    alignItems: screens.xs
                                                        ? "center"
                                                        : "flex-start",
                                                    gap: screens.xs ? 4 : 2, // small gap between label/value
                                                }}
                                            >
                                                <Text
                                                    type="secondary"
                                                    style={{
                                                        fontSize: screens.xs
                                                            ? 12
                                                            : 14,
                                                    }}
                                                >
                                                    {label}
                                                </Text>
                                                <Text
                                                    strong
                                                    style={{
                                                        fontSize: screens.xs
                                                            ? 12
                                                            : 16,
                                                    }}
                                                >
                                                    {value || ""}
                                                </Text>
                                            </div>
                                        ))}
                                        {/* Social Media */}
                                        {/* Social Media Icons */}
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: 12,
                                                marginTop: 8,
                                            }}
                                        >
                                            {userDataDetails.instagram && (
                                                <Button
                                                    type="text"
                                                    icon={<InstagramOutlined />}
                                                    href={`https://instagram.com/${userDataDetails.instagram}`}
                                                    target="_blank"
                                                    style={{
                                                        fontSize: 18,
                                                        padding: 4,
                                                    }}
                                                />
                                            )}
                                            {userDataDetails.twitter && (
                                                <Button
                                                    type="text"
                                                    icon={<TwitterOutlined />}
                                                    href={`https://twitter.com/${userDataDetails.twitter}`}
                                                    target="_blank"
                                                    style={{
                                                        fontSize: 18,
                                                        padding: 4,
                                                    }}
                                                />
                                            )}
                                            {userDataDetails.github && (
                                                <Button
                                                    type="text"
                                                    icon={<GithubOutlined />}
                                                    href={`https://github.com/${userDataDetails.github}`}
                                                    target="_blank"
                                                    style={{
                                                        fontSize: 18,
                                                        padding: 4,
                                                    }}
                                                />
                                            )}
                                            {userDataDetails.facebook && (
                                                <Button
                                                    type="text"
                                                    icon={<FacebookOutlined />}
                                                    href={`https://facebook.com/${userDataDetails.facebook}`}
                                                    target="_blank"
                                                    style={{
                                                        fontSize: 18,
                                                        padding: 4,
                                                    }}
                                                />
                                            )}
                                            {userDataDetails.threads && (
                                                <Button
                                                    type="text"
                                                    icon={<MessageOutlined />}
                                                    href={`https://threads.net/${userDataDetails.threads}`}
                                                    target="_blank"
                                                    style={{
                                                        fontSize: 18,
                                                        padding: 4,
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Back */}
                                <div
                                    style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                        backfaceVisibility: "hidden",
                                        transform: "rotateY(180deg)",
                                        borderRadius: 16,
                                        background:
                                            "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: 16,
                                    }}
                                >
                                    {/* Flip Button - top right corner */}
                                                                    <Image
                                        src="/assets/logo/rd_silverwood02.svg"
                                        alt="Logo"
                                        width={180}
                                        height={180}
                                        style={{
                                            objectFit: "contain",
                                            marginBottom: 24,
                                        }}
                                    />

                                    {/* Barcode-style name */}
                                    <Text
                                        style={{
                                            fontFamily:
                                                "'Libre Barcode 39', system-ui",
                                            fontSize: 32, // adjust for barcode size
                                            color: "#000",
                                            textAlign: "center",
                                            userSelect: "none",
                                        }}
                                    >
                                        {firstName ? `*${firstName}` : ""}
                                    </Text>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    <div style={{ padding: 20 }}>
                        <Button
                            size="small"
                            onClick={() => setFlipped(!flipped)}
                            // style={{
                            //     position: "absolute",
                            //     top: 8,
                            //     right: 8,
                            //     zIndex: 10,
                            //     gap: 2,
                            //     fontSize: 10,
                            //     padding:"0 8px",
                            // }}
                        >
                            <RetweetOutlined /> FLIP
                        </Button>
                        <Button
                            size="small"
                            onClick={() => {
                                setOnEditMode(true);
                                openNotificationWithIcon("info");
                            }}
                        >
                            <RetweetOutlined /> EDIT
                        </Button>
                    </div>
                </Col>
            </Row>
            <AnimatedModal
                open={avatarModalOpen}
                onClose={() => setAvatarModalOpen(false)}
                title="Choose Your Avatar"
                width={520}
                topOffset={200}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(72px, 1fr))",
                        gap: 16,
                    }}
                >
                    {avatarList.map((file) => {
                        const avatarName = file.replace(
                            /\.(png|jpg|jpeg|webp|svg)$/i,
                            ""
                        );

                        return (
                            <div
                                key={file}
                                style={{
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                               onClick={() => {
  setAvatarUnsaved(avatarName); // 👈 preview only
}}

                            >
                                <Avatar
                                    size={64}
                                    src={`/assets/images/avatar/${file}`}
                                    style={{
                                     border:
  avatarUnsaved === avatarName
    ? "2px solid #1677ff"
    : "2px solid transparent",

                                        transition: "border 0.2s ease",
                                    }}
                                />
                            </div>
                        );
                    })}
              <Button
  size="small"
  onClick={() => {
    setAvatarUnsaved(editUser.avatarId); // revert preview
    setAvatarModalOpen(false);
  }}
>
  CANCEL
</Button>
                         <Button
  size="small"
  type="primary"
  onClick={() => {
    setEditUser((prev) => ({
      ...prev,
      avatarId: avatarUnsaved,
    }));
    setAvatarModalOpen(false);
  }}
>
  SAVE
</Button>
                </div>
            </AnimatedModal>
        </>
    );
};

export default Profile;
