import { Game, Types } from 'phaser'
import { LoadingScene } from './scenes'
import { MainScene } from './scenes/main'
const gameConfig: Types.Core.GameConfig = {
	type: Phaser.WEBGL,
	parent: 'game',
	backgroundColor: '#aaaaaa',
	scale: {
		mode: Phaser.Scale.ScaleModes.NONE,
		width: 2000,
		height: 2000,
	},
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
		},
	},
	render: {
		antialiasGL: false,
		pixelArt: true,
	},
	callbacks: {
		postBoot: () => {
			window.sizeChanged()
		},
	},
	canvasStyle: `display: block; width: 100%; height: 100%;`,
	autoFocus: true,
	audio: {
		disableWebAudio: false,
	},
	scene: [LoadingScene, MainScene],
}

declare global {
	interface Window {
		sizeChanged: () => void
		game: Phaser.Game
	}
}

window.sizeChanged = () => {
	if (window.game.isBooted) {
		setTimeout(() => {
			window.game.scale.resize(window.innerWidth, window.innerHeight)
			window.game.canvas.setAttribute(
				'style',
				`display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`
			)
		}, 100)
	}
}
window.onresize = () => window.sizeChanged()

window.game = new Game(gameConfig)
