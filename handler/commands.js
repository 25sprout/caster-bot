const fetch = require('node-fetch');
const FormData = require('form-data');

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

		await bot.postMessage(userData.channel, `好的馬上為你加入 ${commands[0]} 請稍等`, params);

		const { members } = await bot.getUsers();

		const [user] = members.filter(member => member.id === userData.user);

		const formData = new FormData();

		formData.append('email', user.profile.email);
		formData.append('name', user.name);
		formData.append('slack_id', user.id);

		const res = await fetch(`${API_ENDPOING}/api/youtube/create/${commands[0]}`, {
			method: 'POST',
			body: formData,
		});

		const { status, message = '', data: { snippet } } = await res.json();

		if (status) {
			const songTitle = typeof snippet !== 'undefined' ? snippet.title : commands[0];

			return bot.postMessage(userData.channel, `已加入 ${songTitle}`, params);
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
	async search(userData, commands) {
		if (commands.length === 0) {
			return bot.postMessage(userData.channel, '你壞壞', params);
		}

		const keyword = commands.join(' ');

		await bot.postMessage(userData.channel, `好的馬上為你搜尋 ${keyword} 請稍等`, params);

		const { members } = await bot.getUsers();

		const [user] = members.filter(member => member.id === userData.user);

		const formData = new FormData();

		formData.append('email', user.profile.email);
		formData.append('name', user.name);
		formData.append('slack_id', user.id);

		const res = await fetch(`${API_ENDPOING}/api/youtube/search/${keyword}`, {
			method: 'POST',
			body: formData,
		});

		const { status, message = '', data: { snippet } } = await res.json();

		if (status) {
			const songTitle = typeof snippet !== 'undefined' ? snippet.title : keyword;

			return bot.postMessage(userData.channel, `已加入 ${songTitle}`, params);
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

			const index = playlist.findIndex(e => e.id === pointer);

			const startPointer = index > 3 ? index - 3 : 0;
			const endPointer = index + 3 > playlist.length ? playlist.length : index + 3;

			return bot.postMessage(
				userData.channel,
				'',
				Object.assign({}, params, {
					attachments: JSON.stringify(
						playlist.slice(startPointer, endPointer).map(item => ({
							color: item.id === pointer ? '#3C6E71' : '#D9D9D9',
							author_name: item.youtube_id,
							text: `歌名： *${item.name}*`,
							mrkdwn_in: ['text'],
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
			return bot.postMessage(userData.channel, `好的，馬上為你刪除 ${commands[0]}`, params);
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
		bot.postMessage(
			userData.channel,
			'你打錯字了!!還是你想跟我聊天？溫馨小提醒想查指令可以打 caster help 喔！',
			params,
		);
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
			return bot.postMessage(userData.channel, '好的，馬上為你暫停/播放');
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
			return bot.postMessage(userData.channel, '好的，馬上為你轉大聲', params);
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
			return bot.postMessage(userData.channel, '好的，馬上為你轉小聲', params);
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
			return bot.postMessage(userData.channel, '好的，馬上為你播放下一首', params);
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
		bot.postMessage(
			userData.channel,
			'你打錯字了!!還是你想跟我聊天？溫馨小提醒想查指令可以打 caster help 喔！',
			params,
		);
	},
	help(userData) {
		return bot.postMessage(
			userData.channel,
			'',
			Object.assign({}, params, {
				attachments: JSON.stringify([
					{
						color: '#353535',
						author_name:
							'僕人點播機在此為您服務，在頻道裡點歌請加上 caster 我還會理你喔～私訊只要下以下指令就可以了',
						text: `- *list add {Youtube ID}* 加入一首歌的 youtube id
- *list search {keyword}* 自動搜尋關鍵字，並加入搜尋結果的第一首歌
- *list show* 列出目前歌曲前後五首歌曲
- *list delete* {Youtube ID} 刪除一首歌
- *space* 暫停/播放
- *up* 大聲
- *down* 小聲
- *next* 下一首
- *help* 指令列表`,
						mrkdwn_in: ['text'],
					},
				]),
			}),
		);
	},
};
