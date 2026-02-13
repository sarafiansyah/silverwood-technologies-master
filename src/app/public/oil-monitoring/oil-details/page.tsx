"use client";

import { Typography } from "antd";
import ArticleCard from "@/components/Card/ArticleCard"; // the card we made
import { FC } from "react";

const { Title } = Typography;

interface Article {
    title: string;
    description: string;
    imageUrl: string;
    tags?: string[];
}

const articleSection01: Article[] = [
    {
        title: "Exploring",
        description:
            "Umumnya, Yamaha menyarankan untuk mengganti oli mesin setiap 2.000 hingga 3.000 kilometer, tergantung pada jenis oli yang digunakan dan kondisi berkendara. ",
        imageUrl: "/assets/images/viscorion/viscorion-logo01.svg",
        tags: ["Yamaha Indonesia"],
    },
    {
        title: "Mastering Ant Design Components",
        description:
            "Untuk motor yang jarak tempuhnya 20-50 km sehari dapat dilakukan ganti oli setiap 2 bulan sekali. Hal ini dilakukan agar kondisi motor dapat lebih prima saat digunakan pada aktivitas sehari-hari.",
        imageUrl: "/assets/images/viscorion/viscorion-logo01.svg",
        tags: ["Honda Indonesia"],
    },
      {
        title: "Mastering Ant Design Components",
        description:
            "Oli sintetis jadi pilihan cerdas karena bahannya lebih stabil secara kimia, sehingga tidak mudah rusak akibat oksidasi. interval ganti olinya juga lebih panjang, bisa bertahan hingga 6-12 bulan.",
        imageUrl: "/assets/images/viscorion/viscorion-logo01.svg",
        tags: ["Suzuki Indonesia"],
    },
];

const articleSection02: Article[] = [
    {
        title: "Exploring",
        description:
            "Learn how to write cleaner, faster React apps using hooks, suspense, and concurrent mode.",
        imageUrl: "/assets/images/viscorion/viscorion-logo01.svg",
        tags: ["Honda"],
    },
    {
        title: "Mastering Ant Design Components",
        description:
            "A deep dive into Ant Design components and how to customize them for modern web apps.",
        imageUrl: "/assets/images/viscorion/viscorion-logo01.svg",
        tags: ["UI", "Design", "AntD"],
    },
];

const articleSection03: Article[] = [
    {
        title: "Exploring",
        description:
            "Learn how to write cleaner, faster React apps using hooks, suspense, and concurrent mode.",
        imageUrl: "/assets/images/viscorion/viscorion-logo01.svg",
        tags: ["Shell Indonesia"],
    },
    {
        title: "Mastering Ant Design Components",
        description:
            "A deep dive into Ant Design components and how to customize them for modern web apps.",
        imageUrl: "/assets/images/viscorion/viscorion-logo01.svg",
        tags: ["UI", "Design", "AntD"],
    },
];

interface ArticleSectionProps {
    heading: string;
    articles: Article[];
}

const ArticleSection: FC<ArticleSectionProps> = ({ heading, articles }) => (
    <div
        style={{
            marginBottom: 48,
            display: "flex",
            flexDirection: "column",
            gap: 24,
        }}
    >
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
            {heading}
        </Title>
        {articles.map((article) => (
            <ArticleCard
                key={article.title}
                title={article.title}
                description={article.description}
                imageUrl={article.imageUrl}
                tags={article.tags}
                onClick={() => console.log("Clicked:", article.title)}
            />
        ))}
    </div>
);

const ArticlesPage: FC = () => {
    return (
        <div
            style={{
                padding: 20,
                maxWidth: 1200,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: 48,
            }}
        >
            <ArticleSection
                heading="When to change engine oil?"
                articles={articleSection01}
            />
            <ArticleSection
                heading="When to change gear oil?"
                articles={articleSection02}
            />
            <ArticleSection
                heading="Oil Viscosity"
                articles={articleSection03}
            />
        </div>
    );
};

export default ArticlesPage;
