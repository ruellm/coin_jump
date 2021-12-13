/**
    The class for the object that appear in the game.
    Author: Ruell Magpayo <ruellm@yahoo.com>
    Created Oct 01, 2012
*/
function ImageObject() {
        // The Image object
        this._image = null;

        //the image alpha value
        this._alpha = 1.0;

        this._width = 0;
        this._height = 0;
}

ImageObject.prototype = new BaseObject;

ImageObject.prototype.Init =
    function (/**String*/ path, /**Number*/ x, /**Number*/ y) {
            this._X = x;
            this._Y = y;
            this.Load(path);

            this._width = this._image.width;
            this._height = this._image.height;
    }

ImageObject.prototype.Load = function (szPath) {
        this._image = GetImageResource(szPath);
        this._bLoaded = true;
}

ImageObject.prototype.Update = function (/**Number*/elapsed) {
        // ...
}

ImageObject.prototype.Draw = function (/**Graphics*/gfx, x, y) {
        var XOff = this._X;
        var YOff = this._Y;

        if (!this._visible) return;
	if(this._image == null) return;
	
        if (x) { XOff = x; }
        if (y) { YOff = y; }

        gfx.DrawImage(this._image, 0, 0, this._image.width, this._image.height,
            XOff, YOff, this._image.width, this._image.height, this._alpha);
}

ImageObject.prototype.DrawRect = function (/**Graphics*/gfx,
        /**Number*/ sx, /**Number*/ sy, /**Number*/sw, /**Number*/sh,
        /**Number*/dx, /**Number*/dy, /**Number*/dw, /**Number*/dh) {
        gfx.Draw(this._image, sx, sy, sw, sh,
            dx, dy, dw, dh, this._alpha);
}

/////////////////////////////////////////////////////////////////////
// Destructors
/////////////////////////////////////////////////////////////////////

ImageObject.prototype.BaseDestroy = function () {
        // objects destructor
        if (this._image != null) {
                delete this._image;
                this._image = null;
        }
}

ImageObject.prototype.Destroy = function () {
        this.BaseDestroy();
}