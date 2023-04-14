/* Função do Timer */

const miliseg = document.querySelector('.milissegundos')
const seg = document.querySelector('.segundos')
const min = document.querySelector('.minutos')

let miliNum = 0
let segNum = 0
let minNum = 0
let INTERVALO

function milissegundos() {
  miliNum++
  if (miliNum < 10) {
    miliseg.innerHTML = '0' + miliNum
  } else {
    miliseg.innerHTML = miliNum
  }

  if (miliNum == 99) {
    miliNum = 0
    segundos()
  }
}

function segundos() {
  segNum++
  if (segNum < 10) {
    seg.innerHTML = '0' + segNum
  } else {
    seg.innerHTML = segNum
  }

  if (segNum == 59) {
    segNum = 0
    minutos()
  }
}

function minutos() {
  minNum++
  if (minNum < 10) {
    min.innerHTML = '0' + minNum
  } else {
    min.innerHTML = minNum
  }
}

var Position = function(x, y) {
    this.x = x;
    this.y = y;
  }
  
  Position.prototype.toString = function() {
    return this.x + ":" + this.y;
  };
  
  var Mazing = function(id) {
  
    this.mazeContainer = document.getElementById(id);
  
    this.mazeScore = document.createElement("div");
    this.mazeScore.id = "maze_score";
  
    this.mazeMessage = document.createElement("div");
    this.mazeMessage.id = "maze_message";
  
    this.heroScore = this.mazeContainer.getAttribute("data-steps") - 2;
  
    this.maze = [];
    this.heroPos = {};
    this.heroHasKey = false;
    this.childMode = false;
  
    this.utter = null;
  
    for(i=0; i < this.mazeContainer.children.length; i++) {
      for(j=0; j < this.mazeContainer.children[i].children.length; j++) {
        var el =  this.mazeContainer.children[i].children[j];
        this.maze[new Position(i, j)] = el;
        if(el.classList.contains("entrance")) {
          /* posicionar o herói na entrada */
          this.heroPos = new Position(i, j);
          this.maze[this.heroPos].classList.add("hero");
        }
      }
    }

  
    var mazeOutputDiv = document.createElement("div");
    mazeOutputDiv.id = "maze_output";
  
    mazeOutputDiv.appendChild(this.mazeScore);
    mazeOutputDiv.appendChild(this.mazeMessage);
    
    clearInterval(INTERVALO);
    miliNum = 0;
    segNum = 0;
    minNum = 0;
    miliseg.innerHTML = '00';
    seg.innerHTML = '00';
    min.innerHTML = '00';

    INTERVALO = setInterval(() => {
      milissegundos()
    }, 10);
  
    mazeOutputDiv.style.width = this.mazeContainer.scrollWidth + "px";
    this.setMessage("Primeiro, ache a moeda!");
  
    this.mazeContainer.insertAdjacentElement("afterend", mazeOutputDiv);
  
    /* ativando as teclas de controle */
  
    this.keyPressHandler = this.mazeKeyPressHandler.bind(this);
    document.addEventListener("keydown", this.keyPressHandler, false);
  };
  

  Mazing.prototype.setMessage = function(text) {
  
    /* mensagem na tela */
    this.mazeMessage.innerHTML = text;
    this.mazeScore.innerHTML = this.heroScore;
  
  };
  
  
  Mazing.prototype.heroTakeKey = function() {
    this.maze[this.heroPos].classList.remove("key");
    this.heroHasKey = true;
    this.heroScore += 20;
    this.mazeScore.classList.add("has-key");
    this.setMessage("Você obteve a moeda!");
  };
  
  Mazing.prototype.gameOver = function(text) {
    /* desativar as teclas de controle */
    clearInterval(INTERVALO);
    document.removeEventListener("keydown", this.keyPressHandler, false);
    this.setMessage(text);
    this.mazeContainer.classList.add("finished");
  };

  Mazing.prototype.endOfGame = function(text) {
    /* desativar as teclas de controle */
    document.removeEventListener("keydown", this.keyPressHandler, false);
    this.setMessage(text);
    this.mazeContainer.classList.add("won");
  };
  
  Mazing.prototype.heroWins = function() {
    this.mazeScore.classList.remove("has-key");
    this.maze[this.heroPos].classList.remove("door");
    this.heroScore += 50;
    clearInterval(INTERVALO);
    this.endOfGame("GANHOU !!!");
  };
  
  Mazing.prototype.tryMoveHero = function(pos) {
  
    if("object" !== typeof this.maze[pos]) {
      return;
    }
  
    var nextStep = this.maze[pos].className;
  
    /* antes de mexer */
  
    if(nextStep.match(/sentinel/)) {
      /* bateu com um monstro - perde passos */
      this.heroScore = Math.max(this.heroScore - 5, 0);
  
      if(this.heroScore <= 0) {
        /* perdeu o jogo */
        this.gameOver("Infelizmente, você não conseguiu...");
      } else {
        this.setMessage("Ai, doeu!");
      }
  
      return;
    }
  
    if(nextStep.match(/wall/)) {
      return;
    }
  
    if(nextStep.match(/exit/)) {
      if(this.heroHasKey) {
        this.heroWins();
      } else {
        this.setMessage("Você ainda não obteve a moeda!");
        return;
      }
    }
  
    /* mexer o herói um passo */
  
    this.maze[this.heroPos].classList.remove("hero");
    this.maze[pos].classList.add("hero");
    this.heroPos = pos;
  
    /* checar o que o herói encostou */
  
    if(nextStep.match(/key/)) {
      this.heroTakeKey();
      return;
    }
  
    if(nextStep.match(/exit/)) {
      return;
    }
  
    if(this.heroScore >= 1) {
  
      this.heroScore--;
  
      if(this.heroScore <= 0) {
        /* fim de jogo */
        this.gameOver("Infelizmente, você não conseguiu...");
        return;
      }
  
    }
  
    this.setMessage("...");
  
  };
  
  Mazing.prototype.mazeKeyPressHandler = function(e) {
  
    var tryPos = new Position(this.heroPos.x, this.heroPos.y);
  
    switch(e.key)
    {
      case "ArrowLeft":
        tryPos.y--;
        break;
  
      case "ArrowUp":
        tryPos.x--;
        break;
  
      case "ArrowRight":
        tryPos.y++;
        break;
  
      case "ArrowDown":
        tryPos.x++;
        break;
  
      default:
        return;
  
    }
  
    this.tryMoveHero(tryPos);
  
    e.preventDefault();
  };