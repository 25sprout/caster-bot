const fetch = require('node-fetch');

const bot = require('../bot');

const params = {
	icon_emoji: ':speaker:',
};

const API_ENDPOING = 'http://192.168.1.55:8080';

const handlePlaylist = {
	start(data, commands) {
		bot.postMessage(data.channel, '開始播放', params);
	},
	async add(data, commands) {
		console.log(commands);
		const res = await fetch(`${API_ENDPOING}/api/youtube/${commands[0]}`);

		console.log(res.status);

		if (res.status === 200) {
			return bot.postMessage(data.channel, `加入 ${commands[0]}`, params);
		}

		return bot.postMessage(data.channel, 'API 壞惹 找 peipei', params);
	},
	async list(data, commands) {
		const res = await fetch(`${API_ENDPOING}/api/youtube`, { method: 'GET' });

		if (res.status === 200) {
			const { playlists } = await res.json();

			console.log(playlists);

			return bot.postMessage(
				data.channel,
				'',
				Object.assign({}, params, {
					attachments: JSON.stringify(
						playlists.map(item => ({
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

		return bot.postMessage(data.channel, 'API 壞惹 找 peipei', params);
	},
	async delete(data, commands) {
		const res = await fetch(`${API_ENDPOING}/api/youtube/${commands[0]}`, {
			method: 'DELETE',
		});

		if (res.status === 200) {
			return bot.postMessage(data.channel, `刪除 ${commands[0]}`, params);
		}

		return bot.postMessage(data.channel, 'API 壞惹 找 peipei', params);
	},
	loop(data, commands) {
		bot.postMessage(data.channel, '循環播放', params);
	},
	else(data) {
		bot.postMessage(data.channel, '你打錯字了!!還是你想跟我聊天？', params);
	},
};

module.exports = {
	playlist(data, commands) {
		if (commands.length > 0 && commands[0] in handlePlaylist) {
			const [command, ...otherCommands] = commands;
			handlePlaylist[command](data, otherCommands);
		} else {
			const [_, ...otherCommands] = commands;
			handlePlaylist.else(data, otherCommands);
		}
	},
	async space(data) {
		const res = await fetch(`${API_ENDPOING}/api/youtube/space`, { method: 'POST' });

		console.log(res);

		if (res.status === 200) {
			return bot.postMessage(data.channel, '暫停/播放', params);
		}

		return bot.postMessage(data.channel, 'API 壞惹 找 peipei', params);
	},
	async up(data) {
		const res = await fetch(`${API_ENDPOING}/api/youtube/up`, { method: 'POST' });

		console.log(res.status);

		if (res.status === 200) {
			return bot.postMessage(data.channel, '大聲', params);
		}

		return bot.postMessage(data.channel, 'API 壞惹 找 peipei', params);
	},
	async down(data) {
		const res = await fetch(`${API_ENDPOING}/api/youtube/down`, { method: 'POST' });

		console.log(res.status);

		if (res.status === 200) {
			return bot.postMessage(data.channel, '小聲', params);
		}

		return bot.postMessage(data.channel, 'API 壞惹 找 peipei', params);
	},
	next(data) {
		bot.postMessage(data.channel, '下一首', params);
	},
	async quit(data) {
		const res = await fetch(`${API_ENDPOING}/api/youtube/quit`, { method: 'POST' });

		console.log(res.status);

		if (res.status === 200) {
			return bot.postMessage(data.channel, '結束', params);
		}

		return bot.postMessage(data.channel, 'API 壞惹 找 peipei', params);
	},
	else(data) {
		bot.postMessage(data.channel, '你打錯字了!!還是你想跟我聊天？', params);
	},
};
