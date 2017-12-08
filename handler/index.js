const commandsHandler = require('./commands');
const config = require('../bot/config');

const detectDirectMessageOrNot = channel => {
	if (channel[0] === 'D') {
		return true;
	}
	return false;
};

const processCommand = (command, data, commands) => {
	if (command in commandsHandler) {
		commandsHandler[command](data, commands);
	} else {
		commandsHandler.else(data, commands);
	}
};

module.exports = data => {
	if (
		data.type === 'message' &&
		data.subtype !== 'bot_message' &&
		typeof data.text !== 'undefined'
	) {
		const commands = data.text.split(' ');
		const { channel } = data;

		const directMessage = detectDirectMessageOrNot(channel);

		if (!directMessage) {
			if (commands[0] === config.name) {
				const [_, command, ...otherCommands] = commands;
				processCommand(command, data, otherCommands);
			}
		} else {
			const [command, ...otherCommands] = commands;
			processCommand(command, data, otherCommands);
		}
	}
};
