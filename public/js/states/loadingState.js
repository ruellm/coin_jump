/**
    Loading state and screen
    Author: Ruell Magpayo <ruellm@yahoo.com>
    Created Dec 12, 2021
*/

function LoadingState() {
        this._stateID = LOADING_STATE_ID;
}

// set base class to State
LoadingState.prototype = new State;

LoadingState.prototype.Load = function ()
{
    // loop thru image list
    for (var idx = 0; idx < g_imageFileList.length; idx++) {
        new ImageResource().Load(g_imageFileList[idx]);
    }
}

LoadingState.prototype.Update = function (elapsed)
{
    if (this.loadedResource < this.resourceCount) return;

    // temporary
    var pct = (g_imageResourceList.length) / g_imageFileList.length;
    if(pct >= 1.0)
    {
        g_Engine.SetState(GAME_STATE_ID);
    }
}

LoadingState.prototype.Draw = function (gfx)
{
    // If images not yet loaded
    if (this.loadedResource < this.resourceCount) {
        return;
    }   
}


///////////////////////////////////////////////
// Destructor
///////////////////////////////////////////////
LoadingState.prototype.Unload = function () {
}

LoadingState.prototype.EventHandler = function (e) {
        this.EventHandlerBase(e);
}

