// import { Game } from './game.js'
var game = new Phaser.Game(config);

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    scene: [GameScene],
    parent: 'game_area',
	   physics: {
		     default: 'arcade',
		       arcade: {
			          gravity: {y: 0},
			          debug: false
		}
	},
};
