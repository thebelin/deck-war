/**
 * Deck Manager for js card games
 * 
 * For use as front end or node.js game controller
 *
 * @author Belin Fieldson <belin.fieldson@tritondigital.com>
 */
var deck = function(options) {
  // Let's be sure these are the droids we're looking for
  if (!this instanceof deck) {
    return new deck(options);
  }

  var self = this,
    // Helper function combines objects:
    extend = function () {
      // Iterate the arguments
      arguments[0] = (arguments[0] instanceof Object) ?arguments[0] :{};
      for (var i = 1; i < arguments.length; i ++) {
        if (arguments[i] instanceof Object) {
          for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
              arguments[0][key] = arguments[i][key];
            }
          }
        }
      }
      return arguments[0];
    },

    // Additional vars:
    /**
     * The local cards collection
     * @type Array
     */
    cards = [],

    /**
     * The local hands collection
     * @type Array
     */
    hands = [],

    // extend the options Object with some default options for a card game
    options = extend({}, {
      /**
       * Default cards for games with American Playing Cards
       */

      /**
       * The suits available for card specification
       * @type Array
       */
      suits: {
        c: {name: 'Clubs',    html: '&clubs;'},
        d: {name: 'Diamonds', html: '&diams;'},
        h: {name: 'Hearts',   html: '&hearts;'},
        s: {name: 'Spades',   html: '&spades;'}
      },

      /**
       * The face names and values for each of the cards
       * @type Array
       */
      faces: {
        1:  {name: 'Ace',    value: 'A'},
        2:  {name: 'Deuces', value: '2'},
        3:  {name: 'Treys',  value: '3'},
        4:  {name: 'Four',   value: '4'},
        5:  {name: 'Five',   value: '5'},
        6:  {name: 'Six',    value: '6'},
        7:  {name: 'Seven',  value: '7'},
        8:  {name: 'Eight',  value: '8'},
        9:  {name: 'Nine',   value: '9'},
        10: {name: 'Ten',    value: '10'},
        11: {name: 'Jack',   value: 'J'},
        12: {name: 'Queen',  value: 'Q'},
        13: {name: 'King',   value: 'K'}
      },

      // This loads up a standard 52 card deck
      // from the init scheme of suits and faces
      init: function (options) {
        // Establish all the cards in this deck based on the options
        Object.keys(options.suits).map( function(h) {
          for (var i = 0; i < Object.keys(options.faces).length; i ++) {
            var data = {
              // The face value of the card. 1 for Ace and 11, 12, 13 for faces
              val:    i + 1,

              // The suit of the card (symbol displayed)
              suit:   h,

              // For systems with card images, they should follow these conventions
              img:    parseInt(i + 1, 10) + h + '.png',

              // The HTML code for the suit
              symbol: options.suits[h].html,

              // The card's text value
              value:  options.faces[parseInt(i + 1, 10)].value,

              // They display as strings like this
              toString: function () {
                return options.faces[this.val].name + ' of ' + options.suits[this.suit].name;
              }
            };
            cards.push(new card(data));
          }
        }, this);
      }
    }, options),

  // var debug default debug to false for now
    debug = options.debug || false,
  // End default options

    /**
     * Operation Functions for each object method
     */
    // A way to add to the prototype
    addProtoType = {
      setData: function (key, value) {
        // If it's an object then absorb it
        if (key instanceof Object) {
          extend(this, key);
        } else {
          this[key] = value;    
        }
      }
    },

    /**
     * With symbols, values, and funny names, cards can be used for many games.
     * Stack them in a pile on the screen, use this object for what they mean.
     *
     * @param Object protos An Object with key-value pairs to load into this card prototype
     *
     * @return card An object literal defined herein
     */
    card = function (protos) {
      // Make sure this is invoked as a new card
      if (!this instanceof card) {
        return new card(protos);
      }
      debug || console.log('construct card');

      // Return a new object with the additional prototypes
      return extend({}, addProtoType, protos);
    },

    /**
     * The hand is where the cards go, that or the deck you know,
     * it can be used as a stack, if of discards you keep track.
     *
     * @param Array  cards  The cards for the hand to have at start
     * @param Object protos Additional prototype values for this hand
     *
     * @todo  convert the other passed in values into key-value object
     * 
     * @return Object hand
     */
    hand = function (cards, protos) {
      //Make sure this is invoked as a new hand
      if (!this instanceof hand) {
        return new hand(cards, protos);
      }
      debug || console.log('construct hand');
      // Create a local cards object based on the array passed in here
      this.cards = (cards instanceof Array) ?cards :[];

      // A self reference for use in the function scope
      var self = this;

      // Operate the card add sequence on the cards in the arguments
      cards.map(function (card) {
        this.cards.push(card);
      }, this);

      // Add the hand to the local hands
      hands.push(this);
      return extend({}, addProtoType, {
        // Return the cards in the hand as an object
        cards:  cards,

        // Add a card to the hand
        addCard: function (newCard)
        {
          self.cards.push(newCard);
        },

        // Add an array of cards to the hand
        addCards: function (cards) {
          cards.map(function (card) {
            this.addCard(card);
          }, this);
        },

        // Remove card at the specified index from hand,
        // or a random one if not specified and return it
        takeCard: function (index)
        {
          return cards.splice(index || Math.floor(Math.random() * cards.length), 1)[0];
        }
      }, protos);
    },

    /**
     * This is the deck from which cards spring, for those who like that kind of thing,
     * games can be built from this with ease, define parameters with each release.
     *
     * @param Object suits The suits tracked by this deck object
     * @param Object faces All the faces to track in the new deck
     * 
     * @return deck A new deck object
     */
    deckF = function (options) {
      // Make sure this is invoked as a new deck
      if (!this instanceof deck) {
        return new deck(options);
      }
      debug || console.log('construct deck');

      var self = this;
      // the parent function's array of all the cards in this deck
      this.cards = cards || new Array();
      
      // The parent functions collection of hands
      this.hands = hands || new Array();
      
      // Execute any init signal sent in with the options, calling itself
      if (options.init instanceof Function) {
        options.init(options);
      }

      // Return the important user facing bits, it looks like a deck to software kits.
      return {
        cards: this.cards,

        hands: this.hands,

        // Return a random card object from cards
        dealCard: function () {
          return self.cards.splice(Math.floor(self.cards.length * Math.random()), 1)[0];
        },

        // Return the count of cards in the deck
        cardCount: function() {
          return self.cards.length;
        },

        // Return a hand object
        hand: function (cards, proto) {
          return new hand(cards, proto);
        },

        // Return a card's public interface
        card: function(proto) {
          return new card(proto);
        },

        // Access to the extend function
        extend: extend
      };
    };

  // Do some closure, to be sure, we don't show it all, to those who know what to call
  return new deckF(options);
};
