function main(gameState, side) {
	console.log(gameState);
	console.log(side);
	console.log(gameState.teamStates[side]);
	console.log(gameState.getOwnPropertyNames);
	const myTeam = gameState.teamStates[side];
	const possibleMoves = [];
	const [rowSize, colSize] = gameState.boardSize;
	return new Promise((resolve, reject) => {
		const callback = () => resolve(
			myTeam.reduce((moveSet, member) => {
				if (member.isDead) {
					moveSet.push('none');
				} else {
					if (gameState.tileStates[member.coord[0]][member.coord[1]] > 1) {
						possibleMoves.push('none');
					}

					const [row, col] = member.coord;
					if ((row > 1) && gameState.tileStates[member.coord[0]-1][member.coord[1]] > 1) {
						possibleMoves.push('north');
					}
					if ((row < rowSize - 1) && gameState.tileStates[member.coord[0]+1][member.coord[1]] > 1) {
						possibleMoves.push('south');
					}
					if ((col > 1) && gameState.tileStates[member.coord[0]][member.coord[1]-1] > 1) {
						possibleMoves.push('west');
					}
					if ((col < colSize - 1) && gameState.tileStates[member.coord[0]][member.coord[1]+1] > 1) {
						possibleMoves.push('east');
					}
					if (possibleMoves.length == 0){
						moveSet.push('none');
					}
					moveSet.push(possibleMoves[Math.floor(Math.random() * possibleMoves.length)]);
					possibleMoves.length = 0;
				}
				return moveSet;
			}, [])
		);

		// we are returning a timeout here to test limiting execution time on the sandbox side.
		return setTimeout(
			callback
		, 0); // test timeout of player script for limiting execution time.

	})
}
function getValidMoves(){
	moves = [];
	possibleMoves.push('none');
	const [row, col] = member.coord;
	possibleMoves.push('north');
	possibleMoves.push('south');
	possibleMoves.push('west');
	possibleMoves.push('east');

	moveSet.push(possibleMoves[Math.floor(Math.random() * possibleMoves.length)]);
	possibleMoves.length = 0;
	
	return moves;
}
function value(gameState, possibleMoves){
	//piece alive = good
	//piece near middle = good
	//piece near opponent = good
	//piece near ally = bad
	//piece in region = C*value of region
}
function getGameState(){

}
function getRegionValue(x, y){

}
function minimax(gameState, possibleMoves, depth){

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
