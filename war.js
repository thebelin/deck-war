
// Example WAR:
var thisDeck = new deck(),
  warStackRules = {
    highCard: null,
    lowCard: null,
    addCard: function (card) {
      var self = this,
        suitRanks = {
          x: 0,
          c: 0.1,
          d: 0.2,
          h: 0.3,
          s: 0.4
        },
        aceBonus = function (card) {
          console.log(card);
          return card.val === 1 ?14 :card.val;
        }
        /**
         * memoization pattern for status properties
         * 
         * @return none
         */
        getCardStatus = function() {
          self.lowCard = {val: 15, suit: 'x'};
          self.highCard = {val: 0, suit: 'x'};
          self.cards.map(function (card) {
            // make aces worth 14
            this.lowCard = (
              aceBonus(card) + suitRanks[card.suit] <
              aceBonus(this.lowCard) + suitRanks[this.lowCard.suit]
            )
            ?card
            :this.lowCard;
            this.highCard = (
              aceBonus(card) + suitRanks[card.suit] >
              aceBonus(this.highCard) + suitRanks[this.highCard.suit]
            )
            ?card
            :this.highCard;
          }, self);
        };

      // Add the card to the deck
      this.cards.push(card);
      // Update the status of the hand
      getCardStatus();
    }
  },
  hand  = new thisDeck.hand([], {name: 'Player 1'}),
  hand2 = new thisDeck.hand([], {name: 'Player 2'}),
  warChest = new thisDeck.hand([], {name: 'Player 1'}),
  warChest2 = new thisDeck.hand([], {name: 'Player 2'}),
  shuffles = 0,
  shuffles2 = 0,
  flip = false,
  init = function() {
    this.thisDeck = new deck();
    this.hand  = new thisDeck.hand([], {name: 'Player 1'});
    this.hand2 = new thisDeck.hand([], {name: 'Player 2'});
    this.warChest = new thisDeck.hand([], {name: 'Player 1'});
    this.warChest2 = new thisDeck.hand([], {name: 'Player 2'});
    this.shuffles = 0;
    this.shuffles2 = 0;
    var thisCard;

    while (thisCard = thisDeck.dealCard()) {
      if (flip) {
        thisCard.setData({name: 'Player 1'});
        hand.addCard(thisCard);
        flip = false;
      } else {
        thisCard.setData({name: 'Player 2'});
        hand2.addCard(thisCard);
        flip = true;
      }
    }
  },

  showGame = function(message) {
    console.clear();
    console.log(
      '========================== THIS IS WAR ===========================\n' +
      '=    Player 1                  |     Player 2                    =\n' +
      '=    Total Cards: %d          |     Total Cards: %d             =\n' +
      '=    Warchest: %d             |     Warchest: %d                =\n' +
      '=    Shuffles: %d              |     Shuffles: %d                =\n' +
      '==================================================================\n' +
      message,
      hand.cards.length,
      hand2.cards.length,
      warChest.cards.length,
      warChest2.cards.length,
      shuffles,
      shuffles2
    )
  },

  showGameFinish = function (message) {
    showGame(message);
    init();
  };

init();
var w = function (automated) {
  if (automated) {
    if (!autoInterval) {
      return;
    }
  }
  if (hand.cards.length === 0) {
    // move the warChest back into the hand
    hand.addCards(warChest.cards);
    warChest = new thisDeck.hand([], {name: 'Player 1'});
    shuffles ++;
  }
  if (hand2.cards.length === 0) {
    // move the warChest back into the hand
    hand2.addCards(warChest2.cards);
    warChest2 = new thisDeck.hand([], {name: 'Player 2'});
    shuffles2 ++;
  }

  if (hand.cards.length + warChest.cards.length <= 17) {
    showGameFinish('PLAYER 2 IS THE VICTOR!!!');
  } else if(hand2.cards.length + warChest2.cards.length <= 17) {
    showGameFinish('PLAYER 1 IS THE VICTOR!!!');
  }

  var playerCards = [hand.takeCard(), hand2.takeCard()],
    stack = new thisDeck.hand([], warStackRules);

  stack.addCards(playerCards);
  
  if (stack.highCard.name === 'Player 1') {
    warChest.addCards(stack.cards);
  } else {
    warChest2.addCards(stack.cards);
  }

  showGame(
    stack.highCard.name + ' WON THIS ROUND ' +
    'Playing a ' + stack.highCard + ' against a ' + stack.lowCard
  );
}
console.log('WAR Try to get one side down to less than 15 cards.');
console.log('w() to run a game');
