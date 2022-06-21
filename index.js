function getRandomInt (min, max) {
    min = Math.ceil (min);
    max = Math.floor (max);
    return Math.floor (Math.random () * (max - min)) + min;
}

class Game {
    constructor () {
	this.canvas = document.getElementById ("canvas");
	this.canvas.width = 640;
	this.canvas.height = 480;

	// Game related stuff.
	this.playing = true;
	
	this.penises = 0;
	this.pos = 0;

	this.goingLeft = false;
	this.goingRight = false;

	this.penis_x = getRandomInt (0, 640 - 128);
	this.penis_y = -128;

	// Resources
 	this.roastiepng = new Image();
	this.roastiepng.src = "woman.png";

 	this.penispng = new Image();
	this.penispng.src = "penis.png";

	this.overpng = new Image();
	this.overpng.src = "over.png";
	
	this.context = canvas.getContext ("2d", {
            alpha: false
	});

	this.lastTime = 0;
	this.deltaTime = 0;
	this.elapsedFrames = 0;

	// Events.
	document.addEventListener ("keydown", this.keydown.bind (this), false);
	document.addEventListener ("keyup", this.keyup.bind (this), false);

	this.seconds = 90;
	
	this.timeout = window.setInterval (this.updateClock.bind (this), 1000);
	
	this.request = requestAnimationFrame (this.loop.bind (this));
    }

    updateClock () {
	this.seconds = this.seconds - 1;
	document.getElementById ("time").innerText = "Time until you hit the wall: " + this.seconds + " seconds";
	if (this.seconds <= 0) {
	    this.playing = false;
	    window.clearTimeout (this.timeout);
	}
    }

    keydown (event) {
	if (event.keyCode == 37) {
	    this.goingLeft = true;
	} else if (event.keyCode == 39) {
	    this.goingRight = true;
	}
    }

    keyup (event) {
	if (event.keyCode == 37) {
	    this.goingLeft = false;
	} else if (event.keyCode == 39) {
	    this.goingRight = false;
	}
    }
    
    loop (timestamp) {
        this.update (timestamp);
        this.render ();
        this.request = requestAnimationFrame (this.loop.bind (this));
    }

    update (timestamp) {
        this.elapsedFrames++;
        this.deltaTime = (timestamp - this.lastTime);
        this.lastTime = timestamp;

	if (this.playing) {
	    
	    if (this.goingLeft == true) {
		this.pos -= 0.3 * this.deltaTime;
	    } else if (this.goingRight == true) {
		this.pos += 0.3 * this.deltaTime;
	    }

	    if (this.pos < 0) {
		this.pos = 0;
	    } else if (this.pos > 640 - 128) {
		this.pos = 640 - 128;
	    }

	    this.penis_y += 0.45 * this.deltaTime;

	    if (this.penis_y > 480) {
 		this.penis_y = -128;
		this.penis_x = getRandomInt (0, 640 - 128);
	    }

	    if (this.penis_x > this.pos - 128 && this.penis_x < this.pos + 128 &&
		this.penis_y > 640 - 384) {
 		this.penis_y = -128;
		this.penis_x = getRandomInt (0, 640 - 128);
		this.penises += 1;

		document.getElementById ("penises").innerText = "Penises: " + this.penises;
	    }

	}
    }

    render () {
        this.context.fillStyle = "teal";
        this.context.fillRect (0, 0, this.canvas.width, this.canvas.height);

	this.context.drawImage (this.roastiepng, this.pos, 480 - 128);
	this.context.drawImage (this.penispng, this.penis_x, this.penis_y);

	if (!this.playing) {
	    this.context.drawImage (this.overpng, 0, 0);
	}
    }
}

var game = new Game ();
