/**
    Scrollable repeating image
    Author: Ruell Magpayo <ruellm@yahoo.com>
    Created Oct 23, 2012
*/
function RepeatingImage() {

        this.scrollFactor = 1.0;
        this.scrollStep = 100;

        this.scrollX = 0;
        this.scrollY = 0;
}

RepeatingImage.prototype = new ImageObject;

RepeatingImage.prototype.Update = function (elapsed)
{
        this.scrollX += this.scrollStep * elapsed;
}

RepeatingImage.prototype.Draw = function (gfx,x,y) {
        var areaDrawn = [0, 0];

        for (var y = 0; y < this._image.height; y += areaDrawn[1]) {
                for (var x = 0; x < this._image.width; x += areaDrawn[0]) {
                        // the top left corner to start drawing the next tile from
                        var newPosition = [this._X + x, this._Y + y];
                        // the amount of space left in which to draw
                        var newFillArea = [this._image.width - x, this._image.height - y];
                        // the first time around you have to start drawing from the middle of the image
                        // subsequent tiles alwyas get drawn from the top or left
                        var newScrollPosition = [0, 0];
                        if (x == 0) newScrollPosition[0] = this.scrollX * this.scrollFactor;
                        if (y == 0) newScrollPosition[1] = this.scrollY * this.scrollFactor;

                        //clip the offsets
                        newScrollPosition[0] = Math.floor(newScrollPosition[0]);
                        newScrollPosition[1] = Math.floor(newScrollPosition[1]);

                        areaDrawn = this.DrawRepeat(gfx, newPosition, newFillArea, newScrollPosition);
                }
        }

}

RepeatingImage.prototype.DrawRepeat  = function(gfx, newPosition, newFillArea, newScrollPosition)
{
        // find where in our repeating texture to start drawing (the top left corner)
        var xOffset = Math.abs(newScrollPosition[0]) % this._image.width;
        var yOffset = Math.abs(newScrollPosition[1]) % this._image.height;

        var left = newScrollPosition[0] < 0 ? this._image.width - xOffset : xOffset;
        var top = newScrollPosition[1] < 0 ? this._image.height - yOffset : yOffset;

        var width = newFillArea[0] < this._image.width - left ? newFillArea[0] : this._image.width - left;
        var height = newFillArea[1] < this._image.height - top ? newFillArea[1] : this._image.height - top;
        
        // draw the image
         gfx.DrawImage(this._image, left, top, width, height, newPosition[0], newPosition[1], width, height);
      
        
        return [width, height];
}
