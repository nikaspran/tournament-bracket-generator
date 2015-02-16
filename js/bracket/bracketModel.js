function bracketModel() {
  var builder, model = {}, participants = [], prevRoundIdx, currRoundIdx, currGameIdx;

  function id(roundIdx, gameIdx) {
    return roundIdx + '_' + gameIdx;
  }

  return builder = {
    round: function (key) {
      prevRoundIdx = currRoundIdx;
      currRoundIdx = key;
      model[currRoundIdx] = model[currRoundIdx] || [];
      return builder;
    },
    game: function () {
      currGameIdx = model[currRoundIdx].length;
      model[currRoundIdx].push({id: id(currRoundIdx, currGameIdx), participants: []});
      return builder;
    },
    participant: function (name) {
      var participant = {name: name};
      participants.push(participant);
      model[currRoundIdx][currGameIdx].participants.push(participant);
      return builder;
    },
    placeholder: function () {
      model[currRoundIdx][currGameIdx].participants.push({
        label: 'plc'
      });
      return builder;
    },
    winnerOf: function (roundKey, gameIdx) {
      model[currRoundIdx][currGameIdx].participants.push({
        label: 'W_' + id(roundKey, gameIdx),
        origin: id(roundKey, gameIdx)
      });
      return builder;
    },
    loserOf: function (gameIdx) {
      model[currRoundIdx][currGameIdx].participants.push({
        label: 'L_' + id(prevRoundIdx, gameIdx)
      });
      return builder;
    },
    participants: function () {
      return participants;
    },
    value: function () {
      return model;
    }
  }
}

