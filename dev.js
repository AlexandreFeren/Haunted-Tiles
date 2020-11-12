function main(gameState, side) {
	const myTeam = gameState.teamStates[side];
	const [rowSize, colSize] = gameState.boardSize;
	const possibleMoves = [];
	//allMoves = [];	//possible moves for all 6 monsters
	
	board = [[],[],[],[],[],[],[]];
	for (i = 0; i < gameState.tileStates.length; i++){
		for (j = 0; j < gameState.tileStates[i].length; j++){
			board[i].push(gameState.tileStates[i][j]);
		}
	}
	
	
	//console.log(b);
	//console.log("teams");

	h = [];
	a = [];
	
	for (i = 0; i < 3; i++){
		//console.log("loop");
		//console.log(gameState.teamStates.home[i]);
		//console.log(gameState.teamStates.home[i].coord);
	
		h.push(gameState.teamStates.home[i].coord);
		h[i].push(gameState.teamStates.home[i].isDead);
		a.push(gameState.teamStates.away[i].coord);
		a[i].push(gameState.teamStates.away[i].isDead);
	}
	teams = [h, a];
	
	allMoves = getValidMoves([board, teams]);
	//test = combineArr(allMoves);
	/*
	for (let member of gameState.teamStates.home){
		//get moves for home team
		//console.log(member);
		//console.log(home.getOwnPropertyNames());
		allMoves.push(getValidMoves([gameState], member.coord));
	}
	for (let member of gameState.teamStates.away){
		//get moves for away team
		allMoves.push(getValidMoves(gameState, member))
	}
	*/
	//at this point, there should be a 2D array with 6 elements that are possible moves for each of the monsters
	//the actual return value will depend on which side you are playing for
	
	console.log("in main");

	
	
	//console.log(gameState.teamStates.home);
	//console.log(gameState.teamStates.home);
	//console.log(teams);
	//console.log(gameState);
	//console.log(gameState);
	//console.log(test[0]);
	//console.log(gameState.tileStates);
	//console.log(test[0].slice(0,3));
	//a = getGameState([board, teams], test[0].slice(0, 3), side);
	//console.log(a)
	//a = getGameState([board, teams], test[0].slice(0, 3), side
	
	console.log("calling minimax, good luck to me");
	console.log([board, teams]);
	//console.log(minimax([board, teams], allMoves, side)[1]);
	return minimax([board, teams], allMoves, side)[1];
	// we are returning a timeout here to test limiting execution time on the sandbox side.
}

function minimax(gameState, possibleMoves, side, maxDepth = 2, depth = 0){
	console.log("minimax start");
	//console.log(gameState);
	//console.log(possibleMoves);
	//console.log(side);
	moveValues = [];
	if (side == 'home'){
		//allMoves will be the array of all move combinations that can be done by this side this turn
		allMoves = combineArr(possibleMoves.slice(0, 3));
		console.log(allMoves);
		for (let move of allMoves.slice(0, 5)){
			board = getGameState(gameState, move, side);
			console.log("BOARD");
			console.log(board);
			val = value(board, side);
			//console.log("VAL");
			//console.log(val);
		}
		/*
		for (i = 0; i < allMoves.length; i++){
			console.log("allMoves[i]");
			console.log(allMoves[i]);
			//add the value estimate to the possible move
			board = getGameState(gameState, allMoves[i], side);
			console.log("BOARD");
			console.log(board);
			val = value(board, side);
			console.log("VAL");
			console.log(val)
			//moveValues.push(value(getGameState(gameState, allMoves[i], side)), allMoves[i]);
		}
		*/
		//moveValues.sort();	//max doesn't seem to work with the way the arrays are set up
		//return moveValues[len(moveValues)-1];
		
	}else{
		//allMoves will be the array of all move combinations that can be done by this side this turn
		allMoves = combineArr(possibleMoves.slice(3, 6));
		
		for (i = 0; i < allMoves.length; i++){
			//add the value estimate to the possible move
			//moveValues.push(value(getGameState(gameState, allMoves[i], side)), allMoves[i]);
		}
		moveValues.sort();	//min doesn't seem to work with the way the arrays are set up
		return moveValues[0];
	}
	
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

	//loop through home
	
	//loop through away
	//console.log("inner loop");
	//console.log(gameState[1][0]);
	for (i = 0; i < 2; i++){
		for (let member of gameState[1][i]){
			move = [];
			if (member[2]){
				//console.log("isDead");
				//console.log(member[3]);
				//member is dead
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
			//console.log("moves");
			//console.log(moves);
		}
	}

	return moves;
}

function value(gameState, side){
	//piece alive = good
	//piece near middle = good
	//piece near opponent = good
	//piece near ally = bad
	//piece in region = C*value of region
	//console.log(gameState.teamStates.home.getOwnPropertyNames());
	val = 0;
	teams = gameState[1];
	for (i = 0; i < 3; i++){
		//check death status for each team
		if (teams[0][i][2]){
			val -= 1000;
		}
		if (teams[1][i][2]){
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
		//console.log("Game State:");
		//console.log(gameState);
		
		//get value of the region for each piece
		//console.log("REGION");
		//console.log(getRegionValue(gameState[0], teams[0][i][0], teams[0][i][1]))
		
		val += getRegionValue(gameState[0], teams[0][i][0], teams[0][i][1]);	
		val -= getRegionValue(gameState[0], teams[1][i][0], teams[1][i][1]);	
	}

	//get distance to nearest enemy. Since this is roughly equal for each team, it will be set based on team affiliation
	
	for (i = 0; i < 3; i++){
		tempVal = [];
		for (j = 0; j < 3; j++){
			//get min of distance to each of 3 pieces
			if (!teams[0][i][2]){
				if (!teams[1][j][2]){
					//manhattan distance between closest pieces
					//this needs fixing, as it currently sums all distances
					tempVal.push(Math.abs(teams[0][i][0]-teams[1][j][0]) + Math.abs(teams[0][i][1]-teams[1][j][1]));
				}
			}
		}
		//console.log("TEMPVAL");
		//console.log(tempVal);
		tempVal.sort()
		if (side == 'home'){
			//apparently Math.max() only works with tuples
			
			val += tempVal[tempVal.length-1];
		}
		else{
			val -= tempVal[tempVal.length-1];
		}
	}
	

		
	return val;
}

function getGameState(gameState, move, side = ""){
	//determines what the state of the board will be after a valid move set
	//should take in array of length 3
	//board = gameState[0];
	console.log("in getGameState");
	console.log(gameState);
	console.log(move);
	console.log(gameState[1][0][0][0]);
	
	//console.log(move);
	//console.log(side);
	for (j = 0; j < Math.floor(move.length/3); j++){
		for (i = 0; i < 3; i++){
			//console.log("in loop");
			//console.log(gameState);
			//console.log(gameState[1][0][i]);
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
		/*
		if (side == 'home'){
			side = 'away';
		}else{
			side = 'home';
		}
		*/
	}
	/*
	//gameState.teamStates.home = 
	console.log("S");
	console.log(gameState[0]);
	console.log(gameState[1]);
	console.log("[1][0]");
	console.log(gameState[1][0]);
	console.log("");
	console.log(gameState[1][0][0]);
	console.log(gameState[1][0][0].coord[0]);
	console.log(gameState[0][gameState[1][0][0].coord[0]][gameState[1][0][0].coord[1]]);
	console.log("E");
	*/
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
function translateToBitmap(boardState, playerStates){
	//using this to ultimately  transition functions to being more efficient by using bitmaps
	//for now the implementation is just going to be basic array-based
	//takes a 7x7 array and a 6x2 array
	//currently unsure of how exactly bitmaps will be represented, but it needs 98 bits for the board
	//and 62 bits for the pieces (x loc, y loc)

}
function translateFromBitmap(state){
	//take whatever bitmap is made and convert it back to arrays
	//needed to transition over to using bitmaps if that is ultimately done
}
