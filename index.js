(function () {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  let w = (canvas.width = innerWidth);
  let h = (canvas.height = innerHeight);

  window.onresize = function () {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  };

  // particles

  const particles = [];
  const properties = {
    backgroundColor: "rgba(17, 17, 19, 1)",
    particleColor: "rgba(255, 40, 40, 1)",
    particleRadius: 3,
    particleCount: 160,
    particleMaxVelocity: 0.5,
    lineLength: 100,
    particleLife: 16,
  };

  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;

      this.velocityX =
        Math.random() * (properties.particleMaxVelocity * 2) -
        properties.particleMaxVelocity; // -0.5 - 0.5
      this.velocityY =
        Math.random() * (properties.particleMaxVelocity * 2) -
        properties.particleMaxVelocity;

      this.color = getRandomColor();

      this.life = Math.random() * properties.particleLife * 60;
    }

    reDraw() {
      context.beginPath();
      context.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
      context.closePath();
      context.fillStyle = this.color;
      context.fill();
    }

    position() {
      // (текущее положение по x + скорость по x > ширины окна просмотра && скорость по x больше 0 || текущее положение по x + скорость по x < 0 && и скорость по x < 0 ? если услоние правдиво * скорость на -1 : иначе текущая скорость)
      (this.x + this.velocityX > w && this.velocityX > 0) ||
      (this.x + this.velocityX < 0 && this.velocityX < 0)
        ? (this.velocityX *= -1)
        : this.velocityX;
      (this.y + this.velocityY > h && this.velocityY > 0) ||
      (this.y + this.velocityY < 0 && this.velocityY < 0)
        ? (this.velocityY *= -1)
        : this.velocityY;

      this.x += this.velocityX;
      this.y += this.velocityY;
    }

    reCalculateLife() {
      if (this.life < 1) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;

        this.velocityX =
          Math.random() * (properties.particleMaxVelocity * 2) -
          properties.particleMaxVelocity; // от -0.5 до 0.5 (от этого и зависит направление движения)
        this.velocityY =
          Math.random() * (properties.particleMaxVelocity * 2) -
          properties.particleMaxVelocity;

        this.life = Math.random() * properties.particleLife * 60;
      }

      this.life -= 1;
    }
  }

  function loop() {
    reDrawBackground();
    reDrawParticles();
    drawLines();

    console.log(particles[0].life);

    window.requestAnimationFrame(loop);
  }

  function init() {
    for (let i = 0; i < properties.particleCount; i += 1) {
      particles.push(new Particle());
    }
    loop();
  }

  function reDrawBackground() {
    context.fillStyle = properties.backgroundColor;
    context.fillRect(0, 0, w, h);
  }

  function reDrawParticles() {
    for (let i = 0; i < particles.length; i += 1) {
      particles[i].reCalculateLife();
      particles[i].position();
      particles[i].reDraw();
    }
  }

  function drawLines() {
    let x1 = 0,
      x2 = 0,
      y1 = 0,
      y2 = 0,
      length,
      opacity;

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = 0; j < particles.length; j += 1) {
        x1 = particles[i].x;
        y1 = particles[i].y;
        x2 = particles[j].x;
        y2 = particles[j].y;

        length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)); // растояние по формуле диагонали = Корень квадратный из суммы квадратов((x2 - x1, 2 степень) + (y2 - y1, 2 степень));
        if (length <= properties.lineLength) {
          // opacity = 1 - length / properties.lineLength;

          context.lineWidth = 0.5;
          context.strokeStyle = `${particles[i].color}`;
          context.beginPath();
          context.moveTo(x1, y1);
          context.lineTo(x2, y2);
          context.closePath();
          context.stroke();
        }
      }
    }
  }

  init();
})();

function getRandomColor() {
  function generateRgb() {
    return Math.floor(Math.random() * (254 - 1) + 1);
  }

  return `rgb(${generateRgb()}, ${generateRgb()}, ${generateRgb()})`;
}
