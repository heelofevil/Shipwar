const colName = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К' ]
// Глобальная переменная для отслеживания состояния игры
let gameState = "wait"

// Обработчик события полной загрузки страницы
window.onload = function() {
    console.log('Страница загружена');

    // настраиваем обработчики кликов для всех ячеек
    let cells = document.querySelectorAll(".cell")
    for (let cell of cells){
        cell.addEventListener("click", cellClick)
    }

    // настраиваем обработчик для кнопки Старт
    let startBtn = document.getElementById("start-btn")
    startBtn.addEventListener("click", startGame)
};

function cellClick(elem){
    // обработчик кликов по ячейкам
    console.log(`Click to ${elem.target.dataset.own} cell: ${colName[elem.target.dataset.col]}${elem.target.dataset.row*1+1} `)
    switch (gameState){
        case "wait": // Если игра еще не началась
            alert("Нажмите Start Game для начала игры")
            break
        case "wait_turn_enemy":
          alert("Ход противника")
          break
        case "your_turn": // Если игра в процессе
            if (elem.target.dataset.own === "enemy") {
                elem.target.classList.add("open")
                if (elem.target.dataset.state * 1 < 2)
                    elem.target.dataset.state = `${elem.target.dataset.state * 1 + 2}`
                    if (elem.target.dataset.state > 2){
                      gameState = 'your_turn'
                    }else{
                      gameState = 'wait_turn_enemy'
                      setTimeout(turn_enemy, 2000)
                  }
                    
            }
              
            break
        case "win":  // Если пользователь победил
        case "lose": // Если пользователь проиграл
            alert("Нажмите Start Game для перезапуска игры")
            break
    }
}

function random_num(){
  return Math.floor(Math.random()*10);
}

// выстрел противника
function turn_enemy(){
  let shot_enemy = document.querySelector(`.battle-field.self`);
  let st = 'random_shot'
  for (let m = 0; m < 10; m++) {
    let row = shot_enemy.querySelector(`.r${m}`) // .r0 .r1 ... .r9
    for (let n = 0; n < 10; n++){
        let cell = row.querySelector(`.c${n}`)
        if (cell.dataset.state ==3 && m >1 && m <9 && n >1 && n <9){
          if (shot_enemy.querySelector(`.r${m}`).querySelector(`.c${n-1}`).dataset.state < 2){
              let shot_cell = shot_enemy.querySelector(`.r${m}`).querySelector(`.c${n-1}`);
              shot_cell.dataset.state = `${shot_cell.dataset.state * 1 + 2}`
              if (shot_cell.dataset.state == 2){st = 'miss'}else{st  = 'shot_ship'}
              break
          } else if (shot_enemy.querySelector(`.r${m}`).querySelector(`.c${n+1}`).dataset.state < 2){
              let shot_cell = shot_enemy.querySelector(`.r${m}`).querySelector(`.c${n+1}`)
              shot_cell.dataset.state = `${shot_cell.dataset.state * 1 + 2}`
              if (shot_cell.dataset.state == 2){st = 'miss'}else{st  = 'shot_ship'}
              break
          } else if (shot_enemy.querySelector(`.r${m-1}`).querySelector(`.c${n}`).dataset.state < 2){
              let shot_cell = shot_enemy.querySelector(`.r${m-1}`).querySelector(`.c${n}`)
              shot_cell.dataset.state = `${shot_cell.dataset.state * 1 + 2}`
              if (shot_cell.dataset.state == 2){st = 'miss'}else{st  = 'shot_ship'}
              break
          } else if (shot_enemy.querySelector(`.r${m+1}`).querySelector(`.c${n}`).dataset.state < 2){
              let shot_cell = shot_enemy.querySelector(`.r${m+1}`).querySelector(`.c${n}`)
              shot_cell.dataset.state = `${shot_cell.dataset.state * 1 + 2}`
              if (shot_cell.dataset.state == 2){st = 'miss'}else{st  = 'shot_ship'}
              break
              }
            }
          }
        if (st != 'random_shot'){break}
        }
  if (st == 'shot_ship'){setTimeout(turn_enemy, 2000)
  }else if(st == 'miss'){gameState = "your_turn"}
  else{
    let shot_row = shot_enemy.querySelector(`.r${random_num()}`);
    let shot_colum = shot_row.querySelector(`.c${random_num()}`);
    shot_colum.dataset.state = `${shot_colum.dataset.state * 1 + 2}`
    if (shot_colum.dataset.state == 3){setTimeout(turn_enemy, 2000)
    }else {gameState = "your_turn"}
  }        
          
          
        




  
  
}



function startGame(){
    // обработчик кнопки старт
    gameState = "your_turn"
    resetFields()
    return false;
}
function resetFields(){
    // сброс полей
    for (let own of ['self', 'enemy']) {
        let field = document.querySelector(`.battle-field.${own}`)
        let fieldShips = setShips()
        for (let i = 0; i < 10; i++) {
            let row = field.querySelector(`.r${i}`) // .r0 .r1 ... .r9
            for (let j = 0; j < 10; j++){
                let cell = row.querySelector(`.c${j}`) //.c0 ... .c9
                if (own === 'self'){
                    cell.classList.add("open")
                }else
                {
                    cell.classList.remove("open")
                }
                cell.dataset.row = `${i}`
                cell.dataset.col = `${j}`
                cell.dataset.state = fieldShips[i][j]
                cell.dataset.own = own
            }
        }
    }
}

function setShips(){

    let warfield =[];
    for (let i=0; i<10; i++) {
            warfield[i] = []
            for (let j = 0; j < 10; j++) {
                warfield[i][j] = 0;
            }
        }

    function check(a, b) {
      let result = 'True';
      for (let i = a - 1; i <= a + 1; i++) {
        for (let j = b - 1; j <= b + 1; j++) {
          if (warfield[i] && warfield[i][j] && warfield[i][j] !== 0) {
            result = "False";
          }
        }
      }
      return result;
    }
    
    function set_ship(length_ship){
    
      let start = length_ship-1;
      let end = length_ship+1;
    
      while(true){
    
        let x = random_num();
        let y = random_num();
    
          if (y>=3 && x>=3 && y<=6 && x<=6){
            // строит направо
            if (check(y,x) === 'True' && check(y,x+start) === 'True'){
                for (i=x;i<=(x+start);i++){
                  warfield[y][i] = 1;
                }
              break;
            }
          } 
          // строит вниз
          else if (y<start && x<start){
            if (check(y,x) === 'True' && check(y+start,x) === 'True'){
              for (i=y;i<=(y+start);i++){
                warfield[i][x] = 1;}
              break;
            }
          } 
          // строит влево
          else if (x>end && y<end){
            if (check(y,x-start) === 'True' && check(y,x) === 'True'){
              for (i=(x-start);i<=x;i++){
                warfield[y][i] = 1;}
              break;
            }
          } 
          //строит вверх
          else if (x<end && y>end){
            if (check(y-start,x) === 'True' && check(y,x) === 'True'){
                for (i=(y-start);i<=y;i++){
                  warfield[i][x] = 1;}
              break;
            } 
           }
           //строит влево
          else if (x>end && y>end){
            if (check(y-start,x) === 'True' && check(y,x) === 'True'){
              for (i=(y-start);i<=y;i++){
                warfield[i][x] = 1;}
                break;
              }
            }
          }
    }
    
    ship_flot = [4,3,3,2,2,2,1,1,1,1]
    
    for(let i=0;i<10;i++){
     set_ship(Number(ship_flot[i]))
     }

    
    return warfield
    }