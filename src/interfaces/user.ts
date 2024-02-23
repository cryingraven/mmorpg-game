export interface User {
	user_id: string
}

export interface UserLogin {
	user: User
	token: string
}

export interface AblyLogin {
	ably_token: string
}
