/**
    Animate images list
    Author: Ruell Magpayo <ruellm@yahoo.com>
    Created Oct 01, 2012
*/

function AnimatedImages()
{
        this.imageList = new Array();
        this.index = 0;

        this.animatorCoin = new Animator();
        this.animatorCoin.Set(10);
        this.animation = false;
}

AnimatedImages.prototype = new ImageObject;

AnimatedImages.prototype.Add=function(str,x,y)
{
        var r = new ImageObject();
        r.Load(str);
        r._X = x;
        r._Y = y;
        this.imageList.push(r);
}

AnimatedImages.prototype.Reset = function ()
{
        this.index = 0;
        this.animation = false;
}

AnimatedImages.prototype.Update = function (elapsed)
{
        if (this.animatorCoin.Update(elapsed) && this.animation) {
                this.index = (this.index + 1) % this.imageList.length;
        }
}

AnimatedImages.prototype.Draw = function (gfx, x, y)
{
        this.imageList[this.index].Draw(gfx);
}