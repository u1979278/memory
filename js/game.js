
function barrejar(array) {
	let currentIndex = array.length,  randomIndex;
	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
}

var load_param = function (){
	var json = localStorage.getItem("config");
	if(json)
		options_game = JSON.parse(json);
	else{
		options_game.cards = 2;
		options_game.dificulty = "hard";
	}

}

load_param();

var cartesGirades = [];
var cartesEnJoc = [];

let a_partida = null;
if (sessionStorage.idPartida && localStorage.partides){
	let partides = JSON.parse(localStorage.partides);
	if (sessionStorage.idPartida < partides.length)
		a_partida = partides[sessionStorage.idPartida];
}

class GameScene extends Phaser.Scene {
constructor (){
		if (a_partida){
			super('GameScene');
			this.cards = null;
			this.score = a_partida.score;
			this.correct = a_partida.correct;
			this.firstClick = a_partida.firstClick;
			this.numbercards = a_partida.numbercards;
			this.difficulty = a_partida.difficulty;
		}
		else {
			super('GameScene');
			this.cards = null;
			this.score = 100;
			this.correct = 0;
			this.firstClick = null;
			this.numbercards = options_game.cards;
			this.difficulty = options_game.dificulty;
		}
}

preload (){
		this.load.image('back', '../resources/back.png');
		this.load.image('cb', '../resources/cb.png');
		this.load.image('co', '../resources/co.png');
		this.load.image('sb', '../resources/sb.png');
		this.load.image('so', '../resources/so.png');
		this.load.image('tb', '../resources/tb.png');
		this.load.image('to', '../resources/to.png');
		this.load.image('button','../resources/button.png');
}

create (){
		let cartes = ['co', 'cb','sb','so','tb','to'];

		sessionStorage.clear();
		cartesEnJoc = [];

		if(!a_partida) {
			barrejar(cartes);
			for (var j = 0; j < this.numbercards; j++) {
				cartesEnJoc.push(cartes[j]);
				cartesEnJoc.push(cartes[j]);
			}
			barrejar(cartesEnJoc);
		}
		else{
			cartesEnJoc = a_partida.cartesEJ;

		}
		var button = this.add.text(400, 550, 'Guardar Partida')
			.setOrigin(0.5)
			.setPadding(10)
			.setStyle({ backgroundColor: '#111' })
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', ()=>{
			     this.save_game();
			});

		this.cameras.main.setBackgroundColor(0x942275);

		let pos = 250;
		this.cards = this.physics.add.staticGroup();
         if(a_partida) {
			 	 cartescartesGirades = a_partida.girada;
				 let cartesTauler = cartesEnJoc.length;
				 let eliminat = false;
				 let j = 0;
			     let k = 0;
			 for (var n = 0; n < this.numbercards * 2; n++) {
				 this.add.image(pos, 300, cartesEnJoc[n]);
				 pos += 100;
			 }
				 pos = 250;

             var arrayPartides = [];
			 while(k<cartesTauler) {
				 while(!eliminat && j<cartesGirades.length){
					 if(cartesGirades[j] === cartesEnJoc[k]) {
						 eliminat = true;
						 arrayPartides.push(k);
					 }
					 else j += 1;
				 }
				 if(!eliminat || cartesGirades.length===0) this.cards.create(pos, 300, 'back');
				 else cartesGirades.splice(j,1);
				 eliminat = false;
				 pos+=100;
				 k+=1;
			 }
			 var cartesSuport = [];
			 for (var l = 0;l < this.numbercards*2;l++){
				 if(!arrayPartides.includes(l)) {
					 cartesSuport.push(cartesEnJoc[l]);
				 }
			 	}
       cartesEnJoc = cartesSuport.slice();
		 }

		 else{
			 for (var k = 0; k < this.numbercards * 2; k++) {
				 this.add.image(pos, 300, cartesEnJoc[k]);
				 this.cards.create(pos, 300, 'back');
				 pos += 100;
			 }
		 }
		let i = 0;
		this.cards.children.iterate((card)=>{
			card.card_id = cartesEnJoc[i];
			i++;
			card.setInteractive();
			card.on('pointerup', () => {
				card.disableBody(true,true);
				cartesGirades.push(card.card_id);
				if (this.firstClick){
					if (this.firstClick.card_id !== card.card_id){
						if(this.difficulty === "easy") this.score -= 10;
						else if (this.difficulty === "normal") this.score -= 20;
						else this.score -= 50;
						this.time.delayedCall(1000, () =>
						{
							card.enableBody(false, 0, 0, true, true);
							this.firstClick.enableBody(false, 0, 0, true, true);
							cartesGirades.pop();
							cartesGirades.pop();
							this.firstClick = null;
						},
							[],this);
						if (this.score <= 0){
							alert("GAME OVER");
							loadpage("../index.html");
						}
					}
					else{
						this.correct++;
						if (this.correct >= this.numbercards){
							alert("HAS GUANYAT AMB " + this.score + " PUNTS.");
							loadpage("../");
						}
						this.firstClick = null;
					}
				}
				else{
					this.firstClick = card;
				}
			}, card);
		});
	}

update (){	}

save_game() {
		let joc = {
			score: this.score,
			correct: this.correct,
			firstClick: this.firstClick,
			cartesEJ: cartesEnJoc,
			cards: null,
			numbercards: this.numbercards,
			difficulty: this.difficulty,
			girada: cartesGirades
		};
		let a_partides = [];
		if(localStorage.partides){
			a_partides = JSON.parse(localStorage.partides);
			if(!Array.isArray(a_partides)) a_partides = [];
		}
		a_partides.push(joc);
		localStorage.partides = JSON.stringify(a_partides);
		loadpage("../index.html");
	}
}
