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
        this.movementVector = [0,1]; 
    }

    increaseSize(x, y){
        this.tail.push(new TailSquare(x,y)); 
    }

    increaseInHead(x,y){
        this.tail.unshift(new TailSquare(x,y)); 
    }

    getMovementVector(){
        return this.movementVector; 
    }
    setMovementVector(x,y){
        this.movementVector = [x,y]; 
    }

    move(space){
        //--return 
        //"empty" - nothing found
        //"collision" - snake collision
        //"token" - found the ball, increases size
        //$('body').append("<div>" + this.direction + "</div>"); 
        let isToken = false; 
        let xOffset = this.getMovementVector()[0];  
        let yOffset = this.getMovementVector()[1];  
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

            //Guardamos coordenadas actuales
            actualX = this.tail[i].x; 
            actualY = this.tail[i].y; 


            //Comprobamos contenido
            if(i == 0 && space[nextX][nextY].content == "snake"){
                return "collision"; 
            }
            if(i == 0 && space[nextX][nextY].content == "token"){
                //Si hay token, sustituimos por una serpiente
                $('#' + nextX + nextY).removeClass('token'); 
                $('#' + nextX + nextY).addClass('snake'); 
                space[nextX][nextY].content ="snake"; 
                this.increaseInHead(nextX, nextY); 
                return "token"; 
            }else{
                //Nos movemos si no hay token
                this.tail[i].changeCoordinates(nextX, nextY); 
                space[nextX][nextY].content = "snake"; 

                //Cambiamos colores de celda
                $('#' + actualX + actualY).removeClass('snake'); 
                $('#' + actualX + actualY).addClass('empty'); 
                $('#' + nextX + nextY).removeClass('empty'); 
                $('#' + nextX + nextY).addClass('snake'); 

            }

        }
        space[nextX][nextY].content = null; 
        return "empty"; 
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
        this.addToken(); 
    }

    update(){
        let moveCompleted = this.snake.move(this.canvas); 
        if(moveCompleted == "collision"){
            this.endGame(); 
            return false; 
        }else if(moveCompleted == "token"){
            this.addToken(); 
        }
        return true; 
    }

    endGame(){
        $('#snake-app').empty(); 
        $('#snake-app').append("GAME OVER"); 
    }

    addToken(){
        let inSnake = true; 
        let nextTokenX = 0; 
        let nextTokenY = 0; 
        do{
            nextTokenX = Math.floor(Math.random() * (hSize-1 + 1));
            nextTokenY = Math.floor(Math.random() * (vSize-1 + 1));
            //Check de que no se encuentra en snake, si no se pide otro
            for(let i = 0; i<this.snake.tail.length; i++){
                if(this.snake.tail[i].x == nextTokenX &&
                    this.snake.tail[i].y == nextTokenY){
                    break; 
                }
                if(i == this.snake.tail.length -1){
                    inSnake = false; 
                }
            }
        }
        while(inSnake)

            this.canvas[nextTokenX][nextTokenY].content = "token";
        let id = "#" + nextTokenX + nextTokenY; 
        $(id).removeClass('empty'); 
        $(id).addClass('token'); 
    }
    toggleToken(){
        for(let i = 0; i<this.canvas.length; i+=1){
            for(let j = 0; j <this.canvas[0].length; j+=1){
                if(this.canvas[i][j].content == "token"){
                    $('#'+i+""+j).removeClass("token"); 
                    $('#'+i+""+j).addClass("empty"); 
                }
            }
        }
        this.addToken(); 
    }
}


var hSize = 10; 
var vSize = 10; 
$(document).ready(function(){
    let game = new Game(); 
    game.startGame();
    var update = setInterval(function(){
        if(game.update() == false){
            clearInterval(update); 
        }
    }, 500);

    //Cambio direccion
    window.onkeydown = function (e) {
        if (e.keyCode == '38') {
            // up arrow
            game.snake.setMovementVector(0,-1); 
        }
        else if (e.keyCode == '40') {
            // down arrow
            game.snake.setMovementVector(0,1); 
        }
        else if (e.keyCode == '37') {
            // left arrow
            game.snake.setMovementVector(-1,0); 
        }
        else if (e.keyCode == '39') {
            // right arrow
            game.snake.setMovementVector(1,0); 
        }
    }
}); 

