# Despliegue continuo de aplicaciones

🚀 **Proyecto: Despliegue continuo de aplicaciones**
La CI/CD forma parte de DevOps (la unión de los equipos de desarrollo y operaciones) y combina las prácticas de integración continua y entrega continua. La CI/CD automatiza gran parte o la totalidad de la intervención humana manual tradicionalmente necesaria para llevar el nuevo código de una confirmación a producción, abarcando las fases de compilación, prueba (incluidas las pruebas de integración, pruebas unitarias y pruebas de regresión) e implementación, así como el aprovisionamiento de la infraestructura. Con un pipeline de CI/CD, los equipos de desarrollo pueden realizar cambios en el código que luego se prueban automáticamente y se envían para su entrega e implementación. Si se aplica correctamente la CI/CD, el tiempo de inactividad se reduce al mínimo y el código se libera con mayor rapidez.

## 😳 **Introducción**
Este proyecto implementa un flujo de despliegue continuo (CD) para aplicaciones modernas. Se usará GitHub Actions para la automatización del procesos y herramientas como Eslint para mantener la calidad del código. Además, se ejecutarán una serie de juegos de pruebas que verifican la integridad del código antes de ser desplegado.


## 🥵 **Crear repositorio en github**
Para la realización de de la práctica se debe forkear este repositorio: https://github.com/aom387ISO/practicaDespliegue. Si se quiere hacer la práctica en grupo. será necesario darle permisos a todos los miembros del equipo para que puedan interactuar con el repositorio.
Luego será necesario clonar el repositorio de forma local:

```
git clone https://github.com/tu-usuario/flappy-bird.git  
cd flappy-bird  
```

## 🎶  **¿Qué es una pipeline?**
Un pipeline de CI/CD es un proceso automatizado que utilizan los equipos de desarrollo de software para optimizar la creación, prueba e implementación de aplicaciones. «CI» representa la integración continua, donde los desarrolladores con frecuencia fusionan los cambios de código en un repositorio central, lo que permite la detección temprana de problemas. «CD» se refiere a la implementación continua o entrega continua, que automatiza el lanzamiento de la aplicación a su entorno previsto, asegurando así que esté fácilmente disponible para los usuarios. Este pipeline es fundamental para los equipos que buscan mejorar la calidad del software y acelerar la entrega a través de actualizaciones regulares y confiables.
La integración de un pipeline de CI/CD en su flujo de trabajo reduce significativamente el riesgo de errores en el proceso de implementación. La automatización de compilaciones y pruebas garantiza que los errores se detecten a tiempo y se corrijan con prontitud, para mantener un software de alta calidad.
A continuación vamos a explicar unos ejemplos visuales para ayudar a la compresión del concepto.
Como vemos en la siguiente imagen, no se han cumplido las validaciones correspondientes, ya podría ser por los tests o por fallos en el eslint, por lo que el despliegue se detiene y el proceso termina.


![image1](https://github.com/user-attachments/assets/766dc123-be5a-46e6-9419-0514dda3c989)


En la siguiente imagen podemos observar que se cumplen todas las validaciones, por lo que el proyecto se despliega correctamente.

![image2](https://github.com/user-attachments/assets/a5c8cc61-7443-4a2e-8223-59b53a967620)


Básicamente, una pipeline de CI/CD es el proceso que sigue la aplicación antes de ser lanzada. Se encarga de verificar que todo esté correcto, desde la integración del código hasta su despliegue. Si algo falla en el camino, como en la primera imagen, la pipeline se detiene para evitar problemas en producción. Cuando todo funciona bien, como en la segunda imagen, la aplicación se despliega automáticamente.
Un ejemplo más de pipeline sería el siguiente:

<img src="https://github.com/user-attachments/assets/92405830-1d07-435a-b5c2-9c2b0fe6cfa3" width="300">


## 💁🏻 **Crear flow para github actions.** 🔥🔥🔥

En primer lugar, activaremos github actions. Para ello, en nuestro repositorio, iremos a _Settings > Pages > Source > Github Actions._

![image4](https://github.com/user-attachments/assets/37ef802f-e6f1-4cea-b6cd-acc9f2ea6701)

Es muy importante que esté activado por Github Actions para poder continuar.


Ahora, en nuestro proyecto, crearemos el siguiente directorio “.github/workflows”, este directorio es el lugar estándar donde GitHub busca los archivos de configuración de los flujos de trabajo (workflows). Por eso lo usamos: es una convención que GitHub reconoce automáticamente. Podemos crear este directorio rápidamente desde la terminal con el siguiente comando:

```
mkdir -p .github/workflows
```

Dentro del directorio crearemos el archivo “static.yml”, el cual también podemos crear rápidamente con el comando:

```
touch .github/workflows/static.yml
```

Un archivo .yml (o YAML) es simplemente un formato de texto fácil de leer que usamos para configurar cosas como los workflows de GitHub Actions. En él, especificaremos qué pasos queremos que GitHub ejecute automáticamente, como construir un sitio estático o desplegarlo. 
Digamos que es como una receta, en la que vamos indicando paso a paso cómo realizar nuestro plato. En este caso, le diremos a GitHub qué pasos seguir para automatizar tareas, como construir un sitio estático o desplegarlo.
Empezamos dando un nombre a nuestra receta: "CI and Deploy". Esto le dice a GitHub cómo llamar a este flujo de trabajo. Es como ponerle "Receta de pastel de chocolate" en la portada de tu libro de cocina: algo claro y descriptivo.
```
name: CI and Deploy
```
Aquí definimos los momentos en los que nuestra receta se pone en marcha. Es como decir: "Hornea este pastel cuando alguien empuje cambios a la rama main, cuando haya un pull request a main, o si yo manualmente digo de empezar a cocinar ' con workflow_dispatch". Esto asegura que el flujo se ejecute solo cuando queremos.

```
on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]
  workflow_dispatch:
```
Antes de empezar a cocinar, necesitamos permisos para usar los utensilios. Aquí le decimos a GitHub que puede leer el contenido del repositorio (contents: read), escribir en GitHub Pages (pages: write) y usar un token para autenticarse (id-token: write). Sin estos permisos, no podríamos completar el despliegue.
```
permissions:
  contents: read
  pages: write
  id-token: write
```
Para asegurarnos de que no haya dos chefs cocinando el mismo pastel al mismo tiempo. group: "pages" agrupa los flujos relacionados con Pages, y cancel-in-progress: false significa que no cancelaremos un flujo si otro empieza. Así evitamos conflictos.
```
concurrency:
  group: "pages"
  cancel-in-progress: false
```
Aquí viene la parte divertida: los "pasos" de nuestra receta. Tenemos tres trabajos (lint, test, y deploy), como si fueran etapas: mezclar los ingredientes, probar la masa, y hornear el pastel.
En primer lugar, usaremos eslint para revisar el código.
```
jobs:
 lint:
   name: Lint Code
   runs-on: ubuntu-latest
   steps:
     - name: Checkout repository
       uses: actions/checkout@v3
     - name: Setup Node.js
       uses: actions/setup-node@v3
       with:
         node-version: '20'
     - name: Install dependencies
       run: npm install
     - name: Run ESLint
       run: npx eslint .
```
Este trabajo es como revisar que todos los ingredientes estén bien medidos. Usa un entorno Ubuntu (runs-on: ubuntu-latest) y sigue estos pasos:
Checkout: Trae el código del repositorio (como sacar los ingredientes del armario).
Setup Node.js: Configura Node.js versión 20 (como encender el horno).
Install dependencies: Instala las dependencias con npm install (mezclar los ingredientes).
Run ESLint: Ejecuta ESLint para verificar el código (probar que todo esté en orden).
Ahora implementaremos las pruebas:
```
test:
   name: Run Tests
   runs-on: ubuntu-latest
   needs: lint
   steps:
     - name: Checkout repository
       uses: actions/checkout@v3
     - name: Setup Node.js
       uses: actions/setup-node@v3
       with:
         node-version: '20'
     - name: Install dependencies
       run: npm ci
     - name: Run tests
       run: npm test
```
Aquí probamos la masa antes de hornearla. Los pasos son parecidos:
Checkout: Obtiene el código.
Setup Node.js: Configura Node.js.
Install dependencies: Usa npm ci para instalar dependencias de forma más limpia y rápida (ideal para CI).
Run tests: Corre las pruebas con npm test para asegurarnos de que todo funciona.

Y por último implementaremos el deploy:
```
 deploy:
   name: Deploy to GitHub Pages
   environment:
     name: github-pages
     url: ${{ steps.deployment.outputs.page_url }}
   runs-on: ubuntu-latest
   needs: test  # Solo despliega si las pruebas pasan
   steps:
     - name: Checkout
       uses: actions/checkout@v4

     - name: Set up Node.js
       uses: actions/setup-node@v3
       with:
         node-version: "20"

     - name: Install dependencies
       run: npm install

     - name: Setup Pages
       uses: actions/configure-pages@v5
       if: success()

     - name: Upload artifact
       uses: actions/upload-pages-artifact@v3
       with:
         path: "."
       if: success()

     - name: Deploy to GitHub Pages
       id: deployment
       uses: actions/deploy-pages@v4
       if: success()
```
Este es el gran final: hornear y servir el pastel. Solo se ejecuta si las pruebas pasan (needs: test). Los pasos son:
Checkout: Trae el código.
Set up Node.js: Configura Node.js.
Install dependencies: Instala lo necesario.
Setup Pages: Prepara GitHub Pages (cómo decorar el plato).
Upload artifact: Sube todo el contenido (path: ".") como un artefacto.
Deploy: Despliega a GitHub Pages y guarda la URL en steps.deployment.outputs.page_url.
El if: success() asegura que cada paso solo ocurre si el anterior funcionó.

## 🙈 **Crear juegos de pruebas**
Para asegurar la calidad y el correcto funcionamiento de nuestro juego "Flappy Bird", implementaremos pruebas automatizadas utilizando Jest. Jest es un framework de pruebas de JavaScript, conocido por su facilidad de uso y flexibilidad. Aunque la configuración inicial de Jest ya está completa en este proyecto, explicaremos el proceso para futuras referencias.
Configuración de Jest:
Instalación de Jest:
Ejecuta el siguiente comando para instalar Jest como dependencia de desarrollo:
npm install --save-dev jest
Instalación de Dependencias para Pruebas del DOM:
Dado que nuestro juego interactúa con el Document Object Model (DOM), necesitamos las siguientes dependencias adicionales:
npm install jquery
npm install --save-dev jest-environment-jsdom jsdom jsdom-global
jquery: Biblioteca para manipulación del DOM.
jest-environment-jsdom: Entorno de prueba Jest para simular un navegador.
jsdom: Implementación de JavaScript del DOM y APIs del navegador.
jsdom-global: Configuración global de jsdom.
Configuración del Entorno de Prueba:
Crea un archivo jest.config.js en la raíz del proyecto y agrega el siguiente código:
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
};
Esto indica a Jest que ejecute las pruebas en un entorno jsdom, necesario para simular el comportamiento del navegador.
Ejemplo de Prueba para la Clase bird.js:

Para ilustrar el uso de Jest, crearemos un archivo de prueba llamado bird.test.js en la carpeta test.
Importación de Dependencias:
Importamos jQuery para interactuar con el DOM y configuramos JSDOM:

```
const $ = require("jquery");
require("jsdom-global");
Inicialización de Objetos de Prueba:
Utilizamos describe y beforeEach para estructurar nuestras pruebas:
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
```

Pruebas del Método changeColor:
Definimos pruebas para verificar el comportamiento de changeColor:

```
it("should change the background image when inmune.have is true", () => {
    inmune.have = true;
    bird.changeColor();
    const backgroundImage = $(".bird").css("background-image");
    expect(backgroundImage).toBe("url(images/bird-invincible.png)");
  });

  it("should change the background image when inmune.have is false", () => {
    inmune.have = false;
    bird.changeColor();
    const backgroundImage = $(".bird").css("background-image");
    expect(backgroundImage).toBe("url(images/bird.png)");
  });
```

Ejecutamos las pruebas con:

```
npm test
```


## 😴 **Configuración de Eslint**

ESLint es una herramienta de análisis de código estático para JavaScript y TypeScript. Sirve para detectar errores, inconsistencias de estilo y malas prácticas en el código.

```
npm install --save-dev eslint  
npx eslint --init  
```
# Actividades


- Corregir el código para que pase el eslint
- Crear un proyecto de ejemplo siguiendo la guia

