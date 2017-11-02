var GameOver = {

	preload : function(){
		juego.stage.backgroundColor = '#FFF';
		juego.load.image('boton', 'assets/sprites/boton.png');
	},

	create :  function(){
		var boton = this.add.button(juego.width/2, juego.height/2, 'boton', this.iniciarJuego, this);
		boton.anchor.setTo(0.5);

		var txtIniciar = juego.add.text(juego.width/2, juego.height/2 -55, "Game Over", {font: "bold 30px sans-serif", fill:"black", align:"center"});
		txtIniciar.anchor.setTo(0.5);

		if(puntos == -1)puntos = 0;
		var txtTitulo = juego.add.text(juego.width/2, juego.height/2 -100, "Coins: "+puntos.toString(), {font: "bold 26px sans-serif", fill:"black", align:"center"});
		//var txtLevel = juego.add.text(juego.width/2, juego.height/2 -100, "Level: "+level.toString(), {font: "bold 24px sans-serif", fill:"black", align:"center"});
		txtTitulo.anchor.setTo(0.5);
		//txtLevel.anchor.setTo(0.5);
	},

	iniciarJuego : function(){
		this.state.start('Juego');
	}

};