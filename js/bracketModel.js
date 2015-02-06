function bracketModel() {
  var builder, model = {}, prevRoundIdx, currRoundIdx, currGameIdx;

  function id(roundIdx, gameIdx) {
    return roundIdx + '_' + gameIdx;
  }

  return builder = {
    round: function (key) {
      prevRoundIdx = currRoundIdx;
      model[currRoundIdx = key] = [];
      return builder;
    },
    game: function () {
      currGameIdx = model[currRoundIdx].length;
      model[currRoundIdx].push({id: id(currRoundIdx, currGameIdx), participants: []});
      return builder;
    },
    participant: function (name) {
      model[currRoundIdx][currGameIdx].participants.push({name: name});
      return builder;
    },
    winnerOf: function (gameIdx) {
      model[currRoundIdx][currGameIdx].participants.push({
        name: 'W_' + id(prevRoundIdx, gameIdx),
        origin: id(prevRoundIdx, gameIdx)
      });
      return builder;
    },
    loserOf: function (gameIdx) {
      model[currRoundIdx][currGameIdx].participants.push({
        name: 'L_' + id(prevRoundIdx, gameIdx),
        origin: id(prevRoundIdx, gameIdx)
      });
      return builder;
    },
    value: function () {
      return model;
    }
  }
}

