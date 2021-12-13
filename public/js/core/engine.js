/**
    The Engine class handles the core processing and state handling.
    Author: Ruell Magpayo <ruellm@yahoo.com>
    Created Sept 03, 2012
    Revived for Livehive AR games: Dec 12, 2021
    - Disabled double buffering
*/

function Engine() {
        // The current state
        this._currentState = null;

        // State Lists        
        this._stateList = new Array();

        // The time that the last frame was rendered  
        this._lastFrame = new Date().getTime();

        //  Create Graphics object
        this._graphics = new Graphics();

        //initialize Gfx Object
        this._graphics.Init();

}

Engine.prototype.Init = function () {
        // setup the key events
        var browser = BrowserVersion();
        var msie = browser[1];

        if (browser[0] == "msie" && (msie > 0 && msie <= 9)) {
                document.attachEvent('onkeydown', this.EventHandler, false);
                document.attachEvent('onkeyup', this.EventHandler, false);
                document.attachEvent('onmousedown', this.EventHandler, false);
                document.attachEvent('onmouseup', this.EventHandler, false);
                document.attachEvent('onmousemove', this.EventHandler, false);
        } else {
                document.addEventListener('keydown', this.EventHandler, false);
                document.addEventListener('keyup', this.EventHandler, false);
                document.addEventListener('mousedown', this.EventHandler, false);
                document.addEventListener('mouseup', this.EventHandler, false);
                document.addEventListener('mousemove', this.EventHandler, false);

                // add the touch event
                var canvas = document.getElementById(GAME_CANVAS_ID);
                canvas.addEventListener('touchstart', this.EventHandler, false);
                canvas.addEventListener('touchmove', this.EventHandler, false);
                canvas.addEventListener('touchend', this.EventHandler, false);
        }
}

Engine.prototype.Run = function () {
        // Set gameloop
       // setInterval(function () { g_Engine.GameLoop(); },
         //   SECONDS_BETWEEN_FRAMES);			

        //Optimized Rendering Loop
        this.QueueNewFrame();
}

//
// For state transition effects 
// Added Aug 8, 2012
//
// TODO: Cleanup, do not make this global
// ..
var nextState = null;
var transition = 0;         //0 none, 1 fade out 2, fade in
var global_alpha = 1.0;
var diff = 3.0;             // spped of fade will depend on the speed of background music

Engine.prototype.GameLoop = function () {
        //compute frame elapsed
        var thisFrame = new Date().getTime();
        var elapsed = (thisFrame - this._lastFrame) / 1000.0;
        this._lastFrame = thisFrame;

        // check if there is current state
        if (this._currentState == null)
                return;

        // Update the current state
        this._currentState.Update(elapsed);

        // clear the back buffers
        this._graphics.Clear();

        //--------------------------------------------
        // for state transition
        //     
        if (transition != 0) {
                if (transition == 1) {
                        global_alpha -= (diff * elapsed);
                        if (global_alpha < 0) {
                                transition = 2;
                                global_alpha = 0;

                                // Unload the previous state before loading 
                                // the new state
                                if (this._currentState != null) {
                                        g_Engine._currentState.Unload();
                                }

                                this._currentState = nextState;
                                g_Engine._currentState.Load();

                        }
                } else if (transition == 2) {
                        global_alpha += (diff * elapsed);
                        if (global_alpha >= 1.0) {
                                transition = 0;
                                global_alpha = 1.0;
                        }
                }
        }
        //--------------------------------------------

        // draw the current state       
        this._currentState.Draw(this._graphics);

        // flip the buffers/draw to main canvas
        // added 08/08/2012 -- global alpha value
        this._graphics._canvasContext.save();
        this._graphics._canvasContext.globalAlpha = global_alpha;
        this._graphics.Flip();
        this._graphics._canvasContext.restore();
}


Engine.prototype.AddState = function (/**State*/ state) {
        //add the new state to list
        this._stateList.push(state);
}

Engine.prototype.SetState = function (/**Number*/stateID) {
        for (var i = 0; i < this._stateList.length; i++) {
                if (this._stateList[i]._stateID == stateID) {

                        if (this._currentState == null) {
                                this._currentState = this._stateList[i];
                                g_Engine._currentState.Load();
                                nextState = this._currentState;
                        } else {
                                nextState = this._stateList[i];
                                transition = 1;
                        }

                        break;
                }
        }
}

//
// Optimized rendering loop
//
var intervalID = -1;
function renderingLoop() {
        g_Engine.GameLoop();
        g_Engine.QueueNewFrame();
}

Engine.prototype.QueueNewFrame = function () {
        if (window.requestAnimationFrame)
                window.requestAnimationFrame(renderingLoop);
        else if (window.msRequestAnimationFrame)
                window.msRequestAnimationFrame(renderingLoop);
        else if (window.webkitRequestAnimationFrame)
                window.webkitRequestAnimationFrame(renderingLoop);
        else if (window.mozRequestAnimationFrame)
                window.mozRequestAnimationFrame(renderingLoop);
        else if (window.oRequestAnimationFrame)
                window.oRequestAnimationFrame(renderingLoop);
        else {
                QueueNewFrame = function () {
                };
                intervalID = window.setInterval(renderingLoop, SECONDS_BETWEEN_FRAMES);
        }
};

//
// Event handler design is similar to WindProc
//
Engine.prototype.EventHandler = function (/**Event*/e) {
        if (g_Engine._currentState == null) {
                return;
        }
        g_Engine._currentState.EventHandler(e);
}