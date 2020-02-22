
var btn = $('a');
var cells = $('td');

var system32 = 'O';
var player = 'X';
var current_player = player;
var table = $('table tr');


function get_cell(row,col){
    return table.eq(row).find('td').eq(col).text(); 
}

function change_cell(row,col,value){
    table.eq(row).find('td').eq(col).text(value); 
}


function game_over(){
    //this is for vertical check
    for(var row=0;row<3;row++){
        if(get_cell(row,0) !== '' && get_cell(row,0) === get_cell(row,1) && get_cell(row,0) === get_cell(row,2)){
                return get_cell(row,0);
            }
        }
    //this is for horizontal check
    for(var col=0;col<3;col++){
        if(get_cell(0,col) !== '' && get_cell(0,col) === get_cell(1,col) && get_cell(0,col) === get_cell(2,col) ){
            return get_cell(0,col);
            }
    }
    //this are for the two possibilities of diagonal wins
    if(get_cell(0,0) !== '' && get_cell(0,0) === get_cell(1,1) && get_cell(0,0) === get_cell(2,2)){
        return get_cell(0,0);
    }
    if(get_cell(2,0) !== '' && get_cell(2,0) === get_cell(1,1) && get_cell(2,0) === get_cell(0,2)){
        return get_cell(2,0);
    }
    //this if for if the game is still on
    for(var row=0;row<3;row++){
        for(var col=0;col<3;col++){
            if(get_cell(row,col) == ''){
                return null;
            }
        
        }
    }
    //and this is a tie
    return '';
}
let game_scores = {
    'X': -1,
    'O': 1,
    '': 0
}

function minimax(ismaximizer,alpha,beta){
    let state = game_over()
    if(state != null){
        return game_scores[state];
    }
    if(ismaximizer){
        let  BestScore = -Infinity;
        outer:
        for(var i = 0; i < 3; i++){
            for(var j = 0; j < 3; j++){
                if(get_cell(i,j) == ''){
                    change_cell(i,j,system32)
                    let score = minimax(false,alpha,beta)
                    BestScore = Math.max(BestScore,score)
                    alpha = Math.max(alpha,score)
                    change_cell(i,j,'')
                    if(beta <= alpha){
                        break outer;
                    }
                }
            }
        }
        return BestScore;

    }
    else{
        let  BestScore = Infinity;
        outer2:
        for(var i = 0; i < 3; i++){
            for(var j = 0; j < 3; j++){
                if(get_cell(i,j) == ''){
                    change_cell(i,j,player)
                    let score = minimax(true,alpha,beta)
                    BestScore = Math.min(BestScore,score)
                    beta = Math.min(beta,score)
                    change_cell(i,j,'')
                    if(beta <= alpha){
                        break outer2;
                    }
                }
            }
        }
        return BestScore;
    }
}
    

function aiPlay(){
    game_mode = game_over();
    if(game_mode === null){
       let  BestScore = -Infinity;
        let BestMove = {};
        for(var i = 0; i < 3; i++){
            for(var j = 0; j < 3; j++){
                if(get_cell(i,j) == ''){
                    let alpha = -Infinity;
                    let beta = Infinity;
                    change_cell(i,j,system32)
                    let score = minimax(false,alpha,beta)
                    if(score > BestScore){
                        BestScore = score;
                        BestMove[0] = i;
                        BestMove[1] = j;
                    }
                    change_cell(i,j,'')
                }
            }
        }
        change_cell(BestMove[0],BestMove[1],system32)
	    current_player = player;
        //alert('it\'s '+current_player+' turn.');
    }
    else{
        if(game_mode == 'X'){
            alert('Congratulation X wins!!!!');
        }
        else if(game_mode == 'O'){
            alert('Congratulation O wins!!!!');
        }
        if(game_mode == ''){
            alert('its a tie!!');
        }
    
    }

}



function play(){
    for(var i=0; i<cells.length;i++){
        cells.eq(i).on('click',function(){
            game_mode = game_over();
            if(game_mode == null){
            if(current_player === player){
            if($(this).text() === ''){
                $(this).text(current_player);
                current_player = system32;
                //alert('it\'s '+current_player+' turn.');
                aiPlay();
            }else{
                current_player = player;
                alert('please click a valid cell.');
            }
                }       
            }
            else{
                if(game_mode == 'X'){
                    alert('Congratulation X wins!!!!');
                }
                else if(game_mode == 'O'){
                    alert('Congratulation O wins!!!!');
                }
                if(game_mode == ''){
                    alert('its a tie!!');
                }
            }
        })
    }
}


function remove(){
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 3; j++){
            change_cell(i,j,'')
        }
    }
    current_player = player;
}
play();
btn.on('click',remove)
