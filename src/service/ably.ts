import Ably from 'ably/promises'

export default class AblyService {
	private static _ably: Ably.Realtime | null = null
	constructor() {}

	static init(token: string) {
		console.log('key', token)
		this._ably = new Ably.Realtime({ token: token })
	}

	static get ably() {
		return this._ably
	}

	static async publish(channel: string, message: any) {
		const pub = this._ably?.channels.get(channel)
		await pub?.publish('message', message)
	}

	static async subscribe(channel: string, callback: (message: any) => void) {
		const sub = this._ably?.channels.get(channel)
		sub?.subscribe('message', callback)
	}
}
