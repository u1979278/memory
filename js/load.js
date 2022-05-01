
var load_classic = function(){
	var vue_instance = new Vue({
		el: "#partidesguardades_classic",
		data: {
			partidesguardades: []
		},
		created: function(){
			let partides = [];
			if(localStorage.partides){
				partides = JSON.parse(localStorage.partides);
				if(!Array.isArray(partides)) partides = [];
			}
			this.partidesguardades = partides;
		},
		methods: {
			load: function(i){
				sessionStorage.idPartida = i;
				loadpage("../html/phasergame.html");
			}
		}
	});
	return {};
}();


var load_survival = function(){
	var vue_instance = new Vue({
		el: "#partidesguardades_survival",
		data: {
			partidesguardades: []
		},
		created: function(){
			let partides = [];
			if(localStorage.partides2){
				partides = JSON.parse(localStorage.partides2);
				if(!Array.isArray(partides)) partides = [];
			}
			this.partidesguardades = partides;
		},
		methods: {
			load: function(i){
				sessionStorage.idPartida = i;
				loadpage("../html/phasergame2.html");
			}
		}
	});
	return {};
}();
