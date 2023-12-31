let mouseSize = 80;

// Function called to show an interactive button and checking if a position is in the button
const showInteractiveButton = (interactiveButton, checkPosition) => {

    if(DEBUGMODE === true && isInRect(mouseX, mouseY, interactiveButton.position.x, interactiveButton.position.y, interactiveButton.width, interactiveButton.height)){
        cnv.mouseClicked(() => {
            console.log("called a button") 
            interactiveButton.callback()
        })
    }

    if (isInRect(checkPosition.x, checkPosition.y, interactiveButton.position.x, interactiveButton.position.y, interactiveButton.width, interactiveButton.height) && interactiveButton.isReady) {
        interactiveButton.loading = lerp(interactiveButton.loading, 100, 0.1)
        document.getElementById("target-mouse-hand").classList.add("is-loading")
        if(interactiveButton.loading > 99.9){
            interactiveButton.callback()
            interactiveButton.isReady = false
        }
    } else {
        interactiveButton.loading = lerp(interactiveButton.loading, 0, 0.1)
        if(interactiveButton.loading < 1){
            interactiveButton.isReady = true
        }
    }

    fill(255, interactiveButton.loading*2, 0)
    if(DEBUGMODE === true){
        rect(interactiveButton.position.x, interactiveButton.position.y, interactiveButton.width, interactiveButton.height)
    }

    if(interactiveButton.loading > 1){
        noStroke()
        fill(255,255,255)
        // Draw the circle that fullfill the mouse
        circle(checkPosition.x, checkPosition.y, mouseSize*interactiveButton.loading/100)
    }
}

// Draw the shape of the mouse
const drawMouse = (_position) => {
    fill(255,0,0,0)
    strokeWeight(10)
    stroke(255,255,255)
    circle(_position.x, _position.y, mouseSize)
    fill(255,0,0,255)
    document.getElementById("target-mouse-hand").style.transform = "translateY("+_position.y+"px) translateX("+_position.x+"px)"
}

const disableMouse = () => {
    document.getElementById("target-mouse-hand").style.display = "none"
}

const enableMouse = () => {
    document.getElementById("target-mouse-hand").style.display = "flex"
}