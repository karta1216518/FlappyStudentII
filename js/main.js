var GameObj = function (position, size, selector) {
  this.el = document.querySelector(selector)
  this.size = size
  this.position = position
  this.el.style.position = 'absolute'
  this.updateCss()
}
GameObj.prototype.init = function (position,velocity) {
  this.position.x = position.x
  this.position.y = position.y
  this.velocity.x = velocity.x
  this.velocity.y = velocity.y
}
GameObj.prototype.updateCss = function () {
  this.el.style.left = this.position.x + 'px'
  this.el.style.top = this.position.y + 'px'
  this.el.style.width = this.size.width + 'px'
  this.el.style.height = this.size.height + 'px'
}
GameObj.prototype.collide = function (otherObj) {
  let inRangeX = otherObj.position.x > this.position.x - 20 && // -20為偏差修正
    otherObj.position.x < this.position.x + this.size.width - 10
  let inRangeY = otherObj.position.y > this.position.y - 20 &&
    otherObj.position.y < this.position.y + this.size.height 
  if (inRangeX && inRangeY) {
    return inRangeX & inRangeY
  }
}

let gameGround = document.querySelector('.gameGround')
let infoText = document.querySelector('.infoText')
let infoWell = document.querySelector('.infoWell')
let gradeEL = document.querySelector('.grade')
let startBtn = document.querySelector('.startBtn')
let fishEL = document.querySelector('.fish')
let obstacleTopHead = document.querySelector('.obstacleTopHead')
let obstacleDownHead = document.querySelector('.obstacleDownHead')

var Fish = function () {
  this.position = { x: 50, y: 255 }
  this.size = { width: 40, height: 40 }
  this.velocity = { x: 0, y: -5 }
  this.gravity = .2
  GameObj.call(this, this.position, this.size, '.fish')
}
// fish的原型指向GameObj  fish的建構函數指向自己的建構函數
Fish.prototype = Object.create(GameObj.prototype)
Fish.prototype.constructor = Fish.constructor
Fish.prototype.tapLeap = function () {
  if (this.velocity.y > 0 && this.gravity) {
    this.velocity.y = -7.5
    this.update()
  }
}
Fish.prototype.init = function () {
  this.position.x = 50
  this.position.y = 255
  this.velocity.x = 0
  this.velocity.y = -7.5
}
// 魚的移動模式
Fish.prototype.update = function () {
  this.velocity.y += this.gravity
  this.position.y += this.velocity.y
  this.updateCss()
  if (this.position.y >= 550) {
    if (this.velocity.y > 0) {
      this.velocity.y = -5
    }
  }
}

var Obstacle = function (position, seletor) {
  this.size = {
    width: 50,
    height: 500
  }
  this.velocity = {}
  GameObj.call(this, position, this.size, seletor)
}
Obstacle.prototype = Object.create(GameObj.prototype)
Obstacle.prototype.constructor = Obstacle.constructor
Obstacle.prototype.update = function () {
  if (this.position.x < -100) {
    this.position.x = 450
    this.convert()
  }else {
    this.position.x -= 1.5
  }
  this.updateCss()
}
Obstacle.prototype.convert = function () {
  this.position.y = this.position.originalY
  this.position.y += Math.random() * 50
}

var Decoration = function (position, size , seletor) {
  GameObj.call(this, position, size, seletor)
  this.presetY = 0
}
Decoration.prototype = Object.create(GameObj.prototype)
Decoration.prototype.constructor = Decoration.constructor
Decoration.prototype.update = function (velocity) {
  if (this.position.x < -150) {
    this.position.x = 450
    this.convert()
  }else {
    this.position.x -= velocity
  }
  this.updateCss()
}

Decoration.prototype.convert = function () {
  this.position.y = this.position.originalY
  this.position.y += Math.random()* 400
}

var Game = function () {
  this.timer = null
  this.grade = 0
  this.initControl()
  this.control = {}
}
Game.prototype.initControl = function () {
  let vm = this
  document.onkeydown = function (e) {
    var keyNum = window.event ? e.keyCode : e.which
    vm.control[keyNum] = true
  }
  document.onkeyup = function (e) {
    var keyNum = window.event ? e.keyCode : e.which
    vm.control[keyNum] = false
  }
}
Game.prototype.startGame = function () {
  let time = 3
  let vm = this
  fish.init()
  obstacleTop.init({x : 450,y : 350},{x : 0 , y : 0})
  obstacleDown.init({x : 450,y : -350},{x : 0 , y : 0})
  obstacleTop.updateCss()
  obstacleDown.updateCss()
  obstacleTopHead.style.left= '-7px'
  obstacleTopHead.style.bottom= '0'
  obstacleDownHead.style.left= '-7px'
  obstacleDownHead.style.bottom= '0'
  fish.updateCss()
  fishEL.classList.remove('shake')
  this.grade = 0
  gradeEL.innerHTML = '分數: ' + 0
  infoText.innerHTML = ''
  let mytimer = setInterval(function () {
    infoText.innerHTML = time
    time--
    if (time < 0) {
      clearInterval(mytimer)
    // infoWell.style.display = 'none'
    // infoText.style.display = 'none'
    vm.startGameMain()
    }
  }, 1000)
}
Game.prototype.startGameMain = function () {
  let vm = this
  fish.init({x : 50,y : 255},{x : 0 , y : 3})
  this.timer = setInterval(function () {
    collisionCheck()
    scoreChange()
    decorationCloud_2.update(getRandom(2.5 , 1 , 5))
    decorationCloud_1.update(getRandom(3 , 1 , 5))
    obstacleTop.update()
    obstacleDown.update()
    fish.update()
  }, 11)
  
  function collisionCheck () {
    if (obstacleTop.collide(fish) || obstacleDown.collide(fish) || fish.position.y < 0 || fish.position.y > 510) {
      game.endGame()
    }
  }
  function scoreChange () {
    if (obstacleTop.position.x == 30) {
      vm.grade += 10
      gradeEL.innerHTML = '分數 : ' + vm.grade
    }
  }
}
Game.prototype.endGame = function (game) {
  clearInterval(this.timer)
  fishEL.classList.add('shake')
}
let fish = new Fish
let game = new Game
let obstacleTop = new Obstacle({ x: 450, y: -350,  originalY: -350}, '.obstacleTop')
let obstacleDown = new Obstacle({ x: 450, y: 350,  originalY: 350}, '.obstacleDown')
let decorationCloud_1 = new Decoration({ x: 450, y: 150, originalY: 0}, {width: getRandom(50,100),  height: getRandom(60,50)} , '.decorationCloud_1')
let decorationCloud_2 = new Decoration({ x: 550, y: 350, originalY: 0}, {width: getRandom(60,100),  height: getRandom(50,50)} , '.decorationCloud_2')
game.startGameMain()

function getRandom ( x , range , divisor ) {
  range = range || 1
  divisor = divisor || 1
  return (Math.floor(Math.random() * x) + range) / divisor
}
gameGround.addEventListener('click', function () {
  fish.tapLeap()
})
