//
// Global definition of Resources used in the game
// Author: Ruell Magpayo <ruellm@yahoo.com>
// Created October 08, 2012
//

//
/////////////////////////////////////////////////////////////////////////////////////
// Image Resource filenames
//

function ImageResource() {
        this.image = null;
        this.path = null;
        this.load = false;

        this.Load = function( szPath){
                this.image = new Image();
                this.image.src = szPath;
                this.path = szPath;
                var context = this;

                this.image.onload = (function () {
                        context.load = true;
                        g_imageResourceList.push(context);
                });
                this.image.onerror = (function () {
                        g_errorImageList.push(context);
                });
        }

        this.Reload = function () {
                this.image = null;
                this.Load(this.path);
        }
}

// Image Resource global lists
g_imageResourceList = new Array();

// Image filename list
g_imageFileList =
    [
        "images/coin_spin.png",      

        "images/bomb.png",
        "images/bomb-explode.png",
        "images/particle-purple.png"
    ];

// count image loaded error
var g_errorImageList = new Array();
var RETRY_MAX = 3;
var g_retryCount = 0;

//
// helper functions
//
function GetImageResource(szPath)
{
        var image = null;
        for (var idx = 0; idx < g_imageResourceList.length; idx++) {
                if (g_imageResourceList[idx].path == szPath) {
                        image = g_imageResourceList[idx].image;
                        break;
                }
        }
        return image;
}

var SECONDRES_FLAG = false;
function LoadNextResources()
{
        var secondbatch = [						
                // Empty
        ];

        for (var r = 0; r < secondbatch.length; r++) {
                //g_imageFileList.push(secondbatch[r]);
                new ImageResource().Load(secondbatch[r]);
        }

        var audiolist = ["celebration_sound_for_high_score",
                        "every_after_game",
                        "clock_loop"];

        for (var idx = 0; idx < audiolist.length; idx++) {
                new AudioResource().Load(
                        GetAudPath(audiolist[idx])
                        );
        }
}

//////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////
// Audio Resource
//
//  Audio resources are divided into two categories
// WAV and MP3
// See audio support http://www.w3schools.com/html/html5_audio.asp
// HTML5 audio issue 
// http://flowz.com/2011/03/apple-disabled-audiovideo-playback-in-html5/
// http://developer.apple.com/library/safari/#documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html
//

// Image Resource global lists
g_audioResourceList = new Array();

g_audioFileList = [
       
];


function AudioResource() {
        this.audio = null;
        this.path = null;
        this.loaded = false;
        this.volume = 1.0;
	
        this.Load = function (szPath) {               
                var context = this;

                this.audio = buildAudio(szPath);
                if (this.audio == null) return;

                this.audio.addEventListener("canplay", function () {
                        context.loaded = true;
                });

                g_audioResourceList.push(context);
                this.path = szPath;
        }
}

function buildAudio(path)
{        
        // Disable audio for Apple devices
        if (isMobileSafari()) {
                return null;
        }

        var audio = document.createElement("audio");
        if (audio != null && audio.canPlayType) {
                audio.src = path;
                audio.preload = "auto";
                audio.load();
        }

        return audio;
}

function GetAudioResource(szPath,vol) {
        var audio = null;
        if (!szPath || 0 === szPath.length) return null;
        for (var idx = 0; idx < g_audioResourceList.length; idx++) {
                if (g_audioResourceList[idx].path.indexOf(szPath) != -1) {
                        if (g_audioResourceList[idx].loaded) {
                                audio = g_audioResourceList[idx].audio;

                                if (vol) {
                                        g_audioResourceList[idx].volume = vol;
                                }

                                if (VOLUME_FLAG) {
                                        audio.volume = g_audioResourceList[idx].volume;
                                } else {
                                        audio.volume = 0;
                                }
                        }
                        break;
                }
        }
   

        return audio;
}

var SOUND_BANK_COUNT = 2;
var SOUND_BANK_ID_SWAP = 0;
var SOUND_BANK_ID_PACKED = 1;
var VOLUME_FLAG = true;

function SoundBank()
{
        this.bank = new Array();
        this.currentIdx = 0;

        this.Build = function (count, id) {

                var audiopath = GetAudPath(id)
                for (var i = 0; i < count; i++) {
                        var aud = buildAudio(audiopath);
                        if (aud == null) return;
                        this.bank.push(aud);
                }
        }

        this.Play = function ()
        {
                if (this.bank.length <= 0) return;
                if (this.bank[this.currentIdx].ended)
                        this.bank[this.currentIdx].currentTime = 0;

                this.bank[this.currentIdx].play();
                this.currentIdx = (this.currentIdx + 1) % this.bank.length;
        }
}


var g_soundBank = new Array(SOUND_BANK_COUNT);
function InitSoundBank()
{
        ///////////////////////////////////////////////////////
        // create sound bank
        g_soundBank[SOUND_BANK_ID_SWAP] = new SoundBank();
        g_soundBank[SOUND_BANK_ID_SWAP].Build(3, "swap");

        g_soundBank[SOUND_BANK_ID_PACKED] = new SoundBank();
        g_soundBank[SOUND_BANK_ID_PACKED].Build(3,"packed_score_points_R2");
        ///////////////////////////////////////////////////////
}

function LoadAudio()
{      
        for (var idx = 0; idx < g_audioFileList.length; idx++) {
                new AudioResource().Load(
                        GetAudPath(g_audioFileList[idx])
                        );
        }        
}

function GetAudPath(audId)
{
        var browser = BrowserVersion();
        var path = "mp3";
        if (browser[0] == "firefox" || browser[0] == "opera") {
                path = "ogg";
        }

        return ("sounds/" + path + "/" + audId + "." + path);
}


function UpdateAudio(flag)
{
	//silent all the audio resource
	for (var idx = 0; idx < g_audioResourceList.length; idx++) {
	        if (flag == false) {
			//g_audioResourceList[idx].volume = g_audioResourceList[idx].audio.volume;
			g_audioResourceList[idx].audio.volume = 0;
		}else{
			g_audioResourceList[idx].audio.volume = g_audioResourceList[idx].volume;
		}
	
	}

	//silent the sound bank
	for (var idx = 0; idx < g_soundBank.length; idx++) {
		for(var s=0;s < g_soundBank[idx].bank.length;s++){
		        if (flag == false) g_soundBank[idx].bank[s].volume = 0;
			else	g_soundBank[idx].bank[s].volume = 1;
		}
	}
	VOLUME_FLAG = flag;
}

/////////////////////////////////////////////////////////////////////////////////////