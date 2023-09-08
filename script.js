// row and column which will have id="rowNumber-coloumnNumber"
var board;
var score=0;
var rows=6;
var columns=6;


window.onload = function(){
    setGame();
}

function setGame(){
    board=[
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]
        
    ]
    

    for (let r=0; r<rows; r++){
        for (let c=0; c<columns; c++){

            let tile= document.createElement("div");
            // this just creates a div tag

            tile.id = r.toString() + "-" + c.toString();
            // this sets the id name as rowNumber-coloumnNumber

            let num = board[r][c];
            updateTile(tile , num);
            // adding the div tag created to the board
            document.getElementById("board").append(tile)
        }
    }

    // starts with 2's
    setTwo();
    setTwo();
}

function updateTile(tile, num){
    tile.innerText = "";
    tile.classList.value = "";
    // clear the classList so it doesnot have multile class
    tile.classList.add("tile");
    
    // to change the tile style according to the number
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            // upto this number the background color varies but after this same color of 8192 class continues
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }                
    }

}

//moving numbers around arrow keys
document.addEventListener('keyup', (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();

    }
    else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerText = score;
})

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     
                                                                         
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                
                                                                         
function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            slideRight();
            setTwo();
            /* right swipe */ 
        } else {
            slideLeft();
            setTwo();
            /* left swipe */
        }                       
    } else {
        if ( yDiff > 0 ) {
            slideDown();
            setTwo();
            /* down swipe */ 
        } else { 
            slideUp();
            setTwo();
            /* up swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};

function filterZero(row){
    return row.filter(num => num != 0);
    // creates and returns new array with all number except zero
}

function slide(row){
    //Step 1: remove zero
    row= filterZero(row);

    //Step 2: slide
    for (let i = 0; i < row.length-1; i++){
        // check every two tile
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    }
    //Step 3: clear zero
    row=filterZero(row);

    // Step 4: Add zero back
    while(row.length<columns){
        row.push(0);
    }

    return row;
}

function slideLeft(){

    // [2,2,2,0]
    // step 1 clear zeroes [2,2,2]
    // step 2 merge first soo first number becomes the total and next one becomes zero
    // [4,0,2]
    // step 3 clear zero
    // [4,2]
    // step 4 put zero back
    // [4,2,0,0]

    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        // update html
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight(){

    for (let r = 0; r < rows; r++) {
        let row = board[r];
        // same as left slide but just reverse array before using and after returning reverse again
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        // update html
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp(){
    // step 1 transpose the column and call slideLeft and then transpose the result again
    for(let c=0; c<columns; c++){
        let row=[board[0][c],board[1][c],board[2][c],board[3][c],board[4][c],board[5][c]];
        row=slide(row);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        // board[4][c] = row[4];
        // board[5][c] = row[5];
        // update at all at once in loop board[r][c]=row[r]
        
        // update html
        for (let r = 0; r < rows; r++){
            board[r][c]=row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }

    }
}

function slideDown(){
    // step 1 transpose the column and call slideLeft and then transpose the result again
    for(let c=0; c<columns; c++){
        
        let row=[board[0][c],board[1][c],board[2][c],board[3][c],board[4][c],board[5][c]];
        
        // same as up slide but just reverse array before using and after returning reverse again
        row.reverse();
        row=slide(row);
        row.reverse();

        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        // board[4][c] = row[4];
        // board[5][c] = row[5];
        // update at all at once in loop board[r][c]=row[r]
        
        // update html
        for (let r = 0; r < rows; r++){
            board[r][c]=row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }

    }

}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    // everytime we move the tile if its an open tile that is empt we are gonna call set function
    
    while (!found) {
        //find random row and column to place a 2 in
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        
        if (board[r][c] == 0) {
            board[r][c] = 2;

            //updating html
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}