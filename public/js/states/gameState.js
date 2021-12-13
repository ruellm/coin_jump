/**
    Main Game State
    Author: Ruell Magpayo <ruellm@yahoo.com>
    Created Dec 12, 2021
*/

// Global variables
var handBoxList = null;
var ballList = null;
var tooClose = false;
var score = 0;
var particle = null;

var globalTimer = null;
var globalTimerLeft = 0.0;
var endGame = false;
var TOTAL_GAME_SECONDS = 60;

//////////////////////////////////////////
function boxCollide(rect1, rect2)
{
    return (rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.h + rect1.y > rect2.y);

}

//////////////////////////////////////////

function GameState() {
        this._stateID = GAME_STATE_ID;
        this.ResetValues();
}

// set base class to State
GameState.prototype = new State;

GameState.prototype.ResetValues = function ()
{
}

GameState.prototype.Load = function () {

        //initialize values
        this.ResetValues();

        // create UI element
        this._uimanager = new UIManager();

        this.video = document.querySelector('video');

        ballList = new Array();

        tooClose = false;

        score = 0;
        globalTimer = new Timer();
        globalTimer.Start();

        particle = new ImageObject();
        particle.Init("images/particle-purple.png", 0, 0);

}

function removeItem(item)
{
    for (var i = ballList.length - 1; i >= 0; i--) {
        if (ballList[i] = item) { 
            ballList.splice(i, 1);
            break
        }
    }
}

GameState.prototype.Update = function (elapsed) {

    globalTimer.Update();
    globalTimerLeft = Math.floor(TOTAL_GAME_SECONDS - globalTimer._elapsed);
    if(globalTimerLeft <= 0) {
        endGame = true;
        globalTimer.Stop();
    }

    var bunos_max = 3;
    var xallowed = 189;
  //  var xlimit = 637 - 120;
    var xrange = DEFAULT_WINDOW_WIDTH;

    var lack = bunos_max - ballList.length;
    for (var m = 0; !endGame && m < lack; m++) {
            var chance = Math.floor(Math.random() * 101);
            if (chance % 7 != 0) continue;

            var item = new JumpingItem;
            var xloc_index = Math.floor(Math.random() * xrange);                        
            var type =  type = Math.floor(Math.random() * BALLS_COUNT);;

            // set coordinate
            item._X = xallowed + xloc_index;

            //set type
            item.type = type;

            // Setup callbacks
            item.fnHitBase = (function () {
                    //remove the item from the list
                    removeItem(this);
            });

            item.fnExplodeDone = (function () {
                    
                score += this.score;
                //remove the item from the list
                // TODO: 
                // Animate the gem to disappear
                // during mouse event down
                // Animate to disapear and subscribe to 
                // animate done and tranfer the functionality
                // from this callback
                removeItem(this);

            });
            
            item.Load();
            item.Jump();

            ballList.push(item);
    }

    for (var i = 0; i < ballList.length; i++) {
        ballList[i].Update(elapsed);

        const ball = ballList[i];
        if(ball == null) break;

        var rect1 = {
            x: ball._X,
            y: ball._Y,
            w: ball._width,
            h: ball._height
        };

        // check if ball list is inside the hand bbox
        for(var j = 0; handBoxList && j <  handBoxList.length; j++) {
            const bbox = handBoxList[j];
        
            var rect2 = {
                x: bbox[0],
                y: bbox[1],
                w: bbox[2],
                h: bbox[2]
            };

             if(boxCollide(rect2, rect1)) {
                //hit
                ball.Hit();
                if(ball.type == 0) {
                    score += 2;
                }else{
                    score -= 1;
                    if(score <= 0)
                        score = 0;
                }
            }
        }
    }
}


GameState.prototype.Capture = function(context){
        context.save();
        context.translate(DEFAULT_WINDOW_WIDTH, 0);
        context.scale(-1, 1);
        context.drawImage(this.video, 0, 0);
        context.restore();
}

GameState.prototype.Draw = function (gfx) {

        var ctx = gfx._canvasBufferContext;
        this.Capture(ctx);

        var style = "Bold 20pt Arial";
        ctx.font = style;

        if(g_model != null)
        {
            g_model.detect(gfx._canvasBuffer).then((predictions) => {
              //  console.log("Predictions: ", predictions);
               
                if(predictions.length <= 0) return;

                handBoxList = new Array();

                for(var i = 0; i < predictions.length;i++) {
                        if(predictions[i].label == "face") continue;
                        handBoxList.push(predictions[i].bbox);
                }
            });
        }

        if(handBoxList != null){
                var far = false;
                for(var i = 0; i < handBoxList.length; i++) {
                    const bbox = handBoxList[i];
                    
                    var x  = (bbox[0] + bbox[2]/2) - (particle._width/2);
                    var y = (bbox[1] + bbox[3]/2) - (particle._height/2);
                    particle.Draw(gfx, x, y);

                    if(bbox[2] >= 200)
                        far = true;
                }
                
                if(tooClose != far)
                    tooClose = far;
        }        
        
        for (var i = 0; i < ballList.length; i++) {
            ballList[i].Draw(gfx);
        }

        if(tooClose) {
            var text = "Player is too close to camera";
            var textWidth = ctx.measureText(text);
       
            gfx.DrawText(text,
                   (DEFAULT_WINDOW_WIDTH / 2) - (textWidth.width / 2),
                    50,
                    "rgb(255,255,255)", style);

        }

    gfx.DrawText("Score : " + score,
        0,50,
        "rgb(255,255,255)", style);

    gfx.DrawText("Time : " + globalTimerLeft,
        DEFAULT_WINDOW_WIDTH - 150, 100,
        "rgb(255,255,255)", style);

    if(endGame) {
        var text = "Game Over";
        var textWidth = ctx.measureText(text);

        gfx.DrawText(text,
            (DEFAULT_WINDOW_WIDTH / 2) - (textWidth.width / 2),
            100,
            "rgb(255,255,255)", style);

    }
       
}

///////////////////////////////////////////////
// Destructor
///////////////////////////////////////////////
GameState.prototype.Unload = function () {

}


//
// Event handler callback
//
GameState.prototype.EventHandler = function (e) {

        ////////////////////////////////////////////////////////////////
        this.EventHandlerBase(e);

}
