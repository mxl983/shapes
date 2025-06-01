import { useState, useCallback, useEffect } from "react";
import { Button, Typography, Select, Modal, Input, InputNumber, Form } from "antd";
import {
  PauseOutlined,
  ReloadOutlined,
  FireOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { MetricsPanel } from "./MetricsPanel";
//@ts-ignore
import { Shapes, Util, ForceField } from "impact2d";
import { getRandomColor } from "../runner/SceneUtils";
import "../app.css";
import { GithubOutlined, LinkedinOutlined } from "@ant-design/icons";

const { Circle, Polygon, Rect, RegPoly } = Shapes;

const { Title } = Typography;
const { Option } = Select;

const scenes = [
  { value: "6", label: "Bottle flip!" },
  { value: "7", label: "Bounceness" },
  { value: "1", label: "Shapes 1 (Gravity)" },
  { value: "2", label: "Shapes 2 (Gravity)" },
  { value: "3", label: "Shapes 3 (Gravity)" },
  { value: "a1", label: "Shapes 4 (Float)" },
  { value: "a2", label: "Shapes 5 (Float)" },
  { value: "a3", label: "Shapes 6 (Float)" },
  { value: "a4", label: "Shapes 7 (Float)" },
  { value: "a5", label: "Shapes 8 (Float)" },
  { value: "a6", label: "Shapes 9 (Float)" },
  { value: "a7", label: "Shapes 10 (Float)" },
  { value: "7", label: "Bounce" }
];

function randomId() {
  return "obj-" + Math.random().toString(36).slice(2, 8);
}

export const SidebarControls = ({
  sim,
}) => {
  const [selected, setSelected] = useState("1");
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    sim.loadScene(selected);
  }, [selected])

  const onRefresh = useCallback(() => {
    sim.loadScene(selected);
  }, [selected])

  const onPause = useCallback(() => {
    sim.paused = !sim.paused;
  }, [])

  const onAddBody = useCallback((values) => {
    const { name, sides, size, x, y } = values;
    let entity;
    const initialVelocity = { x: 100, y: -100 };

    if (sides === 1) {
      // Circle
      entity = new Circle({
        id: name,
        x,
        y,
        r: size,
        m: 3,
        v: initialVelocity,
        color: getRandomColor(),
      });
    } else {
      // Polygon
      entity = new RegPoly({
        id: name,
        x,
        y,
        r: size,
        sides,
        m: 3,
        v: initialVelocity,
        color: getRandomColor(),
      });
    }
    sim.engine.addEntity(entity);
  }, [])

  const onDisturb = useCallback(() => {
    let field1 = new ForceField({
      id: 'bomb',
      x: sim.vw / 2,
      y: sim.vh / 2,
      fn: function (e) {
        const G = 0.00066;
        const M = 10000000;
        const dist = Util.distSq(this, e);
        let forceMag = G * M * e.m / dist;
        let forceDir = Util.normalize(Util.vSub(this, e));
        e.v.x -= forceDir.x * forceMag / e.m;
        e.v.y -= forceDir.y * forceMag / e.m;
      }
    });
    sim.engine.addForceField(field1);
    setTimeout(() => {
      sim.engine.removeForceField('bomb');
    }, 400);
  }, [selected])

  const openModal = () => {
    const vw = sim?.vw || 800;
    const vh = sim?.vh || 600;
    form.setFieldsValue({
      name: randomId(),
      sides: 1,
      size: 20,
      x: Math.round(vw / 2),
      y: Math.round(vh / 2),
    });
    setModalOpen(true);
  };

  // Handle modal submit
  const handleAddBody = () => {
    form
      .validateFields()
      .then(values => {
        setModalOpen(false);
        form.resetFields();
        onAddBody(values);
      })
      .catch(() => { });
  };

  return (
    <div className="sidebar-controls">
      <Title level={4} style={{ margin: 0 }}>
        Controls
      </Title>

      {/* Scene Config Section */}
      <div className="sidebar-controls__section">
        <div className="sidebar-controls__section-label">
          Scene Select
        </div>
        <div className="sidebar-controls__select">
          <Select
            showSearch
            placeholder="Choose a scene"
            optionFilterProp="children"
            value={selected}
            onChange={setSelected}
            className="sidebar-controls__select"
          >
            {scenes.map(({ value, label }) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
        </div>
        <div className="sidebar-controls__buttons">
          <Button
            icon={<PauseOutlined />}
            onClick={onPause}
            style={{ flex: "1 1 45%" }}
          >
            Pause
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            style={{ flex: "1 1 45%" }}
          >
            Refresh
          </Button>
          <Button
            icon={<FireOutlined />}
            onClick={onDisturb}
            style={{ flex: "1 1 45%" }}
          >
            Disturb
          </Button>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={openModal}
            style={{ flex: "1 1 45%" }}
          >
            Add Body
          </Button>
        </div>
      </div>

      <div className="sidebar-controls__performance">
        <div className="sidebar-controls__performance-label">
          Performance
        </div>
        <div className="sidebar-controls__performance-panel">
          <MetricsPanel sim={sim} />
        </div>
      </div>

      {/* Add Body Modal */}
      <Modal
        title="Add Custom Body"
        open={modalOpen}
        onOk={handleAddBody}
        onCancel={() => setModalOpen(false)}
        okText="Add"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Number of Sides (1 for Circle)"
            name="sides"
            rules={[{ required: true, type: "number", min: 1, message: "Enter sides (1 for circle)" }]}
          >
            <InputNumber min={1} max={12} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Size (radius)"
            name="size"
            rules={[{ required: true, type: "number", min: 1, message: "Enter size" }]}
          >
            <InputNumber min={1} max={200} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="X Position"
            name="x"
            rules={[{ required: true, type: "number", message: "Enter X position" }]}
          >
            <InputNumber min={0} max={sim?.vw || 1000} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Y Position"
            name="y"
            rules={[{ required: true, type: "number", message: "Enter Y position" }]}
          >
            <InputNumber min={0} max={sim?.vh || 1000} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      <div style={{ textAlign: "center", padding: "1rem 0 0 0" }}>
        <div style={{ display: "flex", flexDirection: "row", gap: 16, justifyContent: "center", alignItems: "center" }}>
          <a
            href="https://github.com/jerrylmx/impact2d/tree/main"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#222", fontSize: 16, display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <GithubOutlined style={{ fontSize: 20 }} />
            Repo
          </a>
          <a
            href="https://www.linkedin.com/in/jerryliu0415/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0077b5", fontSize: 16, display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <LinkedinOutlined style={{ fontSize: 20 }} />
            LinkedIn
          </a>
        </div>
        <div style={{ marginTop: 12, color: "#bbb", fontSize: 13, letterSpacing: 1 }}>
          2D Physics in Pure JS Demo
        </div>
      </div>
    </div>
  );
};