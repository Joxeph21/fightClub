const canvas = document.querySelector("#canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.9;
let isPaused = false;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./sprites/background/background.png",
});

const player = new Fighter({
  position: {
    x: 150,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  hitBox: {
    offset: {
      x: 130,
      y: 100,
    },
    width: 110,
    height: 260,
  },
  attackBox: {
    offset: {
      x: 250,
      y: 180,
    },
    width: 80,
    height: 60,
  },
  imageSrc: "./sprites/characters/Shinobi/Idle.png",
  frameCount: 6,
  scale: 2.8,
  sprites: {
    idle: {
      imageSrc: "./sprites/characters/Shinobi/Idle.png",
      frameCount: 6,
    },
    run: {
      imageSrc: "./sprites/characters/Shinobi/Run.png",
      frameCount: 8,
    },
    walk: {
      imageSrc: "./sprites/characters/Shinobi/Walk.png",
      frameCount: 8,
    },
    attack1: {
      imageSrc: "./sprites/characters/Shinobi/Attack_1.png",
      frameCount: 5,
    },
    attack2: {
      imageSrc: "./sprites/characters/Shinobi/Attack_2.png",
      frameCount: 3,
    },
    attack3: {
      imageSrc: "./sprites/characters/Shinobi/Attack_3.png",
      frameCount: 4,
    },
    jump: {
      imageSrc: "./sprites/characters/Shinobi/Jump.png",
      frameCount: 12,
    },
    block: {
      imageSrc: "./sprites/characters/Shinobi/Shield.png",
      frameCount: 4,
    },
    hurt: {
      imageSrc: "./sprites/characters/Shinobi/Hurt.png",
      frameCount: 2,
    },
    death: {
      imageSrc: "./sprites/characters/Shinobi/Dead.png",
      frameCount: 4,
    },
  },
});

const player2 = new Fighter({
  position: {
    x: 600,
    y: 10,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  hitBox: {
    offset: {
      x: 130,
      y: 100,
    },
    width: 110,
    height: 260,
  },
  attackBox: {
    offset: {
      x: 250,
      y: 180,
    },
    width: 100,
    height: 60,
  },
  imageSrc: "./sprites/characters/Samurai/Idle.png",
  frameCount: 6,
  scale: 2.8,
  sprites: {
    idle: {
      imageSrc: "./sprites/characters/Samurai/Idle.png",
      frameCount: 6,
    },
    run: {
      imageSrc: "./sprites/characters/Samurai/Run.png",
      frameCount: 8,
    },
    walk: {
      imageSrc: "./sprites/characters/Samurai/Walk.png",
      frameCount: 8,
    },
    attack1: {
      imageSrc: "./sprites/characters/Samurai/Attack_1.png",
      frameCount: 6,
    },
    attack2: {
      imageSrc: "./sprites/characters/Samurai/Attack_2.png",
      frameCount: 4,
    },
    attack3: {
      imageSrc: "./sprites/characters/Samurai/Attack_3.png",
      frameCount: 3,
    },
    jump: {
      imageSrc: "./sprites/characters/Samurai/Jump.png",
      frameCount: 12,
    },
    block: {
      imageSrc: "./sprites/characters/Samurai/Shield.png",
      frameCount: 2,
    },
    hurt: {
      imageSrc: "./sprites/characters/Samurai/Hurt.png",
      frameCount: 2,
    },
    death: {
      imageSrc: "./sprites/characters/Samurai/Dead.png",
      frameCount: 3,
    },
  },
});

const keys = {
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  " ": {
    pressed: false,
  },
  x: {
    pressed: false,
  },
  v: {
    pressed: false,
  },
  ControlLeft: {
    pressed: false,
  },
  ControlRight: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  Enter: {
    pressed: false,
  },
};

// function playerCollides({ rect1, rect2 }) {
//   return (
//     rect1.position.x + rect1.width >= rect2.position.x &&
//     rect1.position.x <= rect2.position.x + rect2.width &&
//     rect1.position.y + rect1.height >= rect2.position.y &&
//     rect1.position.y <= rect2.position.y + rect2.height
//   );
// }

function Attacking({ rect1, rect2 }) {
  return (
    rect1.attackBox.position.x + rect1.attackBox.width >=
      rect2.hitBox.position.x &&
    rect1.attackBox.position.x <=
      rect2.hitBox.position.x + rect2.hitBox.width &&
    rect1.attackBox.position.y + rect1.attackBox.height >=
      rect2.hitBox.position.y &&
    rect1.attackBox.position.y <= rect2.hitBox.position.y + rect2.hitBox.height
  );
}

function gameOver() {
  document.querySelector("#result").style.display = "flex";
}

function restartGame() {
  window.location.reload();
}

function knockBack() {
  const knockbackForce = 5;
  if (player.position.x < player2.position.x) {
    player2.velocity.x += knockbackForce;
  } else {
    player2.velocity.x -= knockbackForce;
  }
}

decreaseTimer();

// function updateFacingDirection(player1, player2) {
//   if (player1.hitBox.position.x <= player2.hitBox.position.x) {
//     player1.isFlipped = false;
//     player2.isFlipped = true;
//   } else {
//     player1.isFlipped = true;
//     player2.isFlipped = false;
//   }
// }

function animateMotion() {
  window.requestAnimationFrame(animateMotion);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  c.fillStyle = "rgba(0,0,0,0.2)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  player2.update();

  player.velocity.x = 0;
  player2.velocity.x = 0;

  //Movement Player and Enemy,
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("walk");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 8;
    player.switchSprite("run");
  } //Block
  else if (keys.ControlLeft.pressed && player.lastKey === "ControlLeft") {
    player.switchSprite("block");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  }
  if (player2.velocity.y < 0) {
    player2.switchSprite("jump");
  }

  if (keys.ArrowLeft.pressed && player2.lastKey === "ArrowLeft") {
    player2.velocity.x = -5;
    player2.switchSprite("walk");
  } else if (keys.ArrowRight.pressed && player2.lastKey === "ArrowRight") {
    player2.velocity.x = 8;
    player2.switchSprite("run");
  } //Block
  else if (keys.ControlRight.pressed && player2.lastKey === "ControlRight") {
    player2.switchSprite("block");
  } else {
    player2.switchSprite("idle");
  }

  // if (
  //   playerCollides({
  //     rect1: player,
  //     rect2: player2,
  //   })
  // ) {
  //   knockBack();
  // }

  player2.isFlipped = true;

  if (Attacking({ rect1: player, rect2: player2 }) && player.isAttacking) {
    player2.takeHit();
    player.isAttacking = false;
    knockBack();
    gsap.to("#player2-health", {
      width: player2.health + "%",
    });
  }

  if (player.isAttacking && player.frameCurrent === 3) {
    player.isAttacking = false;
  }

  if (Attacking({ rect1: player2, rect2: player }) && player2.isAttacking) {
    player.takeHit();
    player2.isAttacking = false;
    knockBack();
    gsap.to("#player1-health", {
      width: player.health + "%",
    });
  }

  if (player2.isAttacking && player2.frameCurrent === 3) {
    player2.isAttacking = false;
  }

  if (player.health <= 0 || player2.health <= 0) {
    checkWinner({ player: player.health, enemy: player2.health, timerId });
  }
}

animateMotion();

window.addEventListener("keydown", (e) => {
  if (player.dead || player2.dead) return;
  switch (e.code) {
    case "KeyA":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "KeyD":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "ControlLeft":
      keys.ControlLeft.pressed = true;
      player.isBlocking = true;
      player.lastKey = "ControlLeft";
      break;
    case "Space":
      if (!player.isJumping) {
        player.velocity.y = -20;
        player.isJumping = true;
      }
      break;
    case "KeyX":
      player.attack({ attack: "attack1", hitPoint: 2 });
      break;
    case "KeyV":
      player.attack({ attack: "attack2", hitPoint: 3 });
      break;
    case "KeyT":
      player.attack({ attack: "attack3", hitPoint: 3 });
      break;

    //Player 2 controls

    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      player2.lastKey = "ArrowLeft";
      break;
    case "ArrowRight":
      if (player.position.x + player.width < canvas.width) {
        keys.ArrowRight.pressed = true;
        player2.lastKey = "ArrowRight";
      }
      break;
    case "ArrowUp":
      if (!player2.isJumping) {
        player2.velocity.y = -20;
        player2.isJumping = true;
      }
      break;
    case "ControlRight":
      keys.ControlRight.pressed = true;
      player2.isBlocking = true;
      player2.lastKey = "ControlRight";
      break;
    case "Enter":
      player2.attack({ attack: "attack1" });
      break;
    case "KeyP":
      player2.attack({ attack: "attack2" });
      break;
    case "KeyM":
      player2.attack({ attack: "attack3" });
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.code) {
    case "KeyD":
      keys.d.pressed = false;
      break;
    case "KeyA":
      keys.a.pressed = false;
      break;
    case "ControlLeft":
      keys.ControlLeft.pressed = false;
      break;

    //Player 2

    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ControlRight":
      keys.ControlRight.pressed = false;
      break;
  }
});
