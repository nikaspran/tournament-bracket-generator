var options = {width: 800, height: 600, game: {width: 100, height: 50}};

var rounds = bracketModel()
  .round(1)
  .game().participant('Player 1').participant('Player 2')
  .game().participant('Player 3').participant('Player 4')
  .game().participant('Player 5').participant('Player 6')
  .game().participant('Player 7').participant('Player 8')
  .round(2)
  .game().winnerOf(0).winnerOf(1)
  .game().winnerOf(2).winnerOf(3)
  .round(3)
  .game().winnerOf(0).winnerOf(1)
  .value();

function renderBracket(options, rounds) {
  var nodeMap = {}, graph = new joint.dia.Graph, paper = new joint.dia.Paper({
    el: $('#paper'),
    width: options.width,
    height: options.height,
    gridSize: 1,
    model: graph
  });

  function spacerSize(elSize, elCount, totalSize) {
    return (totalSize - elCount * elSize) / (elCount + 1);
  }

  function gameNode(x, y, game) {
    var participants = game.participants, participantHeight = options.game.height / participants.length,
      gameCell = new joint.shapes.basic.Rect({
        position: {x: x, y: y},
        size: options.game,
        attrs: {rect: {fill: 'transparent'}}
      });

    graph.addCell(gameCell);
    participants.forEach(function (participant, index) {
      var cell = new joint.shapes.basic.TextBlock({
        position: {x: x, y: y + participantHeight * index},
        size: {width: options.game.width, height: participantHeight},
        content: participant.name
      });

      if (participant.origin) {
        link(nodeMap[participant.origin], gameCell);
      }

      graph.addCell(cell);
      gameCell.embed(cell);
    });

    nodeMap[game.id] = gameCell;
    return gameCell;
  }

  function link(source, target) {
    var link = new joint.dia.Link({
      source: {id: source.id},
      target: {id: target.id}
    });
    graph.addCell(link);
    return link;
  }

  function findMaxTextWidth(texts) {
    return _(texts).map(function (text) {
      var cell = new joint.shapes.basic.Text({attrs: {text: text}});
      console.log(cell.getBBox().width);
      graph.addCell(cell);
      return cell.getBBox().width;
    }).max().value();
  }

  console.log(findMaxTextWidth(['text1', 'text text']));

  function elementsTotalSize(elSize, elIdx) {
    return elSize * elIdx;
  }

  var roundIdx = 0, totalRounds = _.keys(rounds).length;
  _.forEach(rounds, function (games, roundName) {
    var spaceWidthTotal = spacerSize(options.game.width, totalRounds, options.width) * (roundIdx + 1),
      roundX = elementsTotalSize(options.game.width, roundIdx) + spaceWidthTotal;

    _.forEach(games, function (game, gameIdx) {
      var spaceHeightTotal = spacerSize(options.game.height, games.length, options.height) * (gameIdx + 1),
        roundY = elementsTotalSize(options.game.height, gameIdx) + spaceHeightTotal;
      gameNode(roundX, roundY, game);
    });
    roundIdx++;
  });
}

renderBracket(options, rounds);