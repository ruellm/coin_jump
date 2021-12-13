/**
    Timer helper class. 
    Triggers callback every N millesconds.
    Author: Ruell Magpayo <ruellm@yahoo.com>

*/

function Timer() {
        this._startTime = 0;
        this._fbCallBack = null;
        this._timeTrigger = 0; //in milliseconds
        this._elapsed = 0;  //in seconds
        this._isRunning = false;

        //for time tick callback
        this._tickTrigger = 0;  //in milleseconds
        this._tickCache = 0;
        this._fbTickCallBack = null;

        //for pause implementation
        this.cachedTime = 0;

}

Timer.prototype.Start = function () {
        this._startTime = new Date().getTime();
        this._isRunning = true;
}

Timer.prototype.Stop = function () {
        this._isRunning = false;
}

Timer.prototype.Pause = function ()
{
        this._isRunning = false;
        this.cachedTime = this._elapsed;
}

Timer.prototype.Resume = function () {
        if (this._isRunning == true) return;
        this.Start();
}
Timer.prototype.Update = function () {

        if (!this._isRunning) return;
        var currTime = new Date().getTime();
        this._elapsed = (currTime - this._startTime) / 1000;
        this._elapsed += this.cachedTime;
}