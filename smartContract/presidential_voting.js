'use strict';

const CANDIDATES = ['donaldTrump', 'jackFellure', 'jeffBoss', 'johnDelaney', 'andrewYang', 'kanyeWest'];

var VotingEntry = function (text) {
  if (text) {
    var o = JSON.parse(text);
    this.name = o.name;
    this.vote = new Number(o.vote);
  } else {
    this.name = '';
    this.vote = 0;
  }
};

VotingEntry.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var SuperVotingContract = function () {
  LocalContractStorage.defineMapProperty(this, "superVoting", {
    parse: function (text) {
      return new VotingEntry(text);
    },
    stringify: function (o) {
      return o.toString();
    }
  });
};

// save value to contract, only after height of block, users can takeout
SuperVotingContract.prototype = {
  init: function () {
    //TODO:
  },
  save: function (name = "") {
    if (name === "" || !CANDIDATES.includes(name)){
      throw new Error("invalid name");
    }

    var from = Blockchain.transaction.from;

    var votingEntry = this.superVoting.get(name);

    if (votingEntry) {
      votingEntry.vote = votingEntry.vote + new Number(1)
    } else {
      var votingEntry = new VotingEntry();
      votingEntry.name = name;
      votingEntry.vote = new Number(1);
    }

    this.superVoting.put(name, votingEntry);
  },
  get: function (name) {
    name = name.trim();
    if ( name === "" ) {
      throw new Error("empty name")
    }
    return this.superVoting.get(name);
  }

};
module.exports = SuperVotingContract;