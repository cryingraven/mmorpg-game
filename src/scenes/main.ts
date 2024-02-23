import WebService from '../service/web'
import Player from '../classes/player'
import { AblyLogin, UserLogin } from '../interfaces/user'
import AblyService from '../service/ably'
import { JoinMessage, MoveMessage } from 'src/interfaces/message'

export class MainScene extends Phaser.Scene {
	private player: Player | null = null
	private others: Map<string, Player> = new Map()
	constructor() {
		super('main-scene')
	}

	create() {
		this.login()
	}

	update() {
		if (this.player) {
			this.player.update()
		}

		this.others.forEach((player) => {
			player.update()
		})
	}

	private initCamera(): void {
		if (this.player) {
			this.cameras.main.setSize(this.game.scale.width, this.game.scale.height)
			this.cameras.main.startFollow(this.player, true, 0.09, 0.09)
			this.cameras.main.setZoom(1.5)
		}
	}

	private async login() {
		try {
			const response = await WebService.get('/auth/login')
			const userResponse = response.data as UserLogin

			this.player = new Player(userResponse.user.user_id, this, 100, 100, false)
			this.initCamera()

			//init ably
			const responseAbly = await WebService.post('/auth/ably-token', {
				auth_token: userResponse.token,
			})
			const ablyToken = (responseAbly.data as AblyLogin).ably_token
			AblyService.init(ablyToken)

			AblyService.subscribe('join', (message) => {
				const joinMessage = message.data as JoinMessage

				if (joinMessage.user_id !== userResponse.user.user_id) {
					if (!this.others.has(joinMessage.user_id)) {
						const other = new Player(
							joinMessage.user_id,
							this,
							joinMessage.x,
							joinMessage.y,
							true
						)
						this.others.set(joinMessage.user_id, other)
					} else {
						const other = this.others.get(joinMessage.user_id)
						if (other) {
							other.setPosition(joinMessage.x, joinMessage.y)
						}
					}

					if (this.player) {
						AblyService.publish('join-received', {
							user_id: userResponse.user.user_id,
							x: this.player.x,
							y: this.player.y,
						})
					}

					this.subscribeToMove(joinMessage.user_id)
				}
			})

			AblyService.subscribe('join-received', (message) => {
				const joinMessage = message.data as JoinMessage

				if (joinMessage.user_id !== userResponse.user.user_id) {
					if (!this.others.has(joinMessage.user_id)) {
						const other = new Player(
							joinMessage.user_id,
							this,
							joinMessage.x,
							joinMessage.y,
							true
						)
						this.others.set(joinMessage.user_id, other)
					} else {
						const other = this.others.get(joinMessage.user_id)
						if (other) {
							other.setPosition(joinMessage.x, joinMessage.y)
						}
					}

					this.subscribeToMove(joinMessage.user_id)
				}
			})

			AblyService.publish('join', {
				user_id: userResponse.user.user_id,
				x: this.player.x,
				y: this.player.y,
			})
		} catch (e) {
			console.log(e)
		}
	}

	subscribeToMove(userId: string) {
		AblyService.subscribe(userId, (message) => {
			const moveMessage = message.data as MoveMessage
			if (moveMessage.user_id !== this.player?.player_name) {
				const other = this.others.get(moveMessage.user_id)
				if (other) {
					if(moveMessage.direction === 'stop') {
            other.stopMoving(
              moveMessage.x,
              moveMessage.y
            )
          } else {
            other.move(moveMessage.direction)
          }
				}
			}

			console.log(moveMessage)
		})
	}
}
