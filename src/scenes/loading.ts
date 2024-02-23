export default class LoadingScene extends Phaser.Scene {
	constructor() {
		super('loading-scene')
	}

	preload() {
		this.load.atlas('red-lion', 'assets/red_lion.png', 'assets/red_lion.json')
	}

	create() {
		this.scene.start('main-scene')
	}
}
