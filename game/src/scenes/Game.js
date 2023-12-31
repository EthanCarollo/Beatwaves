let glitch
let timeGlitched = 0
let gameStartDelay = 5000
let melodyOne
let melodyOther
let handLifeTime = 25;
let minusLifeTime = 0.75;
let heartIsBroken = false;

/**
 * This is the Game scene played when we launch a game
 */
function Game() {
    let sceneIsLoaded = false;
    let handPoseHistory = {
        "right": [],
        "left": []

    }


    // enter() will be executed each time the SceneManager switches
    // to this Scene
    this.enter = () => {
        touched = 0;
        // Reset the player life to 5
        playerLife = 5
        initializeCenterOfWindow()
        frameRate(30)
        this.launchDecount()
        gameEnd = false;
        glitch = new Glitch();
        glitch.pixelate(1);
        this.sceneLoaded()
    }

    this.launchDecount = () => {
        document.getElementById("game-start-decount").style.display = "flex";
        document.getElementById("game-start-decount").style.opacity = "80%";

        let countNumber = 5
        // This show the count progressively according to the game start delay
        for (let i = 1; i <= countNumber; i++) {
            setTimeout(() => {
                document.getElementById("counter-text").innerHTML = countNumber - i
                if (i === countNumber) {
                    console.log("start animation")
                    anime({
                        targets: "#game-start-decount",
                        opacity: 0,
                        easing: 'easeInOutQuad'
                    })
                }
            }, gameStartDelay / countNumber * (i - 1));
        }

        setTimeout(() => {
            // Do it at the end of the timer
            document.getElementById("game-start-decount").style.display = "none";
        }, gameStartDelay);


    }

    // draw() is the normal draw function, this function work like a scene
    this.draw = () => {

        // this scene needs to be loaded if we want to draw in
        if (sceneIsLoaded === false) return;
        background(255,255,255,80)
        showLifeOfPlayer()

        if(playerLife <= 0){
            gameEnd = true;
        }
        this.showScene()
        this.registerHandPosition()
        // Show Key on map
        mooveKeyOnMap()
        showKeyOnMap()
        showHandTrail(handPoseHistory.right, "right")
        showHandTrail(handPoseHistory.left, "left")
        // Check every hands of the history
        this.checkHand(handPoseHistory.right)
        this.checkHand(handPoseHistory.left)
        showLifeOfPlayer()

        if (DEBUGMODE === true) {
            this.debugScene()
        } 
        if (gameEnd === true) {
            if (DEBUGMODE === true) {
                console.log("GAME IS FINISH ! --->")
            }
            this.goNextScene()
        }
        this.drawHeart();
    }

    this.debugScene=()=>{
        rect(100,100,150,100)
        if(mouseIsPressed === true && mouseX > 100 && mouseX < 250 && mouseY > 100 && mouseY < 200){
            setAllKeyTouched()
        }
    }

    this.checkHand = (handPoseHist) => {
        // Boucle on the right hand history
        for (let i = 0; i < handPoseHist.length; i++) {
            const hand = handPoseHist[i];
            hand.life-=minusLifeTime;
        }

        // This boucle on the hand life
        for (let i = 0; i < handPoseHist.length; i++) {
            const hand = handPoseHist[i];
            if (hand.life <= 0)
                handPoseHist.splice(i, 1)
        }
    }

    this.registerHandPosition = () => {
        let _rightWrist = this.getHandForHistory(socketHandPosition.right)
        handPoseHistory.right.push(_rightWrist);

        let _leftWrist = this.getHandForHistory(socketHandPosition.left)
        handPoseHistory.left.push(_leftWrist)
    }

    this.getHandForHistory = (hand) => {
        return {
            position: createVector(width*hand.x, height*hand.y),
            confidence: hand.confidence,
            life: handLifeTime
        }
    }

    // Function called once model is loaded
    this.sceneLoaded = () => {
        sceneIsLoaded = true
        if (DEBUGMODE === true)
            console.log('/-Scene Loaded, you can play-/');
    }



    this.goNextScene = () => {
        if (DEBUGMODE) {
            console.log("Clear Melody + Clear HandPoseHistory")
        }
        clearMelody()
        handPoseHistory = {
            "right": [],
            "left": []
        }
        goToScene()
    }

    //#region Debug Functions

    // Function called if DEBUGMODE const is true
    this.showScene = () => {

        // Flip video horizontaly
        scale(-1, 1);
        image(video, -width, 0, width, height)

        if (timeGlitched > 0) {
            
	        if(frameCount % 2 === 0) {
                glitch.loadImage(video);
                // map mouseX to # of randomBytes() + mouseY to limitBytes()
                glitch.limitBytes(map(25, 0, height, 0, 1));
                glitch.randomBytes(map(25, 0, width, 0, 100));
                glitch.buildImage();
                image(glitch.image, -width, 0, width, height)
            }
            timeGlitched--
        }
        scale(-1, 1);
    }

    //#endregion

    this.heartSize = 200
    this.heartValue = 2
    this.animationValue = 0;

    this.drawHeart = () => {
        if(heartIsBroken ===false){
            image(Assets.get("IMAGES").data[48].img, 
            width/2-this.heartSize*1.77/2, 
            height/2-this.heartSize/2, 
            this.heartSize*1.77, 
            this.heartSize)
    
            if(this.heartSize > 290){
                this.heartValue = -2
            }
            if(this.heartSize < 200){
                this.heartValue = 2
            }
    
            this.heartSize += this.heartValue;
        }else{
            image(Assets.get("IMAGES").data[24+Math.floor(this.animationValue)].img, 
            width/2-this.heartSize*1.77/2, 
            height/2-this.heartSize/2, 
            this.heartSize*1.77, 
            this.heartSize)
            this.animationValue += 0.8
            if(this.animationValue > 24){
                this.animationValue=0;
                heartIsBroken = false;
            }
        }
    }



}