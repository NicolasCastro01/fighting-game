const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7


const backgorund = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './src/assets/background.png'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: './src/assets/shop.png',
  scale: 2.75,
  framesMax: 6
})
const player = new Fighter({
  position:{
    x:0,
    y:0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './src/assets/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites:{
    idle:{
      imageSrc: './src/assets/samuraiMack/Idle.png',
      framesMax: 8,
    },
    run:{
      imageSrc: './src/assets/samuraiMack/Run.png',
      framesMax: 8
    },
    jump:{
      imageSrc: './src/assets/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall:{
      imageSrc: './src/assets/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1:{
      imageSrc: './src/assets/samuraiMack/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './src/assets/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './src/assets/samuraiMack/Death.png',
      framesMax: 6
    }
  },
  attackBox:{
    offset:{
      x: 160,
      y: 50
    },
    width: 170,
    height: 50
  }
});
const enemy = new Fighter({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './src/assets/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites:{
    idle:{
      imageSrc: './src/assets/kenji/Idle.png',
      framesMax: 4,
    },
    run:{
      imageSrc: './src/assets/kenji/Run.png',
      framesMax: 8
    },
    jump:{
      imageSrc: './src/assets/kenji/Jump.png',
      framesMax: 2
    },
    fall:{
      imageSrc: './src/assets/kenji/Fall.png',
      framesMax: 2
    },
    attack1:{
      imageSrc: './src/assets/kenji/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './src/assets/kenji/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './src/assets/kenji/Death.png',
      framesMax: 7
    }
  },
  attackBox:{
    offset:{
      x: -160,
      y: 50
    },
    width: 170,
    height: 50
  }
});

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  }
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate);
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
  backgorund.update();
  shop.update();
  context.fillStyle = 'rgba(255,255,255, 0.15)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0
  enemy.velocity.x = 0

  if(keys.a.pressed && player.lastKey === 'a' ) {
    player.velocity.x = -5
    player.switchSprite('run');
  }else if(keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }

  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if(player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' ) {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle');
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if(enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  // detect for collision
  if(rectangularCollision({
    rectangle1: player,
    rectangle2: enemy
  }) &&
     player.isAttacking && player.framesCurrent === 4
     ){
    enemy.takeHit();
    player.isAttacking = false
    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  // detect for collision
  if(rectangularCollision({
    rectangle1: enemy,
    rectangle2: player
  }) &&
     enemy.isAttacking && enemy.framesCurrent === 2
     ){
    enemy.isAttacking = false
    player.takeHit();
    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }

  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }

}

animate();

window.addEventListener('keydown', (e) => {
  if(!player.dead){
    switch(e.key) {
      case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
      break;
      case 'a':
      player.lastKey = 'a'
      keys.a.pressed = true
      break;
      case 'w':
        player.velocity.y = -20
      break;
      case ' ':
      player.attack()
      break
    }
  }

  if(!enemy.dead){
    switch(e.key){
      case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break;
      case 'ArrowLeft':
      enemy.lastKey = 'ArrowLeft'
      keys.ArrowLeft.pressed = true
      break;
      case 'ArrowUp':
      enemy.velocity.y = -20
      break;
      case 'ArrowDown':
      enemy.attack()
      break;
    }
  }
});

window.addEventListener('keyup', (e) => {
  switch(e.key) {
    case 'd':
    keys.d.pressed = false
    break;
    case 'a':
    keys.a.pressed = false
    break;
  }
  switch(e.key) {
    case 'ArrowRight':
    keys.ArrowRight.pressed = false
    break;
    case 'ArrowLeft':
    keys.ArrowLeft.pressed = false
    break;
    case 'ArrowUp':
    keys.ArrowUp.pressed = false
    break;
  }
});
