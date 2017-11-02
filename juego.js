var bg, doll, dollPoder, estrella, estrellas, poder, reloj, level, audioReloj, txtLvel, relojAct=false, audioPoder, intervalPoder=10, intervalReloj=20, poderAct=false, timerCoin, salto, flechas, jumpTimer=0, piso, pisos, timer, inicia=false, agua, audioSalto, audioCoin, putos, txtPuntos, dollVelocidad=300, pisoVelocidad=100;

var Juego = {

	preload : function(){
		juego.load.image('bg', 'assets/sprites/fondo2.png');
		juego.load.image('plataforma', 'assets/sprites/plataforma1.png');
		juego.load.spritesheet('personaje', 'assets/sprites/doll.png', 34, 78);
		juego.load.spritesheet('personajePoder', 'assets/sprites/dollPoder.png', 34, 78);
		juego.load.spritesheet('estrellas', 'assets/sprites/estrellas.png', 35, 32);
		juego.load.spritesheet('poder', 'assets/sprites/poder.png', 45, 44);
		juego.load.image('reloj', 'assets/sprites/toxico.png', 24, 24);
		juego.load.image('agua', 'assets/sprites/agua.png');
		juego.load.audio('salto', 'assets/audio/jump.wav');
		juego.load.audio('coin', 'assets/audio/coin.wav');
		juego.load.audio('audioPoder', 'assets/audio/poder.wav');
		juego.load.audio('audioReloj', 'assets/audio/reloj.wav');
		juego.forceSingleUpdate = true;
	},

	create : function(){
		juego.physics.startSystem(Phaser.Physics.ARCADE);

		juego.world.setBounds(0, 0, 370, 540);
		bg = juego.add.tileSprite(0, 0, 370, 550, 'bg');
		agua = juego.add.tileSprite(0, 480, 370, 80, 'agua');

		flechas = juego.input.keyboard.createCursorKeys();

		doll = juego.add.sprite(juego.width/2, 0, 'personaje');
		doll.anchor.setTo(0.5);
		doll.scale.setTo(1, 0.8);
		doll.frame = 0;
		doll.animations.add('meneo', [0,1], 5, true);
		juego.physics.arcade.enable(doll);
		doll.body.gravity.y = 1600;
		doll.body.collideWorldBounds=true;
		
		audioSalto = juego.add.audio('salto');
		audioCoin = juego.add.audio('coin');
		audioPoder = juego.add.audio('audioPoder');
		audioReloj = juego.add.audio('audioReloj');
	
		salto = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		salto.onDown.add(this.saltar, this);

		pisos = juego.add.group();
		pisos.enableBody = true;
		pisos.createMultiple(20, 'plataforma');
		

		estrella = juego.add.group();
		estrella.enableBody = true;
		juego.physics.arcade.enable(estrella);

		puntos = 0;
		level = 1;
		txtPuntos = juego.add.text(10, 10, "coins:0", {font:"28px Arial", fill:"#FFF"});
		//txtLvel = juego.add.text(250, 10, "Level:1", {font:"28px Arial", fill:"#FFF"});

		juego.time.events.add(100, this.crearGurpoPlataformas, this);
		timer = juego.time.events.loop(2100, this.crearGurpoPlataformas, this);
		timerCoin = juego.time.events.loop(1500, this.crearGrupoEstrellas, this);

		
	},

	update : function(){
		if(doll.body.blocked.down === true){
			juego.time.events.add(100, this.tocaFondo, this);
			bg.tilePosition.y -=1;
			inicia = false;
			relojAct = false;
			poderAct = false;
			this.state.start('GameOver');
		}else{
			//si esta vivo

			bg.tilePosition.y +=1;
			agua.tilePosition.x -=1;
			//estrella.y +=1.40;

			if(flechas.right.isDown){
				doll.body.velocity.x =dollVelocidad;
				doll.animations.play('meneo');
				doll.scale.setTo(1, 0.8);
			}else if(flechas.left.isDown){
				doll.body.velocity.x =-dollVelocidad;
				doll.scale.setTo(-1, 0.8);
				doll.animations.play('meneo');
				
			}else{
				doll.body.velocity.x =0;
				doll.animations.stop(null, true);//detiene movimiento camina -> menea
			}


			//aparece moneda de poder 
			if( (puntos == intervalPoder) && (poderAct == false)){
				this.crearPoder();
				poderAct = true;
				intervalPoder = puntos + this.randomNumber(20,40);//renuvea el intevalo de aparece poder			
				//console.log(intervalPoder);
			}else if(poderAct == true){
				this.borraPoder(poder, doll);
			}
			
			//aparece moneda de reloj 
			if( (puntos == intervalReloj) && (relojAct == false)){
				this.crearReloj();
				relojAct = true;
				intervalReloj = puntos + this.randomNumber(15,30);//renuvea el intevalo de aparece poder			
				//console.log(intervalReloj);
			}else if(relojAct == true){
				reloj.angle +=15;
				this.borraReloj(poder, doll);
			}

			if(puntos == level*100){
				level += 1;
				txtLvel.text = "Level:"+level;
			}

			juego.world.bringToTop(agua);// imagen agua al frente de todo
			juego.physics.arcade.collide(doll, pisos, this.evitaBug);//colision
			
			//come estrella
			juego.physics.arcade.overlap(estrella, doll, this.comeEstrella, null, this);

			//come poder
			juego.physics.arcade.overlap(poder, doll, this.comePoder, null, this);

			//come reloj
			juego.physics.arcade.overlap(reloj, doll, this.comeReloj, null, this);
		}
	},

	saltar:  function(){
		if(juego.time.now > jumpTimer){
			doll.body.velocity.y -= 1000;
			jumpTimer = juego.time.now + 550;
			audioSalto.play();
		}
	},

	crearEstrella : function(x, y){
		estrella.create(x, y, 'estrellas', 0);
		estrella.callAll('animations.add', 'animations', 'girar', [0,1,2,3,4,5], 10, true);//crea animacion/iteracion
		estrella.callAll('animations.play', 'animations', 'girar');//play animacion
	},

	crearGrupoEstrellas :  function(){
		var rnd = Math.floor(Math.random()*4);
		for(var i = 0; i < rnd; i++){
			var rndX = juego.world.randomX;
			var lmtX = juego.width - 30;
			if(rndX < lmtX){
				this.crearEstrella(rndX,juego.world.randomY/4);
			}
		}
	},

	crearPlataforma : function(x, y){
		piso = pisos.getFirstDead();
		piso.reset(x, y);
		piso.body.velocity.y +=pisoVelocidad;
		piso.checkWorldBounds = true;
		piso.outOfBoundsKill = true; 
		piso.body.immovable = true;
	
	},

	crearGurpoPlataformas : function(){
		var yInicia=0; 
		var hueco = Math.floor(Math.random()*4);
		if(inicia == false){ 
			yInicia = 80;
			hueco = 5;
			inicia=true;
		} 
		for(var i = 0; i < 4; i++){
			if(i != hueco ){
				this.crearPlataforma(i*92, yInicia);
			}
		}
	},
	
	tocaFondo : function(){
		if(doll.alive == false){
			return;
		}else{
			doll.alive = false;
			juego.time.events.remove(timer);
			pisos.forEachAlive(function(t){
				t.body.velocity.y = 0;
			}, this);
		}
	}, 

	 comeEstrella :  function(doll, estrella){
	 	estrella.kill();
	 	audioCoin.play();
	 	puntos += 1;
	 	txtPuntos.text = "coins:"+puntos;
	 },

	 evitaBug :  function(){
	 	 doll.body.position.y -=1;//evita que el personaje se tranque contra las secciones de plataforma (bug raro)
	 }, 

	 crearPoder : function(){
	 	var lmtX = juego.width - 30;
	 	var lmtY = juego.height - 100;
	 	var rndX = this.randomNumber(10, lmtX);//q no quede en borde de pantalla
	 	var rndY = this.randomNumber(10, lmtY);
		 	poder = juego.add.sprite(rndX, rndY, 'poder');
			poder.scale.setTo(0.5);
			poder.anchor.setTo(0.5);
			juego.physics.arcade.enable(poder);
			poder.frame = 0;
			poder.animations.add('reflejo', [0,1,2,3,4], 10, true);
			poder.animations.play('reflejo');
	 },

	 comePoder : function(poder, doll){
	 	poder.kill();
	 	doll.loadTexture('personajePoder', 0);
	 	poderAct = false;
	 	dollVelocidad=800;
	 	audioPoder.play();
	 	setTimeout(function(){
	 		doll.loadTexture('personaje', 0);
	 		dollVelocidad=300;
	 	},5000);
	 	
	 },

	 borraPoder : function(poder, doll){
	 	setTimeout(function(){
	 		poder.kill();
	 		poderAct = false;
	 	},8000);
	 },

	 crearReloj : function(x, y){
	 	var lmtX = juego.width - 30;
	 	var lmtY = juego.height - 100;
	 	var rndX = this.randomNumber(10, lmtX);//q no quede en borde de pantalla
	 	var rndY = this.randomNumber(10, lmtY);
	 		reloj = juego.add.sprite(rndX, rndY, 'reloj');
	 		reloj.anchor.setTo(0.5);
			juego.physics.arcade.enable(reloj);
	 },

	 comeReloj : function(reloj, doll){
	 	reloj.kill();
	 	relojAct = false;
	 	pisoVelocidad=65;
	 	audioReloj.play();
	 	setTimeout(function(){
	 		doll.loadTexture('personaje', 0);
	 		pisoVelocidad=100;
	 	},5000);
	 },

	 borraReloj : function(poder, doll){
	 	setTimeout(function(){
	 		reloj.kill();
	 		relojAct = false;
	 	},8000);
	 },
	 randomNumber : function(minimum, maximum){
    	return Math.round( Math.random() * (maximum - minimum) + minimum);
	}

};
