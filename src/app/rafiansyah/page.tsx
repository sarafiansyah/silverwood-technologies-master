import { Card, Layout, Space } from "antd";
import { GradualSpacing } from "@/components/Typography/Animations/GradualSpacing";
import { StaggeredFade } from "@/components/Typography/Animations/StaggeredFade";

export default function Page() {
  return (
    <Layout style={{ minHeight: "100vh", background:"#000000" }}>
     
        <Space orientation="vertical" size={24}>
          <GradualSpacing
            text="WELCOME MAHESA"
            style={{
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: -4,
               opacity: 0.8,
              color:"white"
            }}
          />
               <StaggeredFade
            text="WELCOME MAHESA"
            style={{
              fontSize: 40,
              fontWeight: 700,
    
              color:"white"
            }}
          />

          <StaggeredFade
            text="Subtitles drift into existence"
            style={{ fontSize: 20, opacity: 0.8,   color:"white" }}
          />
        </Space>
    
    </Layout>
  );
}
