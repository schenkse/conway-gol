# conway-gol
A simple implementation of Conway's Game of Life written in javascript.

You can set the seed of the game by clicking the tiles of the pattern.
Then run the game and watch your population evolve.

## Rules
At each iteration of the game, the following rules apply:
* Any live cell with fewer than two live neighbours dies of loneliness.
* Any live cell with two or three live neighbours lives on to the next generation.
* Any live cell with more than three live neighbours dies from overpopulation.
* Any dead cell with exactly three live neighbours becomes a live cell through reproduction.

More information can for example be found on [Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).