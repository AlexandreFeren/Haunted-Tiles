const { maxHeaderSize } = require("http");
const { NONE } = require("phaser");

function main(gameState, side) {
	const myTeam = gameState.teamStates[side];
	const [rowSize, colSize] = gameState.boardSize;
	const possibleMoves = [];
	
	b = [[],[],[],[],[],[],[]];
	for (i = 0; i < gameState.tileStates.length; i++){
		for (j = 0; j < gameState.tileStates[i].length; j++){
			b[i].push(gameState.tileStates[i][j]);
		}
	}
	

	h = [];
	a = [];
	
	for (i = 0; i < 3; i++){
	
		h.push(gameState.teamStates.home[i].coord);
		h[i].push(gameState.teamStates.home[i].isDead);
		a.push(gameState.teamStates.away[i].coord);
		a[i].push(gameState.teamStates.away[i].isDead);
	}
	teams = [h, a];
	
	allMoves = getValidMoves([board, teams]);
	
	return minimax(JSON.parse(JSON.stringify([board, teams])), allMoves, 'home')[1];
}

function minimax(gameState, possibleMoves, side, maxDepth = 2, depth = 0){
	moveValues = [];	
	
	allMoves = combineArr(possibleMoves.slice(0, 3));
	
	for (let move of allMoves){
		moveValues.push([value(getGameState(gameState, move, side)), move]);
	}
	
	moveValues.sort(function(a, b) {
		return a[0] - b[0];
	});
	
	return moveValues[moveValues.length-1];
	
	/*
	//to be implemented, use the best n moves from the combineArr paired with getGameState
	moveValues = []
	if (possibleMoves.length == 6){
		//if this is the start of a move
		if (side == 'home'){
			
		}
	}
	if (side === 'home'){
		return [possibleMoves[0][1], possibleMoves[1][1], possibleMoves[2][1]];
	}
	else{
		
		return [possibleMoves[3][1], possibleMoves[4][1], possibleMoves[5][1]];
	}
	*/
	return ['none', 'none', 'none'];	//fallback code
}

function getValidMoves(gameState){
	const [rowSize, colSize] = [gameState[0].length, gameState[0][0].length];
	moves = []
	board = gameState[0];

	for (i = 0; i < 2; i++){
		for (let member of gameState[1][i]){
			move = [];
			if (member[2]){

				move.push('none');
			}else{
				move.push('none');
				const [row, col] = [member[0], member[1]];
				if ((row > 0) && board[row-1][col] > 1){
					move.push('north');
				}
				if ((row < rowSize - 1) && board[row+1][col] > 1){
					move.push('south');
				}
				if ((col > 0) && board[row][col-1] > 1) {
					move.push('west');
				}
				if ((col < colSize - 1) && board[row][col+1] > 1) {
					move.push('east');
				}
			}
			moves.push(move);
		}

	}
	return moves;
}

function value(gameState, side){

	val = 0;

	teams = gameState[1];
	for (i = 0; i < 3; i++){
		if (teams.home[i].isDead){
			val -= 1000;
		}
		if (teams.away[i].isDead){
			val += 1000;
		}
	}
	
	/*
	//get distance from center, this should be member.coord manhattan distance to board[3][3]
	for (i = 0; i < 3; i++){
		if (!teams.home[i].isDead){
			val -= (Math.abs(teams.home[i].coord[0] - 3) + Math.abs(teams.home[i].coord[1] - 3));
		}
		if (!teams.away[i].isDead){
			val += Math.abs(teams.away[i].coord[0] - 3) + Math.abs(teams.away[i].coord[1] - 3);
		}
	}
	*/
	for (i = 0; i < 3; i++){
		val += getRegionValue(gameState[0], teams[0][i][0], teams[0][i][1]);	
		val -= getRegionValue(gameState[0], teams[1][i][0], teams[1][i][1]);	

	}

	//get distance to nearest enemy. Since this is roughly equal for each team, it will be set based on team affiliation
	tempVal = 0;
	for (i = 0; i < 3; i++){
		for (j = 0; j < 3; j++){
			//get min of distance to each of 3 pieces
			if (!teams.home[i].isDead){
				if (!teams.away[j].isDead){
					tempVal += Math.abs(teams.home[i].coord[0]-teams.away[j].coord[0]) + Math.abs(teams.home[i].coord[1]-teams.away[j].coord[1]);
				}
			}
		}
	}
	if (side == 'home'){
		val += tempVal;
	}
	else{
		val -= tempVal
	}
		
	return val;
}

function getGameState(gameStateOriginal, move, side = ""){

	gameState = JSON.parse(JSON.stringify(gameStateOriginal));
	
	for (j = 0; j < Math.floor(move.length/3); j++){
		for (i = 0; i < 3; i++){

			if (side == 'home' || side == "") {
				//console.log("side = home");

				if (move[i] == 'north') {
					gameState[0][gameState[1][0][i][0]-1][gameState[1][0][i][1]] -= 1;
					gameState[1][0][i][0]--;
				}else if (move[i] == 'south') {
					gameState[0][gameState[1][0][i][0]+1][gameState[1][0][i][1]] -= 1;
					gameState[1][0][i][0]++;
				}else if (move[i] == 'west') {
					gameState[0][gameState[1][0][i][0]][gameState[1][0][i][1]-1] -= 1;
					gameState[1][0][i][1]--;
				}else if (move[i] == 'east') {
					gameState[0][gameState[1][0][i][0]][gameState[1][0][i][1]+1] -= 1;
					gameState[1][0][i][1]++;
				}else{
					gameState[0][gameState[1][0][i][0]][gameState[1][0][i][1]] -= 1;
				}
			}
			if (side == 'away' || side == ""){
				if (move[i] == 'north') {
					gameState[0][gameState[1][1][i][0]-1][gameState[1][1][i][1]] -= 1;
					gameState[1][1][i][0]--;
				}else if (move[i] == 'south') {
					gameState[0][gameState[1][1][i][0]+1][gameState[1][1][i][1]] -= 1;
					gameState[1][1][i][0]++;
				}else if (move[i] == 'west') {
					gameState[0][gameState[1][1][i][0]][gameState[1][1][i][1]-1] -= 1;
					gameState[1][1][i][1]--;
				}else if (move[i] == 'east') {
					gameState[0][gameState[1][1][i][0]][gameState[1][1][i][1]+1] -= 1;
					gameState[1][1][i][1]++;
				}else{
					gameState[0][gameState[1][1][i][0]][gameState[1][1][i][1]] -= 1;
				}
			}
			

		}


	}

	return gameState;
	
}
function getRegionValue(board, i, j){
	//determines the size of an area that a monster is in using the location it is at.
	//very much an approximation for efficiency's sake
	x = 0;
	y = 0;
	//console.log("board");
	//console.log(board);
	if (i < 0 || i >= board.length){
		return 0;
	}
	if (j < 0 || j >= board[i].length){
		return 0;
	}
	if (board[i][j] <= 1){
		//monster standing on broken tile (value 1), could cause out of bounds error if not checked
		return 0;	
	}
	//start heading to top left corner
	while (i > 0 ){
		//head to top
		i -= 1;
		if (board[i][j] <= 1){
			i += 1;
			break;
		}
	}
	while (j > 0){
		//head to left
		j -= 1;
		if (board[i][j] <= 1){
			j += 1;
			break;
		}
	}
	
	//start heading to bottom left corner
	while (i < board.length-1){
		if (board[i][j] <= 1){
			i -= 1;
			break;
		}
		i+= 1;
		x += 1;
	}
	while (j < board[i].length-1){
		if (board[i][j] <= 1){
			j -= 1;
			break;
		}
		j+= 1;
		y += 1;
	}
	return (x+1)*(y+1);
}
function minimax(gameState, possibleMoves, side, maxDepth, depth = 0){
	//to be implemented, use the best n moves from the combineArr paired with getGameState
	/*
		needs to be split into 2 separate calls per move both for move complexity and to represent intended moves for both sides
		needs all possible moves for both passed in on the first round, then the moves done by the opposing team on round 2
		then loop back to beginning.

		(gameState, possibleMoves (can be len.6 or len.3), side, max depth, current depth) then possible have one last parameter
		that will be the 'next moveset'.

		currently would like to store possible moves in the form of [value, [monstermove1, monstermove2, ...]] and sort to get best moves

		if at max depth: return appropriately max or min move set with values

		once this is mostly working, make minHelper and maxHelper functions to clean up code.
	*/
	moveValues = [];
	if (possibleMoves.length == 6){
		//if this is the start of a move
		if (side == 'home'){
			//get all possibilities for first 3 monster moves (home)
			allMoves = combineArr(possibleMoves.slice(0,3));
			for (let move of allMoves){
				//should be [moveVal, move], and allow for easy sorting.
				moveValues.push([value(getGameState(gameState, move, side)), move]);
			}
			//all moves have been tested, now take the max n of them
			//example: [[0, ['none', 'none', 'none']], * * * ]
			//take the last 1 in <divisor> from moveValues. somewhere in the range of about 10 should be a good divisor probably.
			//these should be the highest values since the array is now sorted.

			//reassigning moveValues for easy work with return values
			moveValues.sort();
			if (maxDepth > depth){
				//likely good subset of possible moves
				moveValues = moveValues.slice(moveValues.length - Math.ceil(moveValues.length/10), moveValues.length);

				//for all moves now marked as possible
				for (i = 0; i < moveValues.length; i++);
					//for each possible move, call minimax with the updated game state, remainimg possible moves, opposite side, and depth params.
					//minimax returns a move, value pair, and we only want the value
					moveValues[i][0] = minimax(getGameState(gameState, move, side), possibleMoves.slice(3, 6), 'away', maxDepth, depth + 1)[0]; //first ind, as that is value.
					moveValues.sort();
				//call minimax with the next game state and increment the depth. uses the value found to be max by minimax
				return moveValues[moveValues[moveValues.length-1]];
			}else{
				//return the max value, move won't matter as this is just evaluating the worth of the move
				//wanted: moveValues[moveValues.length-1][0]
				return moveValues[moveValues[moveValues.length-1]];
			}
			//return minimax(getGameState(gameState, move, side), possibleMoves.slice(3, 6), 'away', maxDepth, depth + 1);
		}
		
		else{
			//get all possibilities for last 3 monster moves (away)
			allMoves = combineArr(possibleMoves.slice(3,6));
			for (let move of allMoves){
				//should be [moveVal, move], and allow for easy sorting.
				moveValues.push([value(getGameState(gameState, move, side)), move]);
			}
			//all moves have been tested, now take the max n of them
			//example: [[0, ['none', 'none', 'none']], * * * ]
			//take the last 1 in <divisor> from moveValues. somewhere in the range of about 10 should be a good divisor probably.
			//these should be the highest values since the array is now sorted.

			//reassigning moveValues for easy work with return values
			moveValues.sort();
			if (maxDepth > depth){
				moveValues = moveValues.slice(moveValues.length - Math.ceil(moveValues.length/10), moveValues.length);

				//if not at the deepest level
				for (i = 0; i < moveValues.length; i++);
					//for each possible move, call minimax with the updated game state, remainimg possible moves, opposite side, and depth params.
					moveValues[i] = minimax(getGameState(gameState, move, side), possibleMoves.slice(3, 6), 'home', maxDepth, depth + 1)[0]; //first ind, as that is value.
					moveValues.sort();
				//call minimax with the next game state and increment the depth. uses the value found to be max by minimax
				return moveValues[moveValues[0]];
			}else{
				//return the max value, move won't matter as this is just evaluating the worth of the move
				//wanted: moveValues[moveValues.length-1][0]
				return moveValues[moveValues[0]];
			}
			//return minimax(getGameState(gameState, move, side), possibleMoves.slice(3, 6), 'home', maxDepth, depth + 1);
		}
	} else if (possibleMoves.length == 3) {
		allMoves = combineArr(possibleMoves);
		for (let move of allMoves){
			moveValues.push([value(getGameState(gameState, move, side)), move]);
		}
		if (side == 'home'){
			moveValues.sort();
			if (maxDepth > depth){
				moveValues = moveValues.slice(moveValues.length - Math.ceil(moveValues.length/10), moveValues.length);

				//if not at the deepest level
				for (i = 0; i < moveValues.length; i++);
					//for each possible move, call minimax with the updated game state, remainimg possible moves, opposite side, and depth params.
					moveValues[i] = minimax(getGameState(gameState, move, side), possibleMoves.slice(3, 6), 'away', maxDepth, depth + 1)[0]; //first ind, as that is value.
					moveValues.sort();
				//call minimax with the next game state and increment the depth. uses the value found to be max by minimax
				return moveValues[moveValues[moveValues.length-1]];
			}else{
				//return the max value, move won't matter as this is just evaluating the worth of the move
				//wanted: moveValues[moveValues.length-1][0]
				return moveValues[moveValues[moveValues.length-1]];
			}
			//return minimax(getGameState(gameState, move, side), possibleMoves.slice(3, 6), 'away', maxDepth, depth + 1);
		}else{
			//get all possibilities for last 3 monster moves (away)
			allMoves = combineArr(possibleMoves.slice(3,6));
			for (let move of allMoves){
				//should be [moveVal, move], and allow for easy sorting.
				moveValues.push([value(getGameState(gameState, move, side)), move]);
			}
			//all moves have been tested, now take the max n of them
			//example: [[0, ['none', 'none', 'none']], * * * ]
			//take the last 1 in <divisor> from moveValues. somewhere in the range of about 10 should be a good divisor probably.
			//these should be the highest values since the array is now sorted.

			//reassigning moveValues for easy work with return values
			moveValues.sort();
			if (maxDepth > depth){
				moveValues = moveValues.slice(moveValues.length - Math.ceil(moveValues.length/10), moveValues.length);

				//if not at the deepest level
				for (i = 0; i < moveValues.length; i++);
					//for each possible move, call minimax with the updated game state, remainimg possible moves, opposite side, and depth params.
					moveValues[i] = minimax(getGameState(gameState, move, side), possibleMoves.slice(3, 6), 'home', maxDepth, depth + 1)[0]; //first ind, as that is value.
					moveValues.sort();
				//call minimax with the next game state and increment the depth. uses the value found to be max by minimax
				return moveValues[moveValues[0]];
			}else{
				//return the max value, move won't matter as this is just evaluating the worth of the move
				//wanted: moveValues[moveValues.length-1][0]
				return moveValues[moveValues[0]];
			}
		}
	} else {
		return ['none', 'none', 'none'];
	}
	/*
	if (side === 'home'){
		return [possibleMoves[0][1], possibleMoves[1][1], possibleMoves[2][1]];
	}
	else{
		
		return [possibleMoves[3][1], possibleMoves[4][1], possibleMoves[5][1]];
	}
	*/
}

function combineArr(arr, ind = 0, result = [[]]){
	//takes in an array of possible moves (probably limited for 2 for the sake of branching factors), and outputs all possible combinations
	//because of the synchronous move setup, this is most easily done here
	//example array would be [["N","none"],["S", "W"],["E","W"],["E", "N"],["N", "S"],["none", "W"]]
	//with NSEW representing 'north', 'south', 'east' and 'west'
	newResult = [];
	for (let j of result){
		for (let i of arr[ind]){
			if (j.length === 0){
    			newResult.push([]);
			}
			else{
    			toAdd = [];
    			for (i = 0; i < j.length; i++){
    			    toAdd.push(j[i]);
    			}
    			newResult.push(toAdd);
		    }
		    
		}
	}
	for (i = 0; i < newResult.length; i++) {
		newResult[i].push(arr[ind][i%arr[ind].length]);
	}

	if (ind == arr.length - 1){
		return newResult;
	}
	else{
		return combineArr(arr, ind+1, newResult);
	}
}
