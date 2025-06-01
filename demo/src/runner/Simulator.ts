import { App } from 'antd';
// @ts-ignore
import { Engine, Shapes, Util, ForceField, Entity } from "impact2d"
import { Application } from 'pixi.js'
import { PixiRender } from './PixiRender';
import { bottleScene, bounceScene, fillScene, getStaticWalls } from './SceneUtils';

const { Rect } = Shapes;

export class Simulator {
  engine: Engine;
  current: "1";
  interval: null;
  paused: false;
  ontoggle: Function;
  mousePos: { x: 0, y: 0 };
  intervals: [];
  showRender: true;
  pixiApp: PixiRender;
  vw: number;
  vh: number;
  updateMetrics: Function;
  lastFrame: number = performance.now();
  fps: number;
  onFpsUpdate: Function;

  private _lastFpsUpdate = 0;
  private _fpsUpdateInterval = 100;


  constructor(vw: number, vh: number) {
    this.setViewDimension(vw, vh);
    this.intervals = [];
    this.lastFrame = performance.now();

    document.addEventListener("keydown", (event) => {
      if (event.which === 32) {
        event.preventDefault();
        this.ontoggle && this.ontoggle();
      }
    })
  }

  static async create(vw: number, vh: number) {
    const sim = new Simulator(vw, vh);
    await sim.init(vw, vh)
    return sim;
  }

  async init(vw, vh) {
    this.pixiApp = new PixiRender(vw, vh);
    await this.pixiApp.initPixiApp();
    await this.initEngine();
    this.initSceneWalls();
    this.loadScene("1");
    return;
  }

  initEngine() {
    this.engine = new Engine({
      ctx: null,
      scale: 2000,
      delta: 0.02,
      onAdd: this.onAdd.bind(this),
      onRemove: this.onRemove.bind(this),
      postTick: this.postTick.bind(this),
    });
    return;
  }

  initSceneWalls() {
    const walls = getStaticWalls(this.vw, this.vh);
    walls.forEach((w) => this.engine.addEntity(w));
  }

  loadScene(id: string) {
    this.engine.removeAll();
    this.intervals.forEach(i => clearInterval(i));
    let entities: Entity[] = [];
    switch (id) {
      case "1":
        entities = fillScene(this.vw, this.vh, 160);
        this.engine.setGravity(2);
        break;
      case "2":
        entities = fillScene(this.vw, this.vh, 120);
        this.engine.setGravity(2);
        break;
      case "3":
        entities = fillScene(this.vw, this.vh, 80);
        this.engine.setGravity(2);
        break;
      case "a1":
        entities = fillScene(this.vw, this.vh, 45);
        this.engine.setGravity(0);
        break;
      case "a2":
        entities = fillScene(this.vw, this.vh, 40, 17);
        this.engine.setGravity(0);
        break;
      case "a3":
        entities = fillScene(this.vw, this.vh, 35, 15);
        this.engine.setGravity(0);
        break;
      case "a4":
        entities = fillScene(this.vw, this.vh, 30, 12);
        this.engine.setGravity(0);
        break;
      case "a5":
        entities = fillScene(this.vw, this.vh, 25, 10);
        this.engine.setGravity(0);
        break;
      case "a6":
        entities = fillScene(this.vw, this.vh, 19, 8);
        this.engine.setGravity(0);
        break;
      case "a7":
        entities = fillScene(this.vw, this.vh, 13, 5);
        this.engine.setGravity(0);
        break;
      case "6":
        entities = bottleScene(this.vw, this.vh);
        this.ontoggle = () => {
          this.engine.applyForceAtPoint(entities[0], { x: 0, y: -3000 }, { x: 30, y: -50 });
        }
        this.engine.setGravity(1);
        break;
      case "7":
        entities = bounceScene(this.vw, this.vh);
        this.engine.setGravity(5);
        break;
      default:
        break;
    }
    entities.forEach(e => this.engine.addEntity(e))
  }

  onAdd(e) {
    this.pixiApp.addSprite(e);
  }

  onRemove(e) {
    this.pixiApp.removeSprite(e);
  }

  postTick(e) {
    this.pixiApp.sync(e);
  }

  setViewDimension(vw: number, vh: number) {
    this.vh = vh;
    this.vw = vw;
  }

  private performAnimation = () => {
    if (!this.paused) {
      let stats = this.engine.tick();
    }
    requestAnimationFrame(this.performAnimation);
    const t1 = performance.now();
    this.fps = Number((1000 / (t1 - this.lastFrame)).toFixed(0));

    if (this.onFpsUpdate) {
      if (t1 - this._lastFpsUpdate > this._fpsUpdateInterval) {
        this.onFpsUpdate(this.fps);
        this._lastFpsUpdate = t1;
      }
    }

    this.lastFrame = t1;
  }

  start() {
    requestAnimationFrame(this.performAnimation);
  }
}