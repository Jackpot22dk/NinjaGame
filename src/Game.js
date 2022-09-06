import * as PIXI from "pixi.js";
import gsap from "gsap";
import Stage from "./Stage";

export default class Game {
  constructor() {
    this.myStage = new Stage();
    this.scene = this.myStage.scene;
    this.sortableChildren = true;
    this.background = this.myStage.bg;
    this.si = this.myStage.stageInfo;

    let assets = [
      "../assets/spritesheet/ninjarack.json",
      "../assets/images/background.jpg",
      "../assets/images/ninja-jump.png",
      "../assets/images/play.png",
    ];

    const loader = PIXI.Loader.shared
      .add(assets)
      .add("alienspine", "../assets/spritesheet/alien-spine/alienboss.json")
      .load((loader, res) => {
        let sheet =
          PIXI.Loader.shared.resources["../assets/spritesheet/ninjarack.json"]
            .spritesheet;
        this.ninja = new PIXI.AnimatedSprite(sheet.animations["alien"]);
        this.ninja.anchor.set(0.5);
        this.ninja.x = 512;
        this.ninja.y = 768 - 150;

        this.ninja.interactive = true;
        this.ninja.buttonMode = true;
        this.ninja.zIndex = 2;
        this.ninja.animationSpeed = 0.5;

        this.ninja.play();
        this.scene.addChild(this.ninja);

        this.si.app.stage.interactive = true;
        this.si.app.stage.on("pointerdown", (event) => {
          this.ninja.stop(); // stop ninja animation
          this.ninja.texture = PIXI.Texture.from(
            "../assets/images/ninja-jump.png"
          ); //skift texture til jump;

          let newPosition = event.data.getLocalPosition(this.background);
          gsap.to(this.ninja, {
            duration: 0.2,
            x: newPosition.x - 300,
            y: newPosition.y,
            ease: "Circ.easeOut",
            onComplete: () => {
              gsap.to(this.ninja, {
                duration: 0.2,
                x: 500,
                y: 768 - 150,
                ease: "circ.easeOut",
              });
              this.ninja.play();
            },
          });
        });
      });

    let bgTexture = PIXI.Texture.from("./assets/images/background.jpg");
    let _bg = new PIXI.Sprite(bgTexture);
    this.background.addChild(_bg);
  } // END constructor
} // END class
