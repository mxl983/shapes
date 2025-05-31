import { useState, useCallback } from "react";
import { Button, Typography, Select, Space } from "antd";
import {
  PauseOutlined,
  ReloadOutlined,
  FireOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const scenes = [
  "Shapes-1", "Shapes-2", "Shapes-3",
  "Stress-test-1", "Stress-test-2", "Stress-test-3",
  "Bottle Flip", "Bounceness", "Black Hole", "PoolBall", "Bubble Stack"
];

export const SidebarControls = ({ onSelectScene, onPause, onRefresh, onBomb, onAddBody }) => {
  const [selected, setSelected] = useState(null);

  const handleSceneChange = useCallback((value) => {
    setSelected(value);
    onSelectScene(value);
  }, [onSelectScene]);

  return (
    <div
      style={{
        width: 260,
        padding: "1rem",
        backgroundColor: "#f9f9fb",
        borderRight: "1px solid #e0e0e0",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        overflowY: "auto"
      }}
    >
      <Title level={4} style={{ margin: 0 }}>Controls</Title>

      <div>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>Select Scene</div>
        <Select
          showSearch
          placeholder="Choose a scene"
          optionFilterProp="children"
          value={selected}
          onChange={handleSceneChange}
          style={{ width: "100%" }}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {scenes.map((scene) => (
            <Option key={scene} value={scene}>{scene}</Option>
          ))}
        </Select>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          justifyContent: "center"
        }}
      >
        <Button icon={<PauseOutlined />} onClick={onPause} style={{ flex: "1 1 45%" }}>
          Pause
        </Button>
        <Button icon={<ReloadOutlined />} onClick={onRefresh} style={{ flex: "1 1 45%" }}>
          Refresh
        </Button>
        <Button icon={<FireOutlined />} onClick={onBomb} style={{ flex: "1 1 45%" }}>
          Bomb
        </Button>
        <Button icon={<PlusOutlined />} type="primary" onClick={onAddBody} style={{ flex: "1 1 45%" }}>
          Add Body
        </Button>
      </div>
    </div>
  );
};
