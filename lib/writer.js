'use strict';

var assert = require('assert');
var Emitter = require('events');
var utils = require('./utils.js');

// config object options
// sqs
// region
// accessKeyId
// secretAccessKey
// version
// queueUrl

function Writer(config) {
  this.sqs = config.sqs;
  if (!config.sqs) {
    this.sqs = utils.buildSQS(config);
  }
  assert(config.queueUrl, 'queueUrl required');
  this.queueUrl = config.queueUrl;
  this.debug = config.debug;
}

Writer.prototype = Object.create(Emitter.prototype);

Writer.prototype.publish = function(msg, cb) {
  var self = this;

  if (!msg.QueueUrl) msg.QueueUrl = this.queueUrl;

  self.sqs.sendMessage(msg, function(err, data) {
    if (err) self.emit('error', err);
    if (cb) return cb(err, data);
  });
};

module.exports = Writer;