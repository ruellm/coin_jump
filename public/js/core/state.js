/**
    Base class for Application state. This must be inherited.
    Author: Ruell Magpayo <ruellm@yahoo.com>
    Created Sept 03, 2012

    Note: Each class inheriting from State should be assumed and must be
    treated as a singleton class
*/
function State() {
        // State ID 
        this._stateID = DEFAULT_ID;

        // must be created during Load() of inherited class
        // base state will cleanup UIManager.
        this._uimanager = null;
}

State.prototype.Load = function ()
{   /* Intentionaly Blank */ }

State.prototype.Update = function (/**Number*/ elapsed)
{    /* Intentionaly Blank */ }

State.prototype.Draw = function (/**Graphics*/ gfx)
{ /* Intentionaly Blank */ }

State.prototype.CleanupUIManager = function () {
        if (this._uimanager) {
                this._uimanager.Destroy();
                delete this._uimanager;
                this._uimanager = null;
        }
}

///////////////////////////////////////////////
// Destructor
///////////////////////////////////////////////
State.prototype.Unload = function () {
        this.CleanupUIManager();
}

State.prototype.EventHandler = function (/**Event*/e)
{
        this.EventHandlerBase(e);
}


/////////////////////////////////////////////////////////////////////////
// !!TEMPORARY!!
// must be transfered to a separate utility file
/////////////////////////////////////////////////////////////////////////
function NormalizeMouse(event)
{
	//if(!event.offsetX) {
        if (typeof event.offsetX == "undefined") {
		var element = document.getElementById(GAME_CANVAS_ID);
		event.offsetX = (event.pageX - element.offsetLeft);
		event.offsetY = (event.pageY - element.offsetTop);		
		//event.offsetX = event.clientX;
		//event.offsetY = event.clientY;
        }

        //////////////////////////////
        // Hack solution!!!
        var browser = BrowserVersion();
        if (browser[0] == "firefox") {
                var position = getPosition(event);
                event.offsetX = position.x;
                event.offsetY = position.y;
        }

    return event;
}

function GetTarget(e)
{
        var targ;
        if (!e)
                e = window.event;
        if (e.target)
                targ = e.target;
        else if (e.srcElement)
                targ = e.srcElement;
        if (targ.nodeType == 3) // defeat Safari bug
                targ = targ.parentNode;

        return targ;
}

function NormalizeTouch(e) {

        var element = document.getElementById(GAME_CANVAS_ID);
        var targ = GetTarget(e);
        event.offsetX = e.targetTouches[0].pageX - $(targ).offset().left; //- element.offsetLeft;
        event.offsetY = e.targetTouches[0].pageY - $(targ).offset().top;// - element.offsetTop;
       return event;
}


function getPosition(e) {

        var targ = GetTarget(e);

        // jQuery normalizes the pageX and pageY
        // pageX,Y are the mouse positions relative to the document
        // offset() returns the position of the element relative to the document
        var x = e.pageX - $(targ).offset().left;
        var y = e.pageY - $(targ).offset().top;

        return { "x": x, "y": y };
}


State.prototype.EventHandlerBase = function (e) {

        var element = document.getElementById(GAME_CANVAS_ID);
        var factorX = 1;
        var factorY = 1;
        var defaultPtrID = 0;

        if (e.type == "mousedown" || 
                e.type == "touchstart") {

                if (e.type == "mousedown") {
                        NormalizeMouse(e);
                } else if (e.type == "touchstart") {
                        NormalizeTouch(e);
                }
              
                var xoffset = e.offsetX * factorX;
                var yoffset = e.offsetY * factorY;

                if (this._uimanager) {
                        this._uimanager.OnMouseDown(xoffset, yoffset, defaultPtrID/*e.pointerId*/);
                }

        }
        else if (e.type == "mousemove" ||
                e.type == "touchmove") {
                //update all the UI
                if (e.type == "mousemove") {
                        NormalizeMouse(e);
                } else if (e.type == "touchmove") {
                        e.preventDefault();
                        NormalizeTouch(e);
                }
                var xoffset = e.offsetX * factorX;
                var yoffset = e.offsetY * factorY;

                if (this._uimanager) {
                        this._uimanager.OnMouseMove(xoffset, yoffset);
                }
        }
        else if (e.type == "mouseup" ||e.type == "touchend") {

                if (e.type == "mouseup") {
                        NormalizeMouse(e);
                } else if (e.type == "touchend") {
                        NormalizeTouch(e);
                }
                var xoffset = e.offsetX * factorX;
                var yoffset = e.offsetY * factorY;
                if (this._uimanager) {
                        this._uimanager.OnMouseUp(xoffset, yoffset, defaultPtrID/*e.pointerId*/);
                }
        }
}
