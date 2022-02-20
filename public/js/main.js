//
// Main Javascript source file
// Author: Ruell Magpayo <ruellm@yahoo.com>
// Created Sept 03, 2012
// 
// This HTML5 game engine for TitaysGame project was based/adopted  
// from Stuck In A Nightmare HTML5 game engine c/o Ruell Magpayo
//

//
// Game Engine entry point
//
function _main() {
        //create engine object
        g_Engine = new Engine();
        g_gameData = new GameData();

        //Initialize engine
        g_Engine.Init();
        
        
        //Add States
        g_Engine.AddState(new GameState);
        g_Engine.AddState(new LoadingState);
        //... Add more states if needed

        //Set initial state
        g_Engine.SetState(LOADING_STATE_ID);

        //Run the Engine
        g_Engine.Run();

}

//////////////////////////////////////////////////////////

// The entry point of the application is set to the init function
window.onload = _main;

let video = document.querySelector('video');
navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia || navigator.msgGetUserMedia);
    
if(navigator.getUserMedia) {
        navigator.mediaDevices.getUserMedia({video: {width: DEFAULT_WINDOW_WIDTH, height: DEFAULT_WINDOW_HEIGHT}}
        ).then((stream) => video.srcObject = stream);
}

// initialize handtrack ML module
const modelParams = {
        flipHorizontal: false, // flip e.g for video
        maxNumBoxes: 20, // maximum number of boxes to detect
        iouThreshold: 0.5, // ioU threshold for non-max suppression
        scoreThreshold: 0.6, // confidence threshold for predictions.
};
