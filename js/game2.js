function barrejar(array) {
	let currentIndex = array.length,  randomIndex;
	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
}

load_param();

var cartesGirades = [];
var cartesEnJoc = [];
let a_partida = null;
if (sessionStorage.idPartida && localStorage.partides2){
	let partides = JSON.parse(localStorage.partides2);
	if (sessionStorage.idPartida < partides.length)
		a_partida = partides[sessionStorage.idPartida];

}

class GameScene extends Phaser.Scene{
constructor (){
        if (a_partida) {
            super('GameScene');
            this.cards = null;
            this.score = a_partida.score;
            this.correct = a_partida.correct;
            this.firstClick = a_partida.firstClick;
            this.numbercards = a_partida.numbercards;
            this.level = a_partida.level;
            this.points = a_partida.points;
            this.cardsPlaying = a_partida.cardsPlaying;
            this.girades = a_partida.girada;

        }else{
		        super('GameScene');
		        this.cards = null;
		        this.firstClick = null;
		        this.score = 100;
		        this.level = 1;
		        this.points = 0;
		        this.correct = 0;
		        this.numbercards = 2;
		        this.cardsPlaying = [];
		        this.girades = [];
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
  }

create () {
    let cartes = ['co', 'cb', 'sb', 'so', 'tb', 'to'];
    if(!sessionStorage.idPartida) {
      barrejar(cartes);
      for (var j = 0; j < this.numbercards; j++) {
          this.cardsPlaying.push(cartes[j]);
          this.cardsPlaying.push(cartes[j]);
      }
      barrejar(this.cardsPlaying);
    }
    this.cameras.main.setBackgroundColor(0x942275);
    var button = this.add.text(400, 550, 'Guardar Partida')
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({ backgroundColor: '#111' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', ()=>{
         this.save_game2();
    });
    let pos = 250;
    this.cards = this.physics.add.staticGroup();
    if(sessionStorage.idPartida) {
            let cartesTauler = this.cardsPlaying.length;
            let eliminat = false;
            let j = 0;
            let k = 0;
            for (var n = 0; n < this.numbercards * 2; n++) {
                this.add.image(pos, 300, this.cardsPlaying[n]);
                pos += 100;
            }
            pos = 250;
            var arrayP = [];
            while(k<cartesTauler) {
                j = 0;
                while(!eliminat && j<this.girades.length){
                    if(this.girades[j] === this.cardsPlaying[k]) {
                        eliminat = true;
                        arrayP.push(k);
                    }
                    else j += 1;
                }
                if(!eliminat || this.girades.length===0) this.cards.create(pos, 300, 'back');
                else this.girades.splice(j,1);
                eliminat = false;
                pos+=100;
                k+=1;
            }
            var cartesSuport = [];
            for (var l = 0;l < this.numbercards*2;l++){
                if(!arrayP.includes(l)) {
									cartesSuport.push(this.cardsPlaying[l]);
								}
            }
            this.cardsPlaying = cartesSuport.slice();
        }else{
            for (var k = 0; k < this.numbercards * 2; k++) {
                this.add.image(pos, 300, this.cardsPlaying[k]);
                this.cards.create(pos, 300, 'back');
                pos += 100;
            }
        }
        sessionStorage.clear();
        scoreText = this.add.text(16,16, 'Score: ' + this.points, { fontsize: '56 px',fill: '#000',fontStyle: 'bold'});
        let i = 0;
        this.cards.children.iterate((card)=>{
            card.card_id = this.cardsPlaying[i];
            i++;
            card.setInteractive();
            card.on('pointerup', () => {
                card.disableBody(true,true);
                this.girades.push(card.card_id);
                if (this.firstClick){
                    if (this.firstClick.card_id !== card.card_id){
                        this.score -= this.level*3;
                        this.time.delayedCall(1000, () =>
                            {
                                card.enableBody(false, 0, 0, true, true);
                                this.firstClick.enableBody(false, 0, 0, true, true);
                                this.girades.pop();
                                this.girades.pop();
                                this.firstClick = null;
                            },
                            [],this);
                        if (this.score <= 0){
                            alert("GAME OVER");
                            this.local_save();
                        }
                    }
                    else{
                        this.correct++;
                        if (this.correct >= this.numbercards){
                            var numOfPoints = this.score;
                            if(this.level >= 4) var a = 3;
                            else if(this.level > 8) var a = 4;
                            else var a = 2;
                            alert("HAS GUANYAT AMB " + this.score + " PUNTS.");
                            this.scene.restart(this.cards = null,
                            this.firstClick = null,
                            this.score = 100,
                            this.level += 1,
                            this.points += numOfPoints,
                            this.correct = 0,
                            this.numbercards = a,
                                this.cardsPlaying = [],
                                this.girades = []);
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
update () {}

local_save(){
    let puntuacio = this.points;
    let aPartides = [];
    if(localStorage.partides){
        aPartides = JSON.parse(localStorage.partides);
        if(!Array.isArray(aPartides)) aPartides = [];
    }
    aPartides.push(puntuacio);
    localStorage.partides = JSON.stringify(aPartides);
    loadpage("../index.html");
}
save_game2(){
    let joc = {
        score: this.score,
        correct: this.correct,
        firstClick: this.firstClick,
        cardsPlaying: this.cardsPlaying,
        cards: null,
        numbercards: this.numbercards,
        difficulty: this.difficulty,
        girada: this.girades,
        level: this.level,
        points: this.points
    };
    let aPartides = [];
    if(localStorage.sav2){
        aPartides = JSON.parse(localStorage.sav2);
        if(!Array.isArray(aPartides)) aPartides = [];
    }
    aPartides.push(joc);
    localStorage.sav2 = JSON.stringify(aPartides);
    loadpage("../index.html");
}
