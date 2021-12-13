/**
    The base class for almost all class in the engine.
    Author: Ruell Magpayo <ruellm@yahoo.com>
    Created: Oct 01, 2012
*/

function BaseObject() {
        // object ID
        this._objectID = DEFAULT_ID;

        // Coordinates variable
        this._X = 0;
        this._Y = 0;

        // dimension
        this._width = 0;
        this._height = 0;

        // visibility flag
        this._visible = true;

        //
        // For resource handling
        //
        this._bLoaded = false;
        // this._resourceCnt  = 0;
        // this._loadedResCnt = 0;
}

BaseObject.prototype.Load = function () {
        // Do the loading of the resources(images,etc) in here
}

BaseObject.prototype.Update = function (elapsed)
{ /* Intentionaly Blank */ }

BaseObject.prototype.Draw = function (/**Graphics*/ gfx, x, y)
{ /* Intentionaly Blank */ }

BaseObject.prototype.IsLoaded = function () {
        return this._bLoaded;
}

BaseObject.prototype.Destroy = function () {
        // objects destructor
}

//
// For resource loading
//
BaseObject.prototype.GetResourceCnt = function () {
        return 0;
}

BaseObject.prototype.GetLoadedResourceCnt = function () {
        return 0;
}