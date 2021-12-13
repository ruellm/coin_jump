/**
    Animation interpolator class. Compute the animation frame based \
    on given FPS value
    @author <a href="mailto:ruellm@yahoo.com">Ruell Magpayo</a>
    @class
    Copyright (C) 2012 Salad Bowl Game Productions
*/
function Animator()
{
    // animation FPS
    this._fps = 0;

    // defines the frames per second of the animation
    this._timeBetweenFrames = 0;

    // time until the next frame
    this._timeSinceLastFrame = 0;


}

Animator.prototype.Set = function (/**Number*/fps)
{
    this._fps = fps;
    this._timeBetweenFrames = 1 / fps;
    this._timeSinceLastFrame = this._timeBetweenFrames;
}

Animator.prototype.Update = function (/**Number*/ elapsed)
{
    this._timeSinceLastFrame -= elapsed;
    if (this._timeSinceLastFrame <= 0) {
        this._timeSinceLastFrame = this._timeBetweenFrames;
        return true;
    }
    return false;
}