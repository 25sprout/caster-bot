const SlackBot = require('slackbots');

const config = require('./config');

const bot = new SlackBot(config);

module.exports = bot;
