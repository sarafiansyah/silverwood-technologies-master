import {
  AppstoreOutlined,
  HomeOutlined,
  ShopOutlined,
  SafetyOutlined,
  DatabaseOutlined,
  CloudOutlined,
} from "@ant-design/icons";

export const specData = [
  {
    title: "Specification",
    icon: AppstoreOutlined,
    rows: [
      ["Name", "RD Silverwood"],
      ["Type", "Web Application"],
      ["Developed", "Nov 10, 2025"],
      ["Framework", "Next.js"],
      ["Runtime", `React ${process.env.NEXT_PUBLIC_REACT_VERSION}`],
      ["Language", "TypeScript"],
    ],
  },
  {
    title: "Frontend Stack",
    icon: HomeOutlined,
    tags: [
      { label: "Next.js", color: "blue" },
      { label: "React", color: "cyan" },
      { label: "AntD", color: "geekblue" },
      { label: "Framer", color: "purple" },
    ],
    rows: [
      ["Framework", `Next.js ${process.env.NEXT_PUBLIC_NEXT_VERSION}`],
      ["Router", "App Router"],
      ["UI Styling", "Ant Design"],
      ["Visualizations", "Ant Charts"],
      ["Animations", "Framer Motion"],
    ],
  },
  {
    title: "State Management",
    icon: ShopOutlined,
    tags: [
      { label: "Redux", color: "green" },
      { label: "Zustand", color: "gold" },
    ],
    rows: [
      ["Global State", "Redux Toolkit"],
      ["Modular State", "Zustand"],
      ["Persistence", "localStorage"],
    ],
  },
  {
    title: "Authentication & Security",
    icon: SafetyOutlined,
    rows: [
      ["Authentication", "NextAuth.js"],
      ["Password Hashing", "bcryptjs"],
      ["Access Control", "Private & Public"],
    ],
  },
  {
    title: "Data & Reporting",
    icon: DatabaseOutlined,
    rows: [
      ["Excel Export", "xlsx"],
      ["PDF Export", "jsPDF"],
      ["HTML Capture", "html2canvas"],
      ["File Download", "file-saver"],
    ],
  },
  {
    title: "External Services",
    icon: CloudOutlined,
    list: [
      "Google APIs Integration",
      "RESTful API Compatible",
    ],
  },
];
