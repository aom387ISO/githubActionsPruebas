var startMenu = {
   firstClick: false,	//Condicion para que empiece el juego
   add: function(){
   	$("#gameplay-area").append('<div id="start-menu"></div>');
   		$(".bird").css({"top":210+"px"});
		bird.positionY = 210;
		environment.animationStart();
   },	//Para anadir el menu principal.
   remove: function(){
   	$("#start-menu").remove();
   	score.run = true;
   },	//Para eliminar el menu principal.
   restart: function(){
   	return this.firstClick = false
   },	//Para resetear la conicion firstClick.
};

var gameoverMenu = {
	add: function(){
		$("#gameplay-area").append('<div id="menu-gameover"><div id="scoreboard"><div id="scoreFinal"></div><div id="highScore"></div><div id="medal"></div></div><a href="#"><div id="replay"></div></a></div>');
	},	//Para anadir el menu Game Over con la puntuacion.
	remove: function(){
		$("#menu-gameover").remove();
	},	//Para eliminar el menu Game Over.
};

//Cuando haces el primer Click empieza el juego
function startGame(){
	$(document).on("click", function(){
     	if(!startMenu.firstClick){
     		startMenu.remove();
      		gameLoop = setInterval(mainloop, environment.fps);    //Actualiza la posicion del pajaro en cada frame
      		startMenu.firstClick = true;   		
     	};
   })
};

//Aparece un menu de Game Over
function menuGameOver(){
	finalScore();
	gameoverMenu.add();
	environment.stop(); //Para parar el setInterval
}

//Elimina todo del mapa cuando se ejecuta
function removeFromMap(){
	gameoverMenu.remove();
	environment.obstacleRemove();
	monster.remove();
	otherMonster.remove();
	banana.remove();
}

//Resetea todos los parametros al valor inicial
function resetAllParameters(){
	environment.gravity = 0.25;
	monster.velocityX = -6;
	monster.positionX = 1400;
	monster.positionY = -50;
	monster.addRandom = 0.999;
	otherMonster.velocityX = -6;
	otherMonster.positionX = 1400;
	otherMonster.positionY = -50;
	otherMonster.addRandom = 0.999;
	banana.velocityX = -4.05;
	banana.positionX = 1400;
	banana.positionY = -50;
	banana.addRandom = 0.75;
	environment.fallCondition = false;
	environment.obstacleCount = 119;
	score.init = 0;
	$("#points").html("0");
	inmune.have = false;
	sounds.oneHit = true;
};

//Reinicia el juego para volver a empezar
function restart(){
	removeFromMap();
	resetAllParameters();
	startMenu.add();

	//Pone firstClick en false instantes despues de añadir el menu
	//para evitar que se ejecute automaticamente al dar a replay
	setTimeout(function(){startMenu.firstClick = false;}, 1); 	
};