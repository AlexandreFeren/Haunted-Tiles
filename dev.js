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
