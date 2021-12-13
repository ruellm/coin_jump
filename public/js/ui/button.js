/**
    Button UI class. Can also serves as the base class for all buttons
    Author: Ruell Magpayo <ruellm@yahoo.com>
    Created Oct 01, 2012
*/

function Button() {
        this._currentImg = null;
        this._highLightImg = null;
        this._idleImg = null;
        this._clickdImg = null;

        this._disableImg = null;
        this.clickAudio = null;
}

Button.prototype = new UIBase;

Button.prototype.LoadImages = function (idle, highlight, clicked, disable) {
        if (idle) {
                this._idleImg = new ImageObject;
                this._idleImg.Load(idle);
                this._currentImg = this._idleImg;
        }
        if (highlight) {
                this._highLightImg = new ImageObject;
                this._highLightImg.Load(highlight);
        }
        if (clicked) {
                this._clickdImg = new ImageObject;
                this._clickdImg.Load(clicked);
        }

        if (disable) {
                this._disableImg = new ImageObject;
                this._disableImg.Load(disable);
        }

        /////////////////////////////////////
        // Load Audio
        this.clickAudio = GetAudioResource("click_on_buttons", 0.3);
}

Button.prototype.SetEnable = function (val) {
        if (!val && this._disableImg != null) {
                this._currentImg = this._disableImg;
        } else {
                this._currentImg = this._idleImg;
        }
}

Button.prototype.OnMouseDown = function (x, y) {
        if (this._clickdImg) {
                this._currentImg = this._clickdImg;
        }

        // Play Audio
        if (this.clickAudio != null) {
                this.clickAudio.play();
        }

        if (this._fnMouseDownEvnt) {
                this._fnMouseDownEvnt();
        }
}

Button.prototype.Select = function () {
        if (this._highLightImg) {
                this._currentImg = this._highLightImg;
        }
}

Button.prototype.UnSelect = function () {
        if (this._idleImg) {
                this._currentImg = this._idleImg;
        }
}

Button.prototype.Draw = function (gfx) {
        if (this._currentImg && this._currentImg.IsLoaded()) {
                gfx.DrawImageFull(this._currentImg._image, this._X, this._Y);
        }
}

Button.prototype.Destroy = function () {

        if (this._highLightImg) {
                this._highLightImg.Destroy();
                delete this._highLightImg;
                this._highLightImg = null;
        }
        if (this._idleImg) {
                this._idleImg.Destroy();
                delete this._idleImg;
                this._idleImg = null;
        }
        if (this._clickdImg) {
                this._clickdImg.Destroy();
                delete this._clickdImg;
                this._clickdImg = null;
        }
}
