import ExpoPixi, { PIXI } from 'expo-pixi';

const handlers = {
    pointerUp: () => {},
    pointerMove: () => {},
    pointerDown: () => {}
};
let counter = 0;

export default async (context, payload) => {
    const app = ExpoPixi.application({
        context,
        transparent: true,
    });

    const stage = app.stage;
    app.stage.interactive = true;

    const brush = new PIXI.Graphics();
    brush.beginFill(0xffffff);
    brush.drawCircle(0, 0, 50);
    brush.endFill();

    const texture1 = await ExpoPixi.textureAsync(payload.cover);
    const texture2 = await ExpoPixi.textureAsync(payload.image);
    PIXI.loader.load(setup);

    function setup() {

        const background = new PIXI.Sprite(texture1);
        stage.addChild(background);
        background.width = app.screen.width;
        background.height = app.screen.height;

        const imageToReveal = new PIXI.Sprite(texture2);
        stage.addChild(imageToReveal);
        imageToReveal.width = app.screen.width;
        imageToReveal.height = app.screen.height;

        const renderTexture = PIXI.RenderTexture.create(app.screen.width, app.screen.height, { transparent: true });

        const renderTextureSprite = new PIXI.Sprite(renderTexture);
        stage.addChild(renderTextureSprite);
        imageToReveal.mask = renderTextureSprite;

        let dragging = false;

        payload.handlers.pointerMove = (event) => {
            if (dragging) {
                brush.position.copy(event);
                app.renderer.render(brush, renderTexture, false, null, false);
                counter ++;
                if (counter >=20) {
                    console.log('win');
                    payload.status(true);
                }
            }
        };

        payload.handlers.pointerDown = (event) => {
            dragging = true;
            handlers.pointerMove(event);
        };

        payload.handlers.pointerUp = (event) => {
            dragging = false;
        };
    }

};
