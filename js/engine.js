/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        lastTime;

    var canvas = doc.createElement('canvas'),
    ctx = canvas.getContext('2d');
    canvas.width = 505;
    canvas.height = 498;
    doc.body.appendChild(canvas);
    
    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
         var z = document.getElementById("time").innerHTML;

         //When time reaches to 0 second the cancelAnimationFrame() is called to stop the animation.
         //And render the finalScreen.
         if(z == '0'){
            win.cancelAnimationFrame(main);
            finalScreen();

         } 
         else 
         { 
            win.requestAnimationFrame(main);  
         }
    }

    //This function draws the initialscreen in canvas.Its gives the information about the game and the option to select the players.
    function intialScreen(){
        ctx.fillStyle = "gray";
        ctx.fillRect(0,0,505,498);
        ctx.fillStyle= "white";
        ctx.font="20pt Impact";
        ctx.fillText("Select a Player",10,30);
        ctx.strokeStyle = "black";
        ctx.strokeText("Select a Player",10,30);
        ctx.font="15pt Impact";
        ctx.fillText("1",15,110);
        ctx.fillText("2",15,190);
        ctx.fillText("3",15,280);
        ctx.fillText("4",15,370);
        ctx.fillText("5",15,460);
        allPlayers.forEach(function(image) {
            image.render();
        });
        ctx.beginPath();
        ctx.moveTo(195,0);
        ctx.lineTo(195,498);
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();

        ctx.fillText("Start the game by selecting the",210,30);
        ctx.fillText("player.",210,50);
        ctx.fillText("Choose the player by pressing the",210,70);
        ctx.fillText("numbers",210,90)
        ctx.fillText("Cross the road to reach the water",210,130);
        ctx.fillText("to get points.",210,150);
        ctx.fillText("Avoid the Enemy Bugs.",210,190);
        bug1.render();
        allColorGem.forEach(function(gem) {
            gem.render();
        });
        ctx.fillText("Collect the Gems to gain more",210,330);
        ctx.fillText("points",210,350);

        //This eventListener is to select a player from the initialscreen.Every number is associated with different player.
        //Removed the eventListner on the next canvas rendering page.
        var listnerForPlayer = function(event){
             var allowedKeysForPlayer = {
               49 : '1',
               50 : '2',
               51 : '3',
               52 : '4',
               53 : '5'
            };
             
            handleInput(allowedKeysForPlayer[event.keyCode]);
        };
        doc.addEventListener('keyup',listnerForPlayer);

        function handleInput(key){
            var val = 'false';
            if(key === '1'){
                player.sprite = 'images/char-boy.png';
                val= 'true';
            }
            else if(key === '2'){
                player.sprite = 'images/char-cat-girl.png';
                val= 'true';
            }
            else if(key === '3'){
                player.sprite = 'images/char-pink-girl.png';
                val= 'true';
            }

            else if(key === '4'){
                player.sprite = 'images/char-horn-girl.png';
                val= 'true';
            }
            else if(key === '5'){
                player.sprite = 'images/char-princess-girl.png';
                val= 'true';
            }
            if(val === 'true'){
                document.getElementById('score').innerHTML = 0;
                document.getElementById('time').innerHTML = 60;
                calculateTime();
                doc.removeEventListener('keyup',listnerForPlayer);
                main(); 
            }
        }  
    }

    //This function for the finalscreen after 60 sec of time.
    //This eventListener is to reload the page on Enter.
    function finalScreen(){
        ctx.fillStyle= "white";
        ctx.font="20pt Impact";
        ctx.fillText("Game Over",10,30);
        ctx.fillText("Press ENTER for New Game",10,70);

        document.addEventListener('keyup',function(event){
            var allKeys = {
               13 : 'enter'  
            }
            handleInput(allKeys[event.keyCode]);
        });

        function handleInput(key1){
            if(key1 === 'enter'){
                win.location.reload();
            }
        }
    }
       
    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        allGems.forEach(function(gems) {
            gems.update(dt);
        }); 
    }

    function checkCollisions() { 
        allEnemies.forEach(function(enemy) {
            enemy.checkCollisions();
        });
        allGems.forEach(function(gems) {
            gems.pickGem(gems);
        }); 
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]),col * 101,row * 83);
            }
        }
        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array,allGems array,allPlayers array(it's for Pick aPlayer) and call
         * the render function you have defined.
         */

        allGems.forEach(function(gems) {
            gems.render();
        });

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();    
       
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        intialScreen();
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/Gem blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/char-pink-girl.png',
        'images/char-horn-girl.png',
        'images/char-princess-girl.png'    
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
    global.canvas = canvas;
})(this);


