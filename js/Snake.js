class Box {
    constructor(x, y, content) {
        this.x = x;
        this.y = y;
        this.content = content; 
    }
}

class Snake {
    constructor(){
        this.tail = [ new TailSquare(0,0) ]
        this.direction = "right"; 
    }

    increaseSize(x, y){
        this.tail.push(new TailSquare(x,y)); 
    }

    move(space){
        let xOffset = 0; 
        let yOffset = 0; 
        if(this.direction == "right"){
            xOffset = 1; 
        }else if(this.direction = "left"){
            xOffset = -1;  
        }else if(this.direction="bottom"){
            yOffset = 1; 
        }else if(this.direction="top"){
            yOffset = -1; 
        }

        let actualX = this.tail[0].x + xOffset; 
        let actualY = this.tail[0].y + yOffset; 
        let nextX = actualX; 
        let nextY = actualY;  
        for(let i = 0; i < this.tail.length; i+=1){
            //Las actuales del previo son nuestras siguientes
            nextX = actualX; 
            nextY = actualY;  

            //Comprobamos que no se salga del tablero
            if(nextX >= hSize){
                nextX = 0; 
            }
            if(nextX < 0){
                nextX = hSize -1; 
            }
            if(nextY >= vSize){
                nextY = 0; 
            }
            if(nextY < 0){
                nextY = vSize - 1; 
            }

            console.log("Next square moves to: " + nextX+ " "
                + nextY); 
            
            //Guardamos coordenadas actuales
            actualX = this.tail[i].x; 
            actualY = this.tail[i].y; 

            //Nos movemos
            this.tail[i].changeCoordinates(nextX, nextY); 
            space[nextX][nextY].content = "snake"; 
            
            //Cambiamos colores de celda
            $('#' + nextX + nextY).removeClass('empty'); 
            $('#' + nextX + nextY).addClass('snake'); 

        }
        console.log( "next X + Y " + nextX + nextY); 
        space[nextX][nextY].content = null; 
        return true; 
    }

    nextCoordinates(){
        let xOffset = 0; 
        let yOffset = 0; 
        if(this.direction == "right"){
            xOffset = 1; 
            yOffset = 0; 
        }else if(this.direction = "left"){
            xOffset = -1;  
            yOffset = 0; 
        }else if(this.direction="bottom"){
            yOffset = 1; 
            xOffset = 0; 
        }else if(this.direction="top"){
            yOffset = -1; 
            xOffset = 0; 
        }
        return [this.tail[0].x + xOffset, 
            this.tail[0].y + yOffset];
    }

}

class TailSquare {
    constructor(x, y){
        this.x = x; 
        this.y = y; 
    }

    changeCoordinates(xD,yD){
        this.x = xD; 
        this.y = yD; 
    }
}

class Game{
    constructor(){
        this.gameOver = false; 
        this.score = 0; 
        this.hBoxes = 10; 
        this.vBoxes = 10; 
        this.canvas = [];  
    }

    endGame(){
        this.gameOver = true; 
    }

    startGame(){
        var parent = $('#snake-app'); 
        for(let i= 0; i<this.hBoxes; i+=1){
            this.canvas.push([]); 
            for(let j = 0; j<this.vBoxes; j+=1){
                parent.append("<div id='" + i + j + 
                    "' class='box empty'></div>"); 
                this.canvas[i].push(new Box(i,j, null));
            }
        }
        this.snake = new Snake(); 
    }

    update(){
        let moveCompleted = this.snake.move(this.canvas); 
        if(moveCompleted == false){
            this.endGame(); 
        }

        let validToken = false; 
        let nextTokenX = Math.floor((Math.random() * hSize) + 0); 
        let nextTokenY = Math.floor((Math.random() * hSize) + 0); 
        this.canvas[nextTokenX][nextTokenY].content = "token";
        let id = "#" + nextTokenX + nextTokenY; 
        $(id).removeClass('empty'); 
        $(id).addClass('token'); 
    }

    endGame(){
        $('#snake-app').empty(); 
        $('#snake-app').append("GAME OVER"); 
    }
}


var hSize = 10; 
var vSize = 10; 
$(document).ready(function(){
    let game = new Game(); 
    game.startGame();
    console.log("start"); 
    var update = setInterval(function(){
        game.update(); 
        console.log("update"); 
    }, 1000);

    //change of direction
    window.onkeydown = function (e) {
        console.log(e.keyCode); 
        if (e.keyCode == '38') {
            // up arrow
            game.snake.direction == "top";
        }
        else if (e.keyCode == '40') {
            // down arrow
            game.snake.direction = "bottom";
        }
        else if (e.keyCode == '37') {
            // left arrow
            game.snake.direction = "left";
        }
        else if (e.keyCode == '39') {
            // right arrow
            game.snake.direction = "right";  
        }
    }
}); 

