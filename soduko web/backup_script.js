board = $('.board tr')
cells = $('td')
var startpoints=[]


// get the value relative to the row and column
function get_value(row,col){
    return board.eq(row).find("td").eq(col).text();
}

function insert_value(row,col,value){
    board.eq(row).find('td').eq(col).text(value);
}


// checks if the value is the row returns false if found otherwise true
function row_check(row){
    let values = new Set()
    for(var i=0; i < 9; i++){
        if(get_value(row,i) != ''){
            if(values.has(get_value(row,i))){
                return false
            }
            values.add(get_value(row,i))
        }
    }
    return true
}


// checks if the value is the column returns false if found otherwise true
function col_check(col){
    let values = new Set()
    for(var i=0; i < 9 ;i++){
        if (get_value(i,col) != ''){
            if(values.has(get_value(i,col))){
                return false
            }
            values.add(get_value(i,col))
        }
        
    }
    return true
}

function grid_check(r,c){
    let grid = new Set()
    var j = r - r % 3
    var k = c - c % 3
    for(var row=0;row < 3;row++){
        for(var col=0;col < 3; col++){
            if(get_value(row+j,col+k) != ''){
                if(grid.has(get_value(row+j,col+k))){
                    return false
                }
                grid.add(get_value(row+j,col+k))
            }
        }   
    }
    return true
}

function inRow(row,value){
    for(var i=0; i < 9; i++){
        if(get_value(row,i) == value){
            return true
        }
    }
    return false
}
function inCol(col,value){
    for(var i=0; i< 9; i++){
        if(get_value(i,col) == value){
            return true
        }
    }
    return false
}

function inGrid(row,col,value){
    start_row = row - row % 3
    start_col = col - col % 3
    for(var i=0; i < 3; i++){
        for(var j=0; j < 3; j++){
            if(get_value(i+start_row,j+start_col) == value){
                return true
            }
        }
    }
    return false
}


function isSafe(row,col,value){
    
    return (!inCol(col,value)) && (!inRow(row,value)) && (!inGrid(row,col,value))
    
}

function isValid(row,col){
    if((row_check(row)) && (col_check(col)) && (grid_check(row,col))){
        return true
    }
    return false
}


function isGameOver(){
    for(var i=0; i < 9; i++){
        for(var j=0; j < 9;j++){
            if(get_value(i,j) == ''){
                return false
            }
            else if(isValid(i,j) == false){
                return false
            }
        }
    }
    return true
}


function shuffle(arr){
    var currentIndex = arr.length,temp_value,randomIndex;
    while(0 !== currentIndex){

        randomIndex = Math.floor(Math.random()*currentIndex)
        currentIndex -=1

        temp_value = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temp_value;
    }
    return arr
    
}

function findUnassigned(){
    var res = [-1,-1]
    for(var i=0; i < 9; i++){
        for(var j=0; j < 9; j++){
            if(get_value(i,j) == ''){
                res = [i,j]
                return res
            }
        }
    }
    return res
}


function solveDiagonals(row,col){
    for(var i = row;i < row+3; i++){
        for(var j = col;j < col+3; j++){
            do{
                var num = Math.round(Math.random()*8)+1
            }
            while(inGrid(i,j,num)){
                insert_value(i,j,num)
            }

        }
    }
}


function fillRemaining(row,col){
    if(findUnassigned()[0] == -1){
        return true
    }

    if(col >= 9 && row < 8){
        row = row + 1
        col = 0
    }
    if(row >= 9 && col >= 9 ){
        return true
    }
    if( row < 3){
        if(col < 3){
            col = 3
        }
    }
    else if(row < 6){
        if(col == Math.floor(row/3)*3){
            col = col + 3
        }

    }
    else{
        if(col == 6){
            row = row + 1 
            col = 0
            if(row >= 9){
                return true
            }
        }
    }
    for (var i = 1; i <= 9; i++) {
        if (isSafe(row,col,i)) {
            insert_value(row,col,i)
            if(fillRemaining(row,col+1)){
                return true
            }
            insert_value(row,col,'')
        }
    }
    return false
}


function fillBox(){
    for(var i=0;i < 9;i=i+3){
            solveDiagonals(i,i)
        }
}

// This is for removing K elements from the board when a full solvable board is generated
function removeElements(k){
    count = 0
    var cleared_cells = []
    var cells_value = []
    while(count < k){
        var temp_cell = Math.floor(Math.random()*81)+1
        var temp_col = Math.floor(temp_cell/9)
        var temp_row = Math.floor(temp_cell%9)

        if(temp_col != 0){
            temp_col = temp_col - 1
        }
        var value = get_value(temp_row,temp_col)
        if(value != '' && !cells_value.includes(value)){
            insert_value(temp_row,temp_col,'')
            solveBoard()
            if(isGameOver()){
                cleared_cells.push([temp_row,temp_col])
                cells_value.push(temp_cell)
                for (var i = 0; i < cleared_cells.length; i++) {
                    val = cleared_cells[i]
                    insert_value(val[0],val[1],'')
                }
                count++
            }
            else{
                insert_value(temp_row,temp_col,value)
            }
        }
    }
}


function gameStart(){
        fillBox()

        fillRemaining(0,3)
        if(isGameOver()){
            console.log('game is valid')
        }
        else{
            console.log('invalid game')
        }
        removeElements(30)

        for(var i=0; i < cells.length; i++){
            if(cells.eq(i).text() == ''){
                cells.eq(i).css('color','black')
                cells.eq(i).css('background-color','rgb(255, 255, 255)')
            }
        }

    
}


//     var round = 50
//     while(round > 0){
//         temp_row = Math.round(Math.random()*8)
//         temp_col = Math.round(Math.random()*8)
//         value = Math.round(Math.random()*8)+1
//         if(get_value(temp_row,temp_col) == ''){
//             if(isSafe(temp_row,temp_col,value) && isValid(temp_row,temp_col)){
//                 insert_value(temp_row,temp_col,value)
//                 var cell_id = temp_col+temp_row*9
//                 cells.eq(cell_id).css('color','grey')
//                 startpoints.push(cell_id)  // This gets the cell value of the soduko board relative to the board not the row and appends to the startpoints

//             }
            
//             if(! isValid(temp_row,temp_col)){
//                 insert_value(temp_row,temp_col,'')
//                 startpoints.pop()
//                 cells.eq(cell_id).css('color','black')
//             }

//         }
//     round--
//     }
// }




function solveBoard(){
    lis = findUnassigned()
    row = lis[0]
    col = lis[1]

    if(row != -1){
        for(var i = 1; i <= 9; i++){
            if(isSafe(row,col,i)){
                insert_value(row,col,i)
                if(solveBoard()){
                    return true
                }
                insert_value(row,col,'')
            }
        }  

    }
    else{
        return true
    }
    
    return false
    
}

function clearBoard(){
    for (var i = 0; i < 81; i++) {
        if(startpoints.includes(i)){
            cells.eq(i).text('')
        }
    }
}

gameStart()
$('#solve').on('click',solveBoard)
$('#clear').on('click',clearBoard)
for(var i = 0; i < cells.length; i++){
    if(cells.eq(i).text() == ''){
        startpoints.push(i)
    }
}

for(var i=0;i<cells.length;i++){
    if(startpoints.includes(i)){
        cells.eq(i).on('click',function(){
            if(isGameOver() == false){
                var value = prompt("Enter a value from 1 - 9 .")
                if(value==1 || value==2 || value==3 || value==4 || value==5 || value==5 || value==6 ||value==7 || value==8 || value==9){
                    $(this).text(value)
                }
            }
            else{
                alert('Congratulations Game Over !!!!')
            }
            
        })
    }
    
}


// TODO: The starting values cannot be edited but the values inputed by the user can
// TODO: Backtracking to solve the problem
// TODO: difficulty level
// TODO: 