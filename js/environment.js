/**
 * @namespace environment
 * @description Objeto que contiene la configuración del entorno del juego
 */
var environment = {
  /** @type {number} Constante de gravedad */
  gravity: 0.25,
  /** @type {number} FPS del juego (60fps) */
  fps: 1000 / 60,
  /** @type {boolean} Indica si el pájaro está cayendo */
  fallCondition: false,
  /** @type {number} Contador para generar obstáculos */
  obstacleCount: 119,
  /** @type {number} Altura de los obstáculos */
  obstacleHeight: 200,

  /**
   * @function obstacleCountStop
   * @memberof environment
   * @description Detiene el generador de obstáculos
   * @returns {number} Valor que detiene el contador
   */
  obstacleCountStop: function () {
    return (this.obstacleCount = 121);
  }, //Pausa el generador de obstaculos.
  animationStop: function () {
    $(".animated").css({ "-webkit-animation-play-state": "paused" });
    $(".animated").css({ "-moz-animation-play-state": "paused" });
    $(".animated").css({ "-o-animation-play-state": "paused" });
  }, //funcion para desactivar animaciones css.
  animationStart: function () {
    $(".animated").css({ "-webkit-animation-play-state": "running" });
    $(".animated").css({ "-moz-animation-play-state": "running" });
    $(".animated").css({ "-o-animation-play-state": "running" });
  }, //funcion para activar animaciones css
  stop: function () {
    clearInterval(gameLoop);
  }, //Para el setInterval.
  obstacleRemove: function () {
    $(".obstacle-animated").remove();
  }, //Elimina los obstaculos.
};

/**
 * @namespace sounds
 * @description Objeto que maneja los efectos de sonido del juego
 */
var sounds = {
  /** @type {Object} Sonido de golpe */
  soundHit: new buzz.sound("images/sounds/sfx_hit.ogg"),
  soundDie: new buzz.sound("images/sounds/sfx_die.ogg"),
  soundBanana: new buzz.sound("images/sounds/sfx_banana.wav"),
  soundKick: new buzz.sound("images/sounds/sfx_kick.wav"),
  oneHit: true,
};

/**
 * @function dieSounds
 * @description Reproduce los sonidos de muerte del pájaro
 */
function dieSounds() {
  if (sounds.oneHit) {
    sounds.soundHit.play().bindOnce("ended", function () {
      sounds.soundDie.play();
      sounds.oneHit = false;
    });
  }
}

/**
 * @function fallDown
 * @description Maneja la caída del pájaro cuando choca
 */
function fallDown() {
  environment.animationStop();
  environment.fallCondition = true;
  environment.obstacleCountStop(); //para que deje de ejecutarse la funcion obstacleGenerator();
}

/**
 * @function pauseAll
 * @description Pausa todos los elementos del juego
 */
function pauseAll() {
  fallDown();
  monster.stop();
  otherMonster.stop();
  banana.stop();
  score.run = false;
}

/**
 * @function gameOver
 * @description Maneja el final del juego
 */
function gameOver() {
  if (!inmune.have) {
    //Si inmune.have es false mueres
    pauseAll();
    dieSounds();
  } else if (inmune.have && bird.positionY >= 397) {
    //Si inmune.have es true pero tocas el suelo GAME OVER
    inmune.have = false;
    $(".bird").css({ "background-image": "url(images/bird.png)" });
    pauseAll();
  }
}

/**
 * @function offLimits
 * @description Controla los límites del mapa y sus consecuencias
 */
function offLimits() {
  //Limites suelo-Game over.
  if (bird.positionY >= 397) {
    environment.gravity = 0;
    bird.velocityY = 0;
    bird.positionY = 397;
    gameOver();
    dieSounds();
    menuGameOver(); //Aparece el menu de Game Over.
    //Limites techo-rebote abajo.
  } else if (bird.positionY < 35) {
    bird.velocityReset = -environment.gravity;
    bird.velocityY = bird.velocityReset;
    //Mientras este dentro de los limites se resetea la velocidad a la normal.
  } else {
    bird.velocityReset = 7.2;
  }
}

/**
 * @function obstacleGenerator
 * @description Genera nuevos obstáculos con alturas aleatorias
 */
function obstacleGenerator() {
  var minHeight = environment.obstacleHeight - 70;
  var randomNumber = Math.floor(Math.random() * minHeight) + 35;
  var heightTop = randomNumber;
  var heightBottom = environment.obstacleHeight - randomNumber;
  $("#gameplay-area").append(
    "<div class='obstacle-animated animated obs-speed'><div class='obstacle-top' style='height:" +
      heightTop +
      "px;'></div><div class='obstacle-bottom' style='height:" +
      heightBottom +
      "px;'></div></div>"
  );
}

/**
 * @function obstacleTimer
 * @description Controla el temporizador para generar obstáculos
 */
function obstacleTimer() {
  environment.obstacleCount++;
  if (environment.obstacleCount == 120) {
    obstacleGenerator();
    environment.obstacleCount = 0;
  }
}

/**
 * @function obstacleDelete
 * @description Elimina los obstáculos que salen de la pantalla
 */
function obstacleDelete() {
  if ($(".obstacle-animated:first").position().left < -90) {
    $(".obstacle-animated:first").remove();
  }
}

/**
 * @function collisionDetector
 * @description Detector genérico de colisiones entre objetos
 * @param {Object} obj1 - Primer objeto a comprobar
 * @param {Object} obj2 - Segundo objeto a comprobar
 * @param {Function} fn - Función a ejecutar si hay colisión
 */
function collisionDetector(obj1, obj2, fn) {
  if (
    obj1.positionX < obj2.positionX + obj2.width &&
    obj1.positionX + obj1.width > obj2.positionX &&
    obj1.positionY < obj2.positionY + obj2.height &&
    obj1.height + obj1.positionY > obj2.positionY
  ) {
    fn(); //Realizar alguna accion
  }
}

/**
 * @function isCollide
 * @description Comprueba las colisiones del pájaro con los diferentes elementos
 */
function isCollide() {
  //Detector de colisiones obstacle-top
  if (
    bird.positionX < $(".obstacle-animated").position().left + 90 &&
    bird.positionX + bird.width > $(".obstacle-animated").position().left &&
    bird.positionY <
      $(".obstacle-top").position().top + $(".obstacle-top").height() &&
    bird.height + bird.positionY > 0
  ) {
    gameOver();
  }
  //Detector de colisiones obstacle-bottom
  if (
    bird.positionX < $(".obstacle-animated").position().left + 90 &&
    bird.positionX + bird.width > $(".obstacle-animated").position().left &&
    bird.positionY > 388 - $(".obstacle-bottom").height() &&
    bird.height + bird.positionY < 388
  ) {
    gameOver();
  }
  collisionDetector(bird, monster, function () {
    monsterDie(monster);
  });
  collisionDetector(bird, otherMonster, function () {
    monsterDie(otherMonster);
  });
  collisionDetector(bird, banana, function () {
    banana.grab();
  });
}
