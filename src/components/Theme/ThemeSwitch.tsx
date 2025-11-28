"use client";

import { Switch } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

interface Props {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}

const ThemeSwitch = ({ isDark, setIsDark }: Props) => {
  return (
    <Switch
      checked={isDark}
      onChange={setIsDark}
      checkedChildren={<MoonOutlined />}
      unCheckedChildren={<SunOutlined />}
    />
  );
};

export default ThemeSwitch;
