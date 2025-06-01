// @ts-ignore
import { Engine, Shapes, Util, ForceField } from "impact2d"
const { Rect, Circle, RegPoly, Polygon } = Shapes;

const randColorSet = [
  0x6FCF97,
  0xFF6F61,
  0x2D9CDB,
  0x8A3FFC,
  0x0F62FE,
]

export const getRandomColor = () => {
  const idx = Math.floor(Math.random() * randColorSet.length);
  return randColorSet[idx];
}

export const getStaticWalls = (vw, vh) => {
  return [
    new Rect({ color: 0xf6f6f6, restitution: 0.9, eternal: true, static: true, id: 'bot', x: vw / 2, y: vh - 15, w: vw, h: 30, m: 100000, v: { x: 0, y: 0 } }),
    new Rect({ color: 0xf6f6f6, eternal: true, static: true, id: 'top', x: vw / 2, y: 15, w: vw, h: 30, m: 100000, v: { x: 0, y: 0 } }),
    new Rect({ color: 0xf6f6f6, eternal: true, static: true, id: 'left', x: 15, y: vh / 2, w: 30, h: vh, m: 100000, v: { x: 0, y: 0 } }),
    new Rect({ color: 0xf6f6f6, eternal: true, static: true, id: 'right', x: vw - 15, y: vh / 2, w: 30, h: vh, m: 100000, v: { x: 0, y: 0 } })
  ]
}

export const fillScene = (vw, vh, gap, size = 20) => {
  const res: any = [];
  for (let i = 40; i < vw-50; i += gap) {
    for (let j = 40; j < vh-50; j += gap) {
      let rand = Math.random();
      let randomColor = getRandomColor();
      if (rand < 0.6) {
        res.push(new Circle({ x: i, y: j, id: i + '-t' + j, r: size, m: 3, color: randomColor }));
      } else {
        res.push(new RegPoly({
          id: i + '-' + j,
          x: i,
          y: j,
          r: size,
          sides: rand < 0.8 ? 4 : 5,
          m: 3,
          color: randomColor
        }));
      }
    }
  }
  return res;
}

export const bottleScene = (vw, vh) => {
  let res: any = [];
  let vertices1 = [
    { x: -20, y: 0 },
    { x: -10, y: -30 },
    { x: 10, y: -30 },
    { x: 20, y: 0 },
    { x: 20, y: 100 },
    { x: -20, y: 100 }
  ];
  vertices1 = vertices1.map((v) => { return { x: v.x * 2 / 3 + vw/4, y: v.y * 2 / 3 + vh/2 }; });
  let bottle = new Polygon({
    restitution: 0.5,
    id: 'b1',
    vertices: vertices1,
    m: 10,
    v: { x: 0, y: 0 },
    color: getRandomColor()
  }
  );

  res = [
    bottle,
    new Rect({ static: true, id: 'table', x: vw/4, y: vh/2+100, w: 300, h: 10, m: 100000, v: { x: 0, y: 0 } }),
  ]

  return res;
}

export const bounceScene = (vw, vh) => {
  return [
    new Circle({ x: vw/7,   y: vh/2, id: 4, r: 20, m: 300, restitution: 0.2, v: { x: 0, y: 0 }, color: getRandomColor() }),
    new Circle({ x: 2*vw/7, y: vh/2, id: 5, r: 20, m: 300, restitution: 0.4, v: { x: 0, y: 0 }, color: getRandomColor() }),
    new Circle({ x: 3*vw/7, y: vh/2, id: 6, r: 20, m: 300, restitution: 0.6, v: { x: 0, y: 0 }, color: getRandomColor() }),
    new Circle({ x: 4*vw/7, y: vh/2, id: 7, r: 20, m: 300, restitution: 0.8, v: { x: 0, y: 0 }, color: getRandomColor() }),
    new Circle({ x: 5*vw/7, y: vh/2, id: 8, r: 20, m: 300, restitution: 0.9, v: { x: 0, y: 0 }, color: getRandomColor() })
  ]
}