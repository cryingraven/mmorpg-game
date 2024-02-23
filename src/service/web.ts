import axios from 'axios'

export default class WebService {
	private static api = axios.create({
		baseURL: 'https://mmorpg-be.vercel.app',
	})
	constructor() {}

	public static async get(url: string) {
		return this.api.get(url)
	}

	public static async post(url: string, data: any) {
		return this.api.post(url, data, {
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}

	public static async uPost(url: string, data: any) {
		return this.api.put(url, data, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
	}

	public static async uGet(url: string) {
		return this.api.get(url, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
	}
}
