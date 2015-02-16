function SingleElimination(participants) {
  var builder = bracketModel(), gameCount, currRound = 0, prevRound, i,
    smallestPowerOfTwo = 1, skipFirst, participantsLeft = _.clone(participants);

  while (smallestPowerOfTwo < participants.length) {
    smallestPowerOfTwo *= 2;
  }

  skipFirst = smallestPowerOfTwo - participants.length;

  if (skipFirst) {
    builder.round(++currRound);
    for (i = 0; i < participants.length - skipFirst; i += 2) {
      builder.game().participant(participantsLeft.pop()).participant(participantsLeft.pop());
    }
  }

  builder.round(++currRound);
  console.log(skipFirst);
  for (i = 0; i < (skipFirst ? smallestPowerOfTwo / 2 : participants.length); i += 2) {
    var game = builder.game(), participant;

    participant = participantsLeft.shift();
    if (participant) {
      game.participant(participant);
    } else {
      game.winnerOf(1, 0);
    }
    participant = participantsLeft.shift();
    if (participant) {
      game.participant(participant);
    } else {
      game.winnerOf(1, 1);
    }
  }

  gameCount = Math.ceil(smallestPowerOfTwo / 4);
  while (gameCount > 1) {
    prevRound = currRound;
    currRound++;
    builder.round(currRound);
    for (var j = 0; j < gameCount; j += 2) {
      builder.game().winnerOf(prevRound, j).winnerOf(prevRound, j + 1);
    }
    gameCount /= 2;
  }

  return builder;
}