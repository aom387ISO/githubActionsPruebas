const $ = require("jquery"); // Asegúrate de que jQuery se importa correctamente

// Configurar jsdom globalmente
require("jsdom-global");

describe("changeColor function", () => {
  let bird;
  let inmune;

  beforeEach(() => {
    bird = {
      width: 30,
      height: 20,
      positionX: 60,
      positionY: 210,
      velocityY: 6,
      velocityReset: 7.2,
      changeColor: function () {
        if (inmune.have) {
          $(".bird").css({
            "background-image": "url(images/bird-invincible.png)",
          });
        } else {
          $(".bird").css({ "background-image": "url(images/bird.png)" });
        }
      },
    };

    inmune = {
      have: false,
      time: 300,
      duration: function () {
        this.time--;
        if (!this.time && this.have) {
          this.have = false;
        }
      },
    };

    // Crear un contenedor .bird
    $("body").append('<div class="bird"></div>');
  });

  it("should change the background image when inmune.have is true", () => {
    inmune.have = true;
    bird.changeColor();
    const backgroundImage = $(".bird").css("background-image");
    // Normalizamos ambas URL sin las comillas
    expect(backgroundImage).toBe("url(images/bird-invincible.png)");
  });

  it("should change the background image when inmune.have is false", () => {
    inmune.have = false;
    bird.changeColor();
    const backgroundImage = $(".bird").css("background-image");
    // Normalizamos ambas URL sin las comillas
    expect(backgroundImage).toBe("url(images/bird.png)");
  });
});
