'use client';

import { Typography } from 'antd';

const { Title, Text } = Typography;

const TestPage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Title level={2}>Test Page</Title>
      <Text type="secondary">
        This is a simple Ant Design test page.
      </Text>
    </div>
  );
};

export default TestPage;
