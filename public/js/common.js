//
// Global definitions file
// Author: Ruell Magpayo <ruellm@yahoo.com>
// Created Sept 03, 2012
//

// Game Target Frame per second
var FPS = 60;

// time between frames 
var SECONDS_BETWEEN_FRAMES = 1 / FPS;

// State default invalid ID     
var DEFAULT_ID = -1;

// The name of the canvas object in HTML     
var GAME_CANVAS_ID = "game_canvas";

// The Game engine Object     
var g_Engine = null;
var g_gameData = null;

// the canvas/window dimension
var DEFAULT_WINDOW_WIDTH = 1138;
var DEFAULT_WINDOW_HEIGHT = 640;

// State ID definitions
var GAME_STATE_ID = 101;
var LOADING_STATE_ID = 103;

var BALLS_COUNT = 2;

// hand track model
var g_model = null;

function BrowserVersion() {
        var N = navigator.appName, ua = navigator.userAgent, tem;
        var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
        if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
        M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];

        //normalize browser name
        M[0] = M[0].toLowerCase();
        return M;
}

// Test mobile safari
function isMobileSafari() {
        return navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/)
}
