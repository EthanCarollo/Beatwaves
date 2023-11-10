var SceneManager


function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    SceneManager = new SceneManager();
    setupScene();
    
    //SceneManager.showScene(Intro);
    // For the developpement on this branch, i only show the scene for the game
    SceneManager.showScene( Game );
}

function draw() {
    SceneManager.draw();
}

function setupScene(){
    SceneManager.addScene( Intro );
    SceneManager.addScene( MainMenu );
    SceneManager.addScene( Tutorial );
    SceneManager.addScene( Game );
    SceneManager.addScene( EndMenu );
}

