const fetch = require('node-fetch');

const bot = require('../bot');

const params = {
	icon_emoji: ':speaker:',
};

const API_ENDPOING = 'http://192.168.1.101';

const handlePlaylist = {
	start(userData, commands) {
		bot.postMessage(userData.channel, '開始播放', params);
	},
	async add(userData, commands) {
		if (commands.length === 0) {
			return bot.postMessage(userData.channel, '你壞壞', params);
		}

		const res = await fetch(`${API_ENDPOING}/api/youtube/${commands[0]}`);

		const { status, message = '' } = await res.json();

		if (status) {
			return bot.postMessage(userData.channel, `加入 ${commands[0]}`, params);
		}

		return bot.postMessage(
			userData.channel,
			'API 壞惹 找 peipei',
			Object.assign({}, params, {
				attachments: JSON.stringify([
					{
						author_name: message,
						color: 'danger',
					},
				]),
			}),
		);
	},
	async show(userData, commands) {
		const res = await fetch(`${API_ENDPOING}/api/youtube`, { method: 'GET' });

		const { status, message = '', data } = await res.json();

		if (status) {
			const { playlist, pointer } = data;

			// console.log(playlist);

			return bot.postMessage(
				userData.channel,
				'',
				Object.assign({}, params, {
					attachments: JSON.stringify(
						playlist.map(item => ({
							author_name: item.youtube_id,
							text: `歌名： *${item.name}*`,
							mrkdwn_in: ['text', 'fields'],
							fields: [
								{
									value: `歌手： *${item.singer}*`,
									short: false,
								},
							],
						})),
					),
				}),
			);
		}

		return bot.postMessage(
			userData.channel,
			'API 壞惹 找 peipei',
			Object.assign({}, params, {
				attachments: JSON.stringify([
					{
						author_name: message,
						color: 'danger',
					},
				]),
			}),
		);
	},
	async delete(userData, commands) {
		const res = await fetch(`${API_ENDPOING}/api/youtube/${commands[0]}`, {
			method: 'DELETE',
		});

		const { status, message = '' } = await res.json();

		if (status) {
			return bot.postMessage(userData.channel, `刪除 ${commands[0]}`, params);
		}

		return bot.postMessage(
			userData.channel,
			'API 壞惹 找 peipei',
			Object.assign({}, params, {
				attachments: JSON.stringify([
					{
						author_name: message,
						color: 'danger',
					},
				]),
			}),
		);
	},
	loop(userData, commands) {
		bot.postMessage(userData.channel, '循環播放', params);
	},
	async else(userData) {
		bot.postMessage(userData.channel, '你打錯字了!!還是你想跟我聊天？', params);
	},
};

module.exports = {
	list(userData, commands) {
		if (commands.length > 0 && commands[0] in handlePlaylist) {
			const [command, ...otherCommands] = commands;
			handlePlaylist[command](userData, otherCommands);
		} else {
			const [_, ...otherCommands] = commands;
			handlePlaylist.else(userData, otherCommands);
		}
	},
	async space(userData) {
		const res = await fetch(`${API_ENDPOING}/api/youtube/space`, { method: 'POST' });

		const { status, message = '' } = await res.json();

		if (status) {
			return bot.postMessage(userData.channel, '暫停/播放');
		}

		return bot.postMessage(
			userData.channel,
			'API 壞惹 找 peipei',
			Object.assign({}, params, {
				attachments: JSON.stringify([
					{
						author_name: message,
						color: 'danger',
					},
				]),
			}),
		);
	},
	async up(userData) {
		const res = await fetch(`${API_ENDPOING}/api/youtube/up`, { method: 'POST' });

		const { status, message = '' } = await res.json();

		if (status) {
			return bot.postMessage(userData.channel, '大聲', params);
		}

		return bot.postMessage(
			userData.channel,
			'API 壞惹 找 peipei',
			Object.assign({}, params, {
				attachments: JSON.stringify([
					{
						author_name: message,
						color: 'danger',
					},
				]),
			}),
		);
	},
	async down(userData) {
		const res = await fetch(`${API_ENDPOING}/api/youtube/down`, { method: 'POST' });

		const { status, message = '' } = await res.json();

		if (status) {
			return bot.postMessage(userData.channel, '小聲', params);
		}

		return bot.postMessage(
			userData.channel,
			'API 壞惹 找 peipei',
			Object.assign({}, params, {
				attachments: JSON.stringify([
					{
						author_name: message,
						color: 'danger',
					},
				]),
			}),
		);
	},
	async next(userData) {
		const res = await fetch(`${API_ENDPOING}/api/youtube/next`, { method: 'POST' });

		const { status, message = '' } = await res.json();

		if (status) {
			return bot.postMessage(userData.channel, '下一首', params);
		}

		return bot.postMessage(
			userData.channel,
			'API 壞惹 找 peipei',
			Object.assign({}, params, {
				attachments: JSON.stringify([
					{
						author_name: message,
						color: 'danger',
					},
				]),
			}),
		);
	},
	async quit(userData) {
		const res = await fetch(`${API_ENDPOING}/api/youtube/quit`, { method: 'POST' });

		const { status, message = '' } = await res.json();

		if (status) {
			return bot.postMessage(userData.channel, '結束', params);
		}

		return bot.postMessage(
			userData.channel,
			'API 壞惹 找 peipei',
			Object.assign({}, params, {
				attachments: JSON.stringify([
					{
						author_name: message,
						color: 'danger',
					},
				]),
			}),
		);
	},
	else(userData) {
		bot.postMessage(userData.channel, '你打錯字了!!還是你想跟我聊天？', params);
	},
};
