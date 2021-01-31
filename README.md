## Overview
This program was created for the Tyler Tech Haunted Tiles code competition, and won 1st place for UMaine, and 2nd place overall. The base repo, and a very good set of instructions for setup is located at https://github.com/tyler-technologies-oss/codecomp-dropper, which comes with this agent "Spurious Correlation". The AI uses a variety of heuristics including how many agents are still alive, how much space is available for them to work with, and how close the agents are to the enemy agents.

## The Game
These rules are also overviewed at the main Repo, but here are the basics:

### Board
the board is 7 tiles across in all games, but there are several board setups the game may start on. 
Tiles have 3 strength each, meaning after a tile has been stepped on for the 3rd time it breaks and the agent on it will die.

### Rules
Each team gets 3 monsters, which all move at the exact same time each turn. 
Each agent may move exactly one tile orthoganally each turn, and is not restricted in any way, including walking off of the board. The agents may also choose to stay on their current tile for a move.

## The AI

### Value function
The core of how 'good' moves are determined.

#### Alive Members
Obvious metric, and could potentially be improved by accounting for the number of agents in a given region. The value function assigns a value higher than any of the others for there still being as many agents an possible alive, added once for each living agent.

#### Available Tiles
This takes the position of each of the agents and finds the size of the region it is in. because the final version only looked ahead by one move, it recursively gets the exact region value. each available step is counted for 15 points of value to avoid the aggregate distance negatively affecting the choices.

I also considered assuming the region is perfectly rectangular, which could make the function about 10 times, but this takes negligible time over a single iteration, so the more accurate version has been kept. this faster version could be useful for an implementation that uses a proper search tree.

#### Aggregate Distance From Opponent
Aggregate distance is a minor improvement to ensure the agents have more chances to trap the opponent and also maintain a comprable amount of space to that of the opposing agent.

#### Number of Agents on Tile
Final heuristic, disallows 2 or 3 home team agents from occupying the same tile at the same time, as it leads to many situations where the agents can get trapped quickly.

### Lookahead
The agents are capable of looking ahead by one move, allowing for simple traps to be set and for the AI to be guaranteed to step on an unbroken tile where available. 
