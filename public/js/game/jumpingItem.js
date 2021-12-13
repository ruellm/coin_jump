var JUMP_HEIGHT = 600;
function JumpingItem()
{
        //
        // From Canvas Demo
        // credited to: Matthew Casperson<matthewcasperson@gmail.com>
        //

        this.jumpHeight = JUMP_HEIGHT;
        /** The constant or half PI
            @type Number
         */
        this.halfPI = Math.PI / 2;
        /** The amount of time to spend in the air when jumping
            @type Number
         */
        this.jumpHangTime = 1.0;
        /** The speed to progress alone the sine wave that defines
            the jumping arc
            @type Number
         */
        this.jumpSinWaveSpeed = this.halfPI / this.jumpHangTime;

        /** The current position on the sine wave that defines the jump arc
            @type Number
         */
        this.jumpSinWavePos = 0;
        /** The rate to fall at
            @type Number
         */
        this.fallMultiplyer = 1.5;

        this.grounded = true;

        ///////////////////////////////
        //TODO: Set Base Y!!! 
        //Y =  600 --> Outside of the screens
        this._baseY = 600;
        this._Y = this._baseY;
        //////////////////////////////

        this.type = 0;
        this.fnHitBase = null;

        //HAck solution!
        this.didjump = false;
        this._width = 50;
        this._height = 50;

        this.dead = false;
        this.spriteList = new Array();
        this.spriteIdx = 0;

        this.fnExplodeDone = null;
        this.score = 0;
        this.alpha = 1.0;
        this.alive = true;
        this.cx = 0;
}

JumpingItem.prototype = new UIBase;

JumpingItem.prototype.Load = function ()
{
        if(this.type == 0){
            var idle = new AnimatedObject();
            idle.Load("images/coin_spin.png");

            idle.Set(16, 24.0, true);
            idle._frameWidth = 30;    
            
            this.spriteList.push(idle);
            this.spriteList.push(idle);
        }else{
            var idle = new ImageObject();
            idle.Load("images/bomb.png");
        
            this.explode = new AnimatedObject();
            this.explode.Load("images/bomb-explode.png");    
            this.explode.Set(7, 20.0, false);
            this.explode._frameWidth = 40;    

            this.spriteList.push(idle);
            this.spriteList.push(this.explode);
        }
        

        // The score per Gem
        var scorelist = [2, -1];
        this.score = scorelist[this.type];
}

JumpingItem.prototype.Update = function (elapsed)
{
        this.JumpUpdate(elapsed);
        if (this.spriteIdx == 1) {
                if (this.alpha > 0) { 
                        var RESZ_STEP = 1000;
                        var ALPHA_STEP = 10;

                        if(this.type == 1) {
                            RESZ_STEP = 1500;
                            ALPHA_STEP = 8;
                        }

                        this.alpha = this.alpha - (ALPHA_STEP * elapsed);
                        this._width = this._width + (RESZ_STEP * elapsed);
                        this._height = this._height + (RESZ_STEP * elapsed);
                } else {
                        this.alpha = 0;
                        this.alive = false;
                         if (this.fnExplodeDone &&  (this.type == 1 && this.explode._done))
                            this.fnExplodeDone();
                }
        }else{
            this.cx = this._X += this._width/2;
        }


        this.spriteList[this.spriteIdx]._alpha = this.alpha;
        this.spriteList[this.spriteIdx].Update(elapsed);
}

JumpingItem.prototype.Hit = function ()
{
    this.spriteIdx = 1;
}

JumpingItem.prototype.Draw = function (gfx)
{
    this._X = this.cx - (this._width/2);
    this.spriteList[this.spriteIdx].Draw(gfx, this._X + diff,
            this._Y + diff, this._width, this._height);

    if(this.spriteIdx == 1) {
        if(this.type == 0)
        {
            var style = "Bold 40pt Arial";
            gfx.DrawText("+2",
                this.cx - 10, this._Y,
                "rgb(255,255,255)", style);
        
        } else {
            var style = "Bold 40pt Arial";
            gfx.DrawText("-1",
                this.cx -10, this._Y,
                "rgb(255,0,0)", style);
        }
    }
}

JumpingItem.prototype.JumpUpdate = function (/**Number*/ elapsed) {
        if (!this.grounded) {
                // the last position on the sine wave
                var lastHeight = this.jumpSinWavePos;

                // the new position on the sine wave
                this.jumpSinWavePos += this.jumpSinWaveSpeed * elapsed;

                // we have fallen off the bottom of the sine wave, so continue falling
                // at a predetermined speed
                if (this.jumpSinWavePos >= Math.PI) {
                        this._Y += this.jumpHeight / this.jumpHangTime * this.fallMultiplyer * elapsed;

                        // otherwise move along the sine wave
                        //this._isFalling = true;
                }
                else {
                        this._Y -= (Math.sin(this.jumpSinWavePos) - Math.sin(lastHeight)) * this.jumpHeight;
                }

        }

        // we have hit the ground
        if (this.IsGround()) {
                this.grounded = true;
                this.jumpSinWavePos = 0;
                this._Y = this._baseY;
                // this._isFalling = false;

                if (this.fnHitBase != null && this.didjump) {
                        this.fnHitBase();
                }
        }
                // otherwise we are falling
        else if (this.grounded) {
                this.grounded = false;
                // starting falling down the sine wave (i.e. from the top)
                this.jumpSinWavePos = this.halfPI;
                //this._isFalling = false;
        }
}

JumpingItem.prototype.Jump = function (/**Number*/amt) {
        if (this.IsGround()) {
                //this._bUpdateY = true;
                this.grounded = false;
                this.jumpSinWavePos = 0;

                this.didjump = true;

                // disabled for now
                //g_soundBank[SOUND_BANK_ID_SWAP].Play();

        }
}

JumpingItem.prototype.IsGround = function () {
        if (this._Y < this._baseY)
                return false;
        return true;
}