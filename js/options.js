var options = function(){
	var options_data = {
		cards:2, dificulty:"hard"
	};
	var load = function(){
		var json = localStorage.getItem("config");
		if (json)
			options_data = JSON.parse(json);
		else{
			options_data.cards = 2;
			options_data.dificulty = "hard";
		}
	};
	var save = function(){
		localStorage.setItem("config", JSON.stringify(options_data));
	};
	load();
	console.log(options_data);
	var vue_instance = new Vue({
		el: "#options_id",
		data: {
			num: 2,
			dificulty: "normal"
		},
		created: function(){
			this.num = options_data.cards;
			this.dificulty = options_data.dificulty;
		},
		watch: {
			num: function(value){
				if (value < 2)
					this.num = 2;
				else if (value > 4)
					this.num = 4;

			}
		},
		methods: {
			discard: function(){
				this.num = options_data.cards;
				this.dificulty = options_data.dificulty;
			},
			save: function(){
				options_data.cards = this.num;
				options_data.dificulty = this.dificulty;
				save();
				loadpage("../index.html");
			}
		}
	});
	return {
		getOptionsString: function (){
			return JSON.stringify(options_data);
		},
		getNumOfCards: function (){
			return options_data.cards;
		},
		getDificulty: function (){
			return options_data.dificulty;
		}
	};
}();
