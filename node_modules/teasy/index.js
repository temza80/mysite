/* jshint node: true */
'use strict';

var tokenizer = require('sbd');

module.exports = function teasy(text, soft, hard) {
  soft = soft || 256;
  hard = hard || 512;
  var sentences = tokenizer.sentences(text);
  var teaser = [];
  var length = 0;

  for (var i = 0, len = sentences.length; i < len; i++) {
    var sentence = sentences[i];
    length += sentence.length;
    teaser.push(sentence);

    if (length > soft) {
      break;
    }
  }

  var teaserText = teaser.join(' ');
  if (teaserText.length > hard) {
    teaserText = teaserText.substr(0, hard) + '…';
  }

  return teaserText;
};
