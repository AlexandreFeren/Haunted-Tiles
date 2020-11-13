function main(gameState, side) {
	const myTeam = gameState.teamStates[side];
	const [rowSize, colSize] = gameState.boardSize;
	const possibleMoves = [];
	
	board = [[],[],[],[],[],[],[]];
	for (i = 0; i < gameState.tileStates.length; i++){
		for (j = 0; j < gameState.tileStates[i].length; j++){
			board[i].push(gameState.tileStates[i][j]);
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
	if (side == 'home'){
		teams = [h, a];
	}
	else{
		teams = [a, h];
	}
	
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
		
		//should mark team member as dead. As this is passed by reference, it should propagate
		/*
		if (gameState[0][teams[0][i][0]][teams[0][i][1]] <= 1){
			teams[0][i][2] = true;
		}
		if (gameState[0][teams[1][i][0]][teams[1][i][1]] <= 1){
		    	teams[1][i][2] = true;
		}
		*/
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
	//console.log(val);
	for (i = 0; i < 3; i++){

		val += getRegionValue(JSON.Parse(JSON.Stringify(gameState[0])), teams[0][i][0], teams[0][i][1]);	
		val -= getRegionValue(JSON.Parse(JSON.Stringify(gameState[0])), teams[1][i][0], teams[1][i][1]);	
	}
	

	//get distance to nearest enemy. Since this is roughly equal for each team, it will be set based on team affiliation
	/*
	for (i = 0; i < 3; i++){
		tempVal = [];
		for (j = 0; j < 3; j++){
			//get min of distance to each of 3 pieces
			if (!teams[0][i][2]){
				if (!teams[1][j][2]){
					//manhattan distance between closest pieces
					//squared to prioritize closing distance in the 'long' direction may be an idea for future
					tempVal.push((Math.abs(teams[0][i][0]-teams[1][j][0])-2)**2 + (Math.abs(teams[0][i][1]-teams[1][j][1])-2)**2);
				}
			}
		}
		//console.log("TEMPVAL");
		//console.log(tempVal);
		tempVal.sort((a, b) => a - b)
		
		//want a 'better' value for close values. 
		if (side == 'home'){
			//apparently Math.max() only works with tuples
			
			val -= tempVal[tempVal.length-1];
		}
		else{
			val += tempVal[tempVal.length-1];
		}
	}
	*/
	

	//console.log(val);
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
	
	/*
	x = 1;
	y = 1;
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
	*/
	val = 0;

	if (i < 0 || j < 0 || i >= board.length || j >= board.length){
		return 0;
	}
	if (board[i][j] <= 1){
		return 0;
	} else{
		val += board[i][j] - 1;
		board[i][j] = -1;
	}
	board[i][j] = -1;
	
	val += getRegionValues(board, i+1, j);
	val += getRegionValues(board, i-1, j);
	val += getRegionValues(board, i, j+1);
	val += getRegionValues(board, i, j-1);
	return val;
	
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
