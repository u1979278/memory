

var load_obj = function(){
    var vue_instance = new Vue({
        el: "#score",
        data: {
            partidesguardades: []
        },
        created: function(){
            let partides = [];
            if(localStorage.partides){
                partides = JSON.parse(localStorage.partides);
                if(!Array.isArray(partides)) partides = [];
            }
            partides.sort(function(a, b){return b-a});
            this.partidesguardades = partides;
        }
    });
    return {};
}();
