import { Application, Container, Graphics, Point } from 'pixi.js'

export class PixiRender {
  app: Application;
  vw: number;
  vh: number;
  sprites: Record<string, Graphics> = {};
  container: Container;

  constructor(vw: number, vh: number) {
    this.setViewDimension(vw, vh);
  }

  setViewDimension(vw: number, vh: number) {
    this.vh = vh;
    this.vw = vw;
  }

  addSprite(e) {
    let graphic = this.makeParticleGraphic(e);
    this.sprites[e.id] = graphic;
    this.container.addChild(graphic);
  }

  removeSprite(e) {
    this.container.removeChild(this.sprites[e.id]);
    delete this.sprites[e.id];
  }

  sync(e) {
    if (this.sprites[e.id]) {
      this.sprites[e.id].x = e.x;
      this.sprites[e.id].y = e.y;
      this.sprites[e.id].rotation = e.orientation;
    }
  }

  makeParticleGraphic(e) {
    let randomColor = Number('0x' + Math.floor(Math.random() * 16777215).toString(16));
    let graphic = new Graphics();
    if (e.type === 'C') {
      graphic.circle(0, 0, e.r);
      if (e.static) {
        graphic.stroke({ width: 1, color: e.color || randomColor });
      } else {
        graphic.fill({ color: e.color || randomColor, alpha: 1 });
      }
    } else {
      let pixiPts = e.vertices.map(pt => new Point(pt.x, pt.y));
      graphic.poly(pixiPts);
      if (e.static) {
        graphic.stroke({ width: 2, color: e.color || randomColor });
      } else {
        graphic.fill({ color: e.color || randomColor, alpha: 1 });
      }
    }
    drawCross(graphic);
    return graphic;
  }

  async initPixiApp() {
    this.app = new Application();
    await this.app.init({
      width: this.vw, height: this.vh, antialias: true,
      resolution: window.devicePixelRatio, backgroundAlpha: 1,
      backgroundColor: 0xffffff
    })
    this.app.canvas.style.width = this.vw + "px";
    this.app.canvas.style.height = this.vh + "px";

    this.container = new Container()
    this.app.stage.addChild(this.container);

    // Attach to DOM
    const containerDOM = document.getElementById('scene-container');
    if (containerDOM) {
      containerDOM.appendChild(this.app.canvas);
    }
    return;
  }
}

function drawCross(graphic: Graphics) {
  graphic.setStrokeStyle({ width: 1, color: "0xFFFFFF" });
  graphic.moveTo(0, -3);
  graphic.lineTo(0, 3);
  graphic.moveTo(-3, 0);
  graphic.lineTo(3, 0);
  graphic.stroke();
}