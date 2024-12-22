class Sprite {
  constructor({
    position,
    offset = { x: 0, y: 0 },
    imageSrc,
    scale = 1,
    frameCount = 1,
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.frameCount = frameCount;
    this.frameCurrent = 0;
    this.framesElapsed = 0;
    this.frameHold = 5;
    this.offset = offset;
    this.isFlipped = false;
  }

  draw() {
    c.save();

    if (this.isFlipped) {
      c.scale(-1, 1);
      c.translate(-this.position.x - this.width, this.position.y);
    } else {
      c.translate(this.position.x, this.position.y);
    }

    c.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.frameCount),
      0,
      this.image.width / this.frameCount,
      this.image.height,
      this.isFlipped ? 0 : -this.offset.x, // Adjust for flipped sprite
      -this.offset.y,
      (this.image.width / this.frameCount) * this.scale,
      this.image.height * this.scale
    );

    // Restore the context state
    c.restore();
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.frameHold === 0) {
      if (this.frameCurrent < this.frameCount - 1) {
        this.frameCurrent++;
      } else {
        this.frameCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    imageSrc,
    enemy,
    scale = 1,
    frameCount,
    frameCurrent = 0,
    sprites,
    offset = { x: 0, y: 0 },
    hitBox = {
      offset: {},
      width: undefined,
      height: undefined,
    },
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      imageSrc,
      scale,
      frameCount,
      offset,
      position,
    });
    this.frameCurrent = frameCurrent;
    this.framesElapsed = 0;
    this.frameHold = 5;
    this.width = 50;
    this.width = 150;
    this.sprites = sprites;
    this.position = position;
    this.velocity = velocity;
    this.lastKey;
    this.dead = false;
    this.isFlipped = false;
    this.isAttacking;
    this.isBlocking = false;
    this.isJumping = false;
    this.health = 100;
    this.enemy = enemy;
    this.hitPoint;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }

    this.hitBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: hitBox.offset,
      width: hitBox.width,
      height: hitBox.height,
    };

    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
  }

  update() {
    this.draw();
    if (!this.dead) {
      this.animateFrames();
    }
    this.updateBoxes();

    //  Draw the Hit box
    // c.fillStyle = "rgba(255, 0, 0, 0.5)";
    // c.fillRect(
    //   this.hitBox.position.x,
    //   this.hitBox.position.y,
    //   this.hitBox.width,
    //   this.hitBox.height
    // );

    // if (this.isAttacking) {
    // c.fillStyle = "rgba(23, 22, 22, 0.92)";
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );
    // }

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    //preventing falling over the environment
    if (
      this.position.y + this.image?.height + this.velocity.y >=
      canvas.height - 280
    ) {
      this.velocity.y = 0;
      this.position.y = canvas.height - this.image?.height - 280;
      this.isJumping = false;
    } else {
      this.velocity.y += gravity;
    }

    // prevent moving outside
    if (this.position.x + this.width - 20 <= 0) {
      this.velocity.x = 0;
      this.position.x = 0 - this.hitBox.offset.x;
    } else if (this.position.x + this.width > canvas.width - 40) {
      this.velocity.x = 0;
      this.position.x = canvas.width - this.width - 40;
    }
  }

  updateBoxes() {
    if (this.isFlipped) {
      this.hitBox.position.x = this.position.x - this.hitBox.offset.x + 40;
      this.hitBox.position.y = this.position.y + this.hitBox.offset.y;

      this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
      this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    } else {
      this.hitBox.position.x = this.position.x + this.hitBox.offset.x;
      this.hitBox.position.y = this.position.y + this.hitBox.offset.y;

      this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
      this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    }
  }

  attack({ attack, hitPoint }) {
    this.switchSprite(attack);
    this.isAttacking = true;
    // setHitPoint(hitPoint);
  }

  takeHit() {
    if (this.isBlocking) {
      this.health -= 1;
    } else {
      this.health -= 3;
    }
    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("hurt");
    }
  }
  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.frameCurrent === this.sprites.death.frameCount- 1) {
        this.dead = true;
      }
      return;
    }

    if (
      this.image === this.sprites.attack1.image &&
      this.frameCurrent < this.sprites.attack1.frameCount - 1
    )
      return;
    if (
      this.image === this.sprites.attack2.image &&
      this.frameCurrent < this.sprites.attack2.frameCount - 1
    )
      return;
    if (
      this.image === this.sprites.attack3.image &&
      this.frameCurrent < this.sprites.attack3.frameCount - 1
    )
      return;
    if (
      this.image === this.sprites.block.image &&
      this.frameCurrent < this.sprites.block.frameCount - 1
    )
      return;
    if (
      this.image === this.sprites.jump.image &&
      this.frameCurrent < this.sprites.jump.frameCount - 1
    )
      return;

    if (
      this.image === this.sprites.hurt.image &&
      this.frameCurrent < this.sprites.hurt.frameCount - 1
    )
      return;

    if (this.sprites[sprite] && this.image !== this.sprites[sprite].image) {
      this.image = this.sprites[sprite].image;
      this.frameCount = this.sprites[sprite].frameCount;
      this.frameCurrent = 0;
    }

    // switch (sprite) {
    //   case "idle":
    //     if (this.image !== this.sprites.idle.image) {
    //       this.image = this.sprites.idle.image;
    //       this.frameCount = this.sprites.idle.frameCount;
    //       this.frameCurrent = 0;
    //     }
    //     break;
    //   case "run":
    //     if (this.image !== this.sprites.run.image) {
    //       this.image = this.sprites.run.image;
    //       this.frameCount = this.sprites.run.frameCount;
    //       this.frameCurrent = 0;
    //     }
    //     break;
    //   case "walk":
    //     if (this.image !== this.sprites.walk.image) {
    //       this.image = this.sprites.walk.image;
    //       this.frameCount = this.sprites.walk.frameCount;
    //       this.frameCurrent = 0;
    //     }
    //     break;
    //   case "attack1":
    //     if (this.image !== this.sprites.attack1.image) {
    //       this.image = this.sprites.attack1.image;
    //       this.frameCount = this.sprites.attack1.frameCount;
    //       this.frameCurrent = 0;
    //     }
    //     break;
    // }
  }
}
