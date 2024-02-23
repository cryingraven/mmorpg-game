export interface JoinMessage {
	user_id: string
	x: number
	y: number
}

export interface MoveMessage {
	user_id: string
	direction: string
	x: number
	y: number
}
