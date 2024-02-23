import AblyService from '../service/ably'
import { Actor } from './actor'

export default class Player extends Actor {
	private playerName: string | null = null
	private text: Phaser.GameObjects.Text | null = null
	private isOthers = false
	private isStartMove = false
	private direction = 'stop'
	constructor(
		name: string,
		scene: Phaser.Scene,
		x: number,
		y: number,
		isOthers: boolean
	) {
		super(scene, x, y, 'red-lion', 'idle-0')
		this.playerName = name
		this.text = this.scene.add.text(
			x - 8 * Math.round(this.playerName.length / 2),
			y + 40,
			this.playerName,
			{
				fontSize: '14px',
				color: 'white',
			}
		)

		this.init()
		this.isOthers = isOthers
	}
	private init(): void {
		this.scene.anims.create({
			key: 'idle',
			frames: this.scene.anims.generateFrameNames('red-lion', {
				prefix: 'idle-',
				end: 7,
			}),
			frameRate: 8,
		})

		this.scene.anims.create({
			key: 'run',
			frames: this.scene.anims.generateFrameNames('red-lion', {
				prefix: 'walk-',
				end: 7,
			}),
			frameRate: 8,
		})

		this.scene.anims.create({
			key: 'left',
			frames: this.scene.anims.generateFrameNames('red-lion', {
				prefix: 'left-',
				end: 7,
			}),
			frameRate: 8,
		})

		this.scene.anims.create({
			key: 'right',
			frames: this.scene.anims.generateFrameNames('red-lion', {
				prefix: 'right-',
				end: 7,
			}),
			frameRate: 8,
		})

		this.scene.anims.create({
			key: 'up',
			frames: this.scene.anims.generateFrameNames('red-lion', {
				prefix: 'up-',
				end: 7,
			}),
			frameRate: 8,
		})
	}

	public update(): void {
		try {
			if (!this.isOthers) {
				this.getBody().setVelocity(0)
				if (this.scene && this.scene.input.keyboard) {
					if (this.scene.input.keyboard.addKey('W').isDown) {
						this.getBody().setVelocityY(-100)
						if (
							!this.isStartMove ||
							(this.isStartMove && this.anims.currentAnim?.key !== 'up')
						) {
							AblyService.publish(this.playerName || 'move', {
								direction: 'up',
								user_id: this.playerName,
							})
						}
						this.anims.play('up', true)
						this.isStartMove = true
					} else if (this.scene.input.keyboard.addKey('A').isDown) {
						this.getBody().setVelocityX(-100)
						if (
							!this.isStartMove ||
							(this.isStartMove && this.anims.currentAnim?.key !== 'left')
						) {
							AblyService.publish(this.playerName || 'move', {
								direction: 'left',
								user_id: this.playerName,
							})
						}
						this.anims.play('left', true)
						this.isStartMove = true
					} else if (this.scene.input.keyboard.addKey('D').isDown) {
						this.getBody().setVelocityX(100)
						if (
							!this.isStartMove ||
							(this.isStartMove && this.anims.currentAnim?.key !== 'run')
						) {
							AblyService.publish(this.playerName || 'move', {
								direction: 'right',
								user_id: this.playerName,
							})
						}
						this.anims.play('right', true)
						this.isStartMove = true
					} else if (this.scene.input.keyboard.addKey('S').isDown) {
						this.getBody().setVelocityY(100)
						if (
							!this.isStartMove ||
							(this.isStartMove && this.anims.currentAnim?.key !== 'run')
						) {
							AblyService.publish(this.playerName || 'move', {
								direction: 'down',
								user_id: this.playerName,
							})
						}
						this.anims.play('run', true)
						this.isStartMove = true
					} else {
						if (this.isStartMove) {
							AblyService.publish(this.playerName || 'move', {
								direction: 'stop',
								user_id: this.playerName,
								x: this.x,
								y: this.y,
							})
						}
						this.isStartMove = false
						this.anims.play('idle', true)
					}
				}
			} else {
				if (this.isStartMove) {
					if (this.direction == 'up') {
						this.getBody().setVelocityY(-50)
						this.anims.play('up', true)
					} else if (this.direction == 'down') {
						this.getBody().setVelocityY(50)
						this.anims.play('run', true)
					} else if (this.direction == 'left') {
						this.getBody().setVelocityX(-50)
						this.anims.play('left', true)
					} else if (this.direction == 'right') {
						this.getBody().setVelocityX(50)
						this.anims.play('right', true)
					} else {
						if (!this.anims.isPlaying) {
							this.isStartMove = false
							this.getBody().setVelocity(0)
						}
					}
				}
			}

			if (this.playerName) {
				this.text?.setPosition(
					this.x - 8 * Math.round(this.playerName.length / 2),
					this.y + 20
				)
			}
		} catch (e) {
			console.log(e)
		}
	}

	public move(direction: string): void {
		this.isStartMove = true
		this.direction = direction
		switch (direction) {
			case 'up':
				this.getBody().setVelocityY(-50)
				this.anims.play('up', true)
				break
			case 'down':
				this.getBody().setVelocityY(50)
				this.anims.play('run', true)
				break
			case 'left':
				this.getBody().setVelocityX(-50)
				this.anims.play('left', true)
				break
			case 'right':
				this.getBody().setVelocityX(50)
				this.anims.play('right', true)
				break
			default:
				this.anims.play('idle', true)
		}
	}

	public stopMoving(x: number, y: number): void {
		this.isStartMove = false
		this.getBody().setVelocity(0)
		this.x = x
		this.y = y
		this.anims.play('idle', true)
	}

	public get player_name(): string | null {
		return this.playerName
	}
}
