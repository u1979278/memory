

function phaser_game(){
	loadpage("phasergame.html");
}
function phaser_game2(){
	loadpage("phasergame2.html");
}
function exit (){
	if (name != ""){
		alert("Leaving " + name + "'s game");
	}
	name = "";
	loadpage("./index.html")
}
function options(){
	loadpage("./html/options.html");
}
function game(){
	loadpage("./html/game.html");
}
function score(){
	loadpage("./html/score.html");
}
function load_classic(){
	loadpage("./html/load.html");
}
function load_survival(){
	loadpage("./html/load2.html");
}
function menu_load(){
	loadpage("./html/loadmenu.html");
}
