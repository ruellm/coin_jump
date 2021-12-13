/**
    The Graphic class encapsulates all graphics related operation of HTML5.
    Author: Ruell Magpayo <ruellm@yahoo.com>
    Created Sept 03, 2012


    NOTE:
    1. If accessing the canvas dimension, please DO NOT access directly, please use the defined
    DEFAULT_WINDOW_WIDTH and/or DEFAULT_WINDOW_HEIGHT. 
    Golden rule: DO NOT ACCESS THE DOM. Even if modern browsers are optimized on this point, 
    reading DOM object properties is still to slow for a rendering loop. Use and cache value instead.
*/

function Graphics() {
        // The main buffer
        this._canvas = null;
        this._canvasContext = null;

        // The back buffer
        this._canvasBuffer = null;
        this._canvasBufferContext = null;

        //graphics render mode flag
        this._bFullScreen = true;

        // canvas style width -- the actual display dimensions
        this._styleWidth = 0;
        this._styleHeight = 0;
}

Graphics.prototype.Init = function () {
        // get the canvas object
        this._canvas = document.getElementById(GAME_CANVAS_ID);

        //TODO: set full screen canvas and ratio
        //var gameWidth = window.innerWidth;
        //var gameHeight = window.innerHeight;

        var gameWidth = DEFAULT_WINDOW_WIDTH;
        var gameHeight = DEFAULT_WINDOW_HEIGHT;

        var scaleToFitX = gameWidth / DEFAULT_WINDOW_WIDTH;
        var scaleToFitY = gameHeight / DEFAULT_WINDOW_HEIGHT;

        var currentScreenRatio = gameWidth / gameHeight;
        var optimalRatio = Math.min(scaleToFitX, scaleToFitY);

        // set canvas dimensions
        this._canvas.width = DEFAULT_WINDOW_WIDTH;
        this._canvas.height = DEFAULT_WINDOW_HEIGHT;

        // set the default style width
        this._styleWidth = gameWidth;
        this._styleHeight = gameHeight;

        // --------------------------------------------------------------
        // Comment this part if support for aspect ratio will be disabled
        // --------------------------------------------------------------
        // Reference
        // http://blogs.msdn.com/b/davrous/archive/2012/04/06/modernizing-your-html5-canvas-games-with-offline-apis-file-apis-css3-amp-hardware-scaling.aspx
        //
        //this is for 16/9 screen (ex: 1920x1080 Vaio Z screen or the 1366x768 Samsung BUILD tablet)
        //    
         if (currentScreenRatio >= 1.77 && currentScreenRatio <= 1.79) {
             this._styleWidth  = gameWidth;
             this._styleHeight = gameHeight;
         }
         else {
             this._styleWidth = DEFAULT_WINDOW_WIDTH * optimalRatio;
             this._styleHeight = DEFAULT_WINDOW_HEIGHT * optimalRatio;
         }

        //
        // ----------------------------------------------------------------
        //

        this._canvas.style.width = this._styleWidth + "px";
        this._canvas.style.height = this._styleHeight + "px";

        // check whether browser supports getting canvas context 
        if (this._canvas && this._canvas.getContext('2d')) {

                
                // get main canvas context
                this._canvasContext = this._canvas.getContext('2d');
/*
                // create double buffering
                this._canvasBuffer = document.createElement('canvas');
                this._canvasBuffer.width = DEFAULT_WINDOW_WIDTH;
                this._canvasBuffer.height = DEFAULT_WINDOW_HEIGHT;
                this._canvasBufferContext = this._canvasBuffer.getContext('2d');
                */

                this._canvasBuffer = this._canvas;
                this._canvasBufferContext = this._canvasContext;
        }
}

Graphics.prototype.Clear = function () {
        //clear the main canvas
        this._canvasContext.clearRect(0, 0,
            DEFAULT_WINDOW_WIDTH, DEFAULT_WINDOW_HEIGHT);

        /*
        //clear the back buffer canvas
        this._canvasBufferContext.clearRect(0, 0,
            DEFAULT_WINDOW_WIDTH, DEFAULT_WINDOW_HEIGHT);
        */
        //fill canvasbuffer with full black color
        this._canvasContext.fillStyle = "rbg(255,0,0)";
        //this._canvasBufferContext.fillStyle = "rbg(255,0,0)";
}

Graphics.prototype.Flip = function () {
        /*
        //flip the buffer
        //
        if (this._bFullScreen) {
                this._canvasContext.drawImage(this._canvasBuffer, 0, 0);
        } else {
                this._canvasContext.drawImage(this._canvasBuffer, 0, 0, DEFAULT_WINDOW_WIDTH,
                    GAME_RENDER_WINDOW_HEIGHT - GAME_RENDER_WINDOW_YOFFSET,
                    0, GAME_RENDER_WINDOW_YOFFSET,
                    DEFAULT_WINDOW_WIDTH,
                    GAME_RENDER_WINDOW_HEIGHT - GAME_RENDER_WINDOW_YOFFSET);
        }
        */
}

//
//TODO: Support Polymorphism for Draw method
//
Graphics.prototype.DrawImage
    = function (/**Image*/ image, /**Number*/ sx, /**Number*/ sy, /**Number*/sw, /**Number*/sh,
        /**Number*/dx, /**Number*/dy, /**Number*/dw, /**Number*/dh,
        /**Number*/ alpha) {
	
	    if(image==null) return;
		
            //save previous buffer state
            this._canvasBufferContext.save();

            //set alpha
            this._canvasBufferContext.globalAlpha = (typeof alpha != 'undefined') ? alpha : 1.0;

            //draw the image in the back buffer.
            this._canvasBufferContext.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

            //restore state
            this._canvasBufferContext.restore();
    }

Graphics.prototype.DrawImageFullA = function (/**Image*/ image, /**Number*/ dx,
    /**Number*/ dy,/**Number*/ alpha) {
        //save previous buffer state
	if(image==null) return;
	
        this._canvasBufferContext.save();	
        if (alpha) {
                //set alpha
                this._canvasBufferContext.globalAlpha = (alpha) ? alpha : 1.0;
        }

        //draw the image in the back buffer.
        this._canvasBufferContext.drawImage(image, dx, dy);

        //restore state
        this._canvasBufferContext.restore();
}

Graphics.prototype.DrawImageFull = function (/**Image*/ image, /**Number*/ dx,
    /**Number*/ dy) {
        this.DrawImageFullA(image, dx, dy, 1.0);
}

Graphics.prototype.DrawText
    = function (/**String*/ text, /**Number*/ x, /**Number*/ y,
        /**String*/ fillStyle,  /**String*/ fontSetting) {
            //draw the text into the back buffer
            //fill style format ex: "rgb(255,255,255)"
            //font setting "italic 40pt Calibri"

            this._canvasBufferContext.save();
            if (fillStyle)
                    this._canvasBufferContext.fillStyle = fillStyle;
            if (fontSetting)
                    this._canvasBufferContext.font = fontSetting;

            this._canvasBufferContext.fillText(text, x, y);
            this._canvasBufferContext.restore();

    }

Graphics.prototype.FillRect
    = function (/**Number*/x,/**Number*/y,/**Number*/w,/**Number*/h,
        /**String*/ fillStyle, /**Number*/ alpha) {
            //Draw Rect to back buffer
            //fill style format ex: "rgb(255,255,255)"
            this._canvasBufferContext.save();
            this._canvasBufferContext.globalAlpha = (alpha) ? alpha : 1.0;
            this._canvasBufferContext.fillStyle = fillStyle;
            this._canvasBufferContext.fillRect(x, y, w, h);
            this._canvasBufferContext.restore();
    }

Graphics.prototype.GetRenderWidth = function () {
        return DEFAULT_WINDOW_WIDTH;
}

Graphics.prototype.GetRenderHeight = function () {
        return DEFAULT_WINDOW_HEIGHT;
}

Graphics.prototype.DrawRotateFull = function (x, y, rtx, rty, angle, image, alpha) {
        var angleRadians = angle * Math.PI / 180.0;

        // move the origin of the canvas to where we want to draw our image
        this._canvasBufferContext.save();
        this._canvasBufferContext.globalAlpha = (alpha) ? alpha : 1.0;
        this._canvasBufferContext.translate(x, y);

        //move at the center of the image
        this._canvasBufferContext.translate(rtx, rty);

        //rotate around this point
        this._canvasBufferContext.rotate(angleRadians);

        //draw the image left and up
        this._canvasBufferContext.drawImage(image, -rtx, -rty);

        this._canvasBufferContext.restore();
}

Graphics.prototype.DrawRotate
    = function (image, sx, sy, sw, sh,
        dx, dy, dw, dh,
        alpha, rtx, rty, angle) {
            var angleRadians = angle * Math.PI / 180.0;

            // move the origin of the canvas to where we want to draw our image
            this._canvasBufferContext.save();
            this._canvasBufferContext.globalAlpha = (alpha) ? alpha : 1.0;
            this._canvasBufferContext.translate(dx, dy);

            //move at the center of the image
            this._canvasBufferContext.translate(rtx, rty);

            //rotate around this point
            this._canvasBufferContext.rotate(angleRadians);

            rtx = (rtx != 0) ? -rtx : 0;
            rty = (rty != 0) ? -rty : 0;

            //draw the image left and up
            this._canvasBufferContext.drawImage(image, sx, sy, sw, sh, rtx, rty, dw, dh);

            this._canvasBufferContext.restore();
    }
