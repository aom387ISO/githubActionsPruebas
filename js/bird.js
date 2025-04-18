/**
 * @namespace bird
 * @description Objeto que representa al pájaro y sus propiedades en el juego
 */
var bird = {
    /** 
     * Ancho del pájaro en píxeles
     * @type {number} 
     */
    width: 30,           
    /** 
     * Alto del pájaro en píxeles
     * @type {number} 
     */
    height: 20,
    /** 
     * Posición X del pájaro en el canvas
     * @type {number} 
     */
    positionX: 60,
    /** 
     * Posición Y del pájaro en el canvas
     * @type {number} 
     */
    positionY: 210,
    /** 
     * Velocidad vertical del pájaro
     * @type {number} 
     */
    velocityY: 6,
    /** 
     * Valor para resetear la velocidad vertical
     * @type {number} 
     */
    velocityReset: 7.2,
    /**
     * @function changeColor
     * @memberof bird
     * @description Cambia la imagen del pájaro según su estado de inmunidad
     */
    changeColor: function(){
        if(inmune.have){
            $(".bird").css({"background-image": 'url(images/bird-invincible.png)'})
        }else{
            $(".bird").css({"background-image": 'url(images/bird.png)'})
        };
    }
};

/**
 * @namespace inmune
 * @description Objeto que maneja las propiedades de invincibilidad del pájaro
 */
var inmune = {
    /** 
     * Estado de inmunidad
     * @type {boolean} 
     */
    have: false,
    /** 
     * Duración de la inmunidad en frames
     * @type {number} 
     */
    time: 300,
    /**
     * @function duration
     * @memberof inmune
     * @description Controla la duración de la inmunidad y la desactiva cuando termina
     */
    duration: function(){
        this.time--;
        if (!this.time && this.have){
            this.have = false;
        };
    }
};

/**
 * @function jump
 * @description Maneja los eventos de salto del pájaro mediante click o teclas específicas
 * @listens document#click
 * @listens document#keydown
 */
function jump(){
    $(document).on("click", function(){
        if(bird.positionY<397 && !environment.fallCondition){
            bird.velocityY = bird.velocityReset;
        }
    }); 

    //Handle space bar
    $(document).keydown(function(e){
        //space bar!
        if(e.keyCode == 32 || e.keyCode == 38){
            if(bird.positionY<397 && !environment.fallCondition){
                bird.velocityY = bird.velocityReset;
            };
        };  
    })
};



