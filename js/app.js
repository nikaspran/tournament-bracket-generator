var options = {width: 1200, height: 400, game: {width: 100, height: 70}};

var bracket = bracketModel()
  .round(1)
  .game().participant('Player 1').participant('Player 2')
  .game().participant('Player 3').participant('Player 4')
  .game().participant('Player 5').participant('Player 6')
  .game().participant('Player 7').participant('Player 8')
  .round(2)
  .game().winnerOf(1, 0).winnerOf(1, 1)
  .game().winnerOf(1, 2).winnerOf(1, 3)
  .round(3)
  .game().winnerOf(2, 0).winnerOf(2, 1);

var renderer = new Renderer();

bracket = new SingleElimination([
  'Player 1',
  'Player 2',
  'Player 3',
  'Player 4',
  'Player 5',
  'Player 6',
  'Player 7',
  'Player 8',
  'Player 9',
  'Player 10'
]);

renderer.renderBracket(options, bracket);