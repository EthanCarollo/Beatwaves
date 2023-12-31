/**
 * This is the End Menu scene, played as the end of each game
 */
function EndMenu() {
    let handPosition = {
        x: 0,
        y: 0
    }
    let mousePosition = {
        x: 0,
        y: 0
    }

    // enter() will be executed each time the SceneManager switches
    // to this Scene
    this.enter = function () {
        this.seeDataviz({
            score: getScore(touched, melodyOne.length),
            life: playerLife
        })
        frameRate(30)
        enableMouse()
        document.getElementById("button_return_to_main_menu").style.display = "block";
    }

    // draw() is the normal draw function, this function work like a scene
    this.draw = function () {
        clearMelody()
        this.registerHandPosition()
        this.showScene()
        this.drawHandPosition()
        this.showEndButton()
    }

    this.showScene = () => {

        // Flip video horizontaly
        scale(-1, 1);
        image(video, -width, 0, width, height)
        background(0, 0, 0, 150)
        scale(-1, 1);
    }

    this.registerHandPosition = () => {
        handPosition = socketHandPosition.right;
    }


    this.drawHandPosition = () => {
        // ! This will need some improvement, actually it's just circle
        if (handPosition) {
            mousePosition.x = lerp(mousePosition.x, width*handPosition.x, 0.07)
            mousePosition.y = lerp(mousePosition.y, height*handPosition.y, 0.07)
            drawMouse(mousePosition)
        }
    }


    this.seeDataviz = (data) => {

        let livesRemaining = data.life

        console.log(livesRemaining)

        // Get the hand percent
        let leftHandPercent = 0
        let rightHandPercent = 0
        if(scoreHand.right > 0 || scoreHand.left){
            leftHandPercent = Math.round(scoreHand.right*100/(scoreHand.right+scoreHand.left))
            rightHandPercent =  Math.round(scoreHand.left*100/(scoreHand.right+scoreHand.left))
        }

        let fullValue = {
            "keysMiss": data.score.totalsKey,
            "keysTouch": data.score.keysTouch,
            "playerScore": data.score.playerScore,
            "playerRating": data.score.playerRating,
            "leftArm":leftHandPercent+"%",
            "rightArm":rightHandPercent+"%"
        };

        let domDataviz = {
            "keysMiss": { "title": "", "fontSize": "2vm", "nameId": "keysMiss" },
            "keysTouch": { "title": "", "fontSize": "2vm", "nameId": "keysTouch" },
            "playerScore": { "title": "", "fontSize": "2vm", "nameId": "playerScore" },
            "playerRating": { "title": "", "fontSize": "2vm", "nameId": "playerRating" },
            "leftArm": { "title": "leftArm", "fontSize": "2vm", "nameId": "leftArm" },
            "rightArm": { "title": "rightArm", "fontSize": "2vm", "nameId": "rightArm" },
        };

        let divDataviz = document.getElementById("dataviz");
        // divDataviz.style.display = "block";
        divDataviz.style.display = "grid";
        divDataviz.style.width = "100vw"
        divDataviz.style.height = "100vh"
        divDataviz.style.left = "0"
        divDataviz.style.top = "0"
        divDataviz.style.position = "absolute";
        divDataviz.style.display = "flex";
        divDataviz.style.alignContent = "center";
        divDataviz.style.alignItems = "center";

        // this.createZooningDOM();

        this.numberHeart(livesRemaining)
        for (let key in fullValue) {
            if (fullValue.hasOwnProperty(key)) {
                if (domDataviz[key]) {
                    let newDiv = document.getElementById(domDataviz[key].nameId)
                    newDiv.textContent = `${fullValue[key]}`;
                    newDiv.style.fontSize = domDataviz[key].fontSize;
                }
            }
        }

    }

    this.createZooningDOM = () => {
        let container = document.getElementById("container")
        // container.style.top = ((height / 2) - 300) + "px"
        // container.style.left = ((width / 2) / 2) + "px"

    }

    this.goNextScene = () => {
        let divDataviz = document.getElementById("dataviz");
        divDataviz.style.display = "none";
        document.getElementById("button_return_to_main_menu").style.display = "none";
        disableMouse()
        goToScene(MainMenu)
    }

    this.numberHeart = (_heart) => {
        let heart = _heart
        document.getElementById("livesRemaining").innerHTML = ""
        for(let i = 0; i < 5; i++){
            let div = document.getElementById("livesRemaining")
            let img = document.createElement('img')
            if(i<heart){
                img.src = Assets.get("IMAGES").data[8].url
            }else{
                img.src = Assets.get("IMAGES").data[10].url
            }
            img.style.width = "5rem"
            div.appendChild(img);
        }
    }

    let widthButton = width/100*15;
    let heightButton = height/100*15;
    const interactiveButton = {
        position: {
            x: width - width / 100 * 18,
            y: height / 2 - heightButton / 2
        },
        width: widthButton,
        height: heightButton,
        loading: 0,
        isReady: false,
        callback: () => { this.goNextScene() }
    }

    this.showEndButton = () => {
        document.getElementById("target-mouse-hand").classList.remove("is-loading")
        showInteractiveButton(interactiveButton, mousePosition)
    }
}
