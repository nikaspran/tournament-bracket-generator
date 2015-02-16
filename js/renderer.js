var Renderer = function () {

  function findMaxTextWidth(paper, texts) {
    function textWidth(text) {
      var cell = new joint.shapes.basic.Text({
        attrs: {text: {text: text}}
      }), width;
      paper.model.addCell(cell);
      width = V(V(cell.findView(paper).el).find('text')[0]).bbox(true).width;
      cell.remove();
      return width;
    }

    return _(texts).map(textWidth).max().value();
  }

  function bindPosition(cells) {
    cells.forEach(function (c1) {
      cells.forEach(function (c2) {
        if (c1 !== c2) {
          c1.on('change:position', function (cell, newPos, change) {
            if (!change.noPropagate) {
              c2.translate(change.tx, change.ty, {noPropagate: true});
            }
          });
        }
      });
    });
  }

  function spacerSize(elSize, elCount, totalSize) {
    return (totalSize - elCount * elSize) / (elCount + 1);
  }

  function elementsTotalSize(elSize, elIdx) {
    return elSize * elIdx;
  }

  return {
    renderBracket: function renderBracket(options, bracket) {
      var nodeMap = {}, graph = new joint.dia.Graph, paper = new joint.dia.Paper({
        el: $('#paper'),
        width: options.width,
        height: options.height,
        gridSize: 1,
        perpendicularLinks: true,
        model: graph
      });

      options = {
        width: options.width,
        height: options.height,
        game: {
          width: Math.max(options.game.width, findMaxTextWidth(paper, _.map(bracket.participants(), 'name')) + options.game.height / 2 + 50),
          height: options.game.height
        }
      };

      function gameNode(x, y, game) {
        var participants = game.participants, participantHeight = options.game.height / participants.length, cells = [],
          gameCell = new joint.shapes.basic.Rect({
            position: {x: x, y: y},
            size: options.game,
            attrs: {rect: {fill: 'white'}}
          });

        graph.addCell(gameCell);
        cells.push(gameCell);
        participants.forEach(function (participant, index) {
          var participantY = y + participantHeight * index, participantCell = new joint.shapes.html.Participant({
            position: {x: x, y: participantY},
            size: {width: options.game.width, height: participantHeight},
            name: participant.name,
            label: participant.label
          });

          graph.addCell(participantCell);
          cells.push(participantCell);

          if (participant.origin) {
            link(nodeMap[participant.origin], participantCell);
          }
        });

        bindPosition(cells);

        //gameCell.toBack();
        nodeMap[game.id] = gameCell;
        return gameCell;
      }

      function link(source, target) {
        var sourceBox = source.getBBox(), targetBox = target.getBBox(), link = new joint.dia.Link({
          router: {name: 'orthogonal'},
          source: {id: source.id},
          target: {id: target.id},
          vertices: [
            {x: (sourceBox.x + targetBox.x + sourceBox.width) / 2, y: sourceBox.y + sourceBox.height / 2},
            {
              x: (sourceBox.x + targetBox.x + sourceBox.width) / 2,
              y: targetBox.y + targetBox.height / 2 + targetBox.height / 4 * (sourceBox.y > targetBox.y ? 1 : -1)
            }
          ]
        });
        graph.addCell(link);
        link.toBack();
        return link;
      }

      function sourceGameCells(game) {
        return _(game.participants).map(function (participant) {
          return nodeMap[participant.origin];
        }).filter().value();
      }

      var roundIdx = 0, totalRounds = _.keys(bracket.value()).length;
      _.forEach(bracket.value(), function (games, roundName) {
        var spaceWidthTotal = spacerSize(options.game.width, totalRounds, options.width) * (roundIdx + 1),
          roundX = elementsTotalSize(options.game.width, roundIdx) + spaceWidthTotal;

        _.forEach(games, function (game, gameIdx) {
          var spaceHeightTotal = spacerSize(options.game.height, games.length, options.height) * (gameIdx + 1),
            sourceGames = sourceGameCells(game), gameY = (roundIdx > 1 && _(sourceGames).map(function (source) {
                return source.position().y;
              }).reduce(function (sum, y) {
                return sum + y;
              }) / sourceGames.length) || elementsTotalSize(options.game.height, gameIdx) + spaceHeightTotal;

          gameNode(roundX, gameY, game);
        });
        roundIdx++;
      });
    }
  };
};