const colName = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К']
// Глобальная переменная для отслеживания состояния игры
let gameState = "wait"

// Обработчик события полной загрузки страницы
window.onload = function () {
  console.log('Страница загружена');

  // настраиваем обработчики кликов для всех ячеек
  let cells = document.querySelectorAll(".cell")
  for (let cell of cells) {
    cell.addEventListener("click", cellClick)
  }

  // настраиваем обработчик для кнопки Старт
  let startBtn = document.getElementById("start-btn")
  startBtn.addEventListener("click", startGame)
};

function cellClick(elem) {
  // обработчик кликов по ячейкам
  console.log(`Click to ${elem.target.dataset.own} cell: ${colName[elem.target.dataset.col]}${elem.target.dataset.row * 1 + 1} `)
  switch (gameState) {
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

        if (elem.target.dataset.state > 2) {
          check_health(elem.target.dataset.col * 1, elem.target.dataset.row * 1)
          gameState = 'your_turn'
        } else {
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

function random_num() {
  return Math.floor(Math.random() * 10);
}

// выстрел противника
function turn_enemy() {
  let shot_enemy = document.querySelector(`.battle-field.self`);
  let st = 'random_shot'
  let around_three = 0;
  for (let m = 0; m < 10; m++) {
    let row = shot_enemy.querySelector(`.r${m}`)
    for (let n = 0; n < 10; n++) {
      let cell = row.querySelector(`.c${n}`)
      if (cell.dataset.state == 3) {
        if (n - 1 >= 0 && shot_enemy.querySelector(`.r${m}`).querySelector(`.c${n - 1}`).dataset.state == 3) {
          around_three = 1 // 1-тройка слева 
        } else if (n + 1 < 10 && shot_enemy.querySelector(`.r${m}`).querySelector(`.c${n + 1}`).dataset.state == 3) {
          around_three = 2 // 2-тройка справа
        } else if (m - 1 >= 0 && shot_enemy.querySelector(`.r${m - 1}`).querySelector(`.c${n}`).dataset.state == 3) {
          around_three = 3 // 3-тройка сверху
        } else if (m + 1 < 10 && shot_enemy.querySelector(`.r${m + 1}`).querySelector(`.c${n}`).dataset.state == 3) {
          around_three = 4 // 4-тройка снизу
        }
        let alt_cell;
        switch (around_three) {
          case 1:
            alt_cell = shot_enemy.querySelector(`.r${m} .c${n + 1}`).dataset.state
            if (n + 1 < 10 && alt_cell < 2) {
              alt_cell = Number(alt_cell) +2
              if (alt_cell == 3) {
                st = 'shot_ship'
                check_health(n + 1, m)
              } else { st = 'miss' }
            }
            break
          case 2:
            alt_cell = shot_enemy.querySelector(`.r${m} .c${n - 1}`).dataset.state
            if (n - 1 >= 0 && alt_cell < 2) {
              alt_cell = Number(alt_cell) +2
              if (alt_cell == 3) {
                st = 'shot_ship'
                check_health(n - 1, m)
              } else { st = 'miss' }
            }
            break
          case 3:
            alt_cell = shot_enemy.querySelector(`.r${m + 1} .c${n}`).dataset.state
            if (m + 1 < 10 && alt_cell < 2) {
              alt_cell = Number(alt_cell) +2
              if (alt_cell == 3) {
                st = 'shot_ship'
                check_health(n, m + 1)
              } else { st = 'miss' }
            }
            break
          case 4:
            alt_cell = shot_enemy.querySelector(`.r${m - 1} .c${n}`).dataset.state
            if (m - 1 >= 0 && alt_cell < 2) {
              alt_cell = Number(alt_cell) +2
              if (alt_cell == 3) {
                st = 'shot_ship'
                check_health(n, m - 1)
              } else { st = 'miss' }
            }
            break
          default: // стреляет вокруг найденной точки
            if (n - 1>=0 && shot_enemy.querySelector(`.r${m}`).querySelector(`.c${n - 1}`).dataset.state < 2) {
              let shot_cell = shot_enemy.querySelector(`.r${m}`).querySelector(`.c${n - 1}`);
              shot_cell.dataset.state = `${shot_cell.dataset.state * 1 + 2}`
              check_health(n - 1, m)
              if (shot_cell.dataset.state == 2) { st = 'miss' } else { st = 'shot_ship' }
              break
            } else if (n + 1 < 10 && shot_enemy.querySelector(`.r${m}`).querySelector(`.c${n + 1}`).dataset.state < 2) {
              let shot_cell = shot_enemy.querySelector(`.r${m}`).querySelector(`.c${n + 1}`)
              shot_cell.dataset.state = `${shot_cell.dataset.state * 1 + 2}`
              check_health(n + 1, m)
              if (shot_cell.dataset.state == 2) { st = 'miss' } else { st = 'shot_ship' }
              break
            } else if (m - 1>=0 && shot_enemy.querySelector(`.r${m - 1}`).querySelector(`.c${n}`).dataset.state < 2) {
              let shot_cell = shot_enemy.querySelector(`.r${m - 1}`).querySelector(`.c${n}`)
              shot_cell.dataset.state = `${shot_cell.dataset.state * 1 + 2}`
              check_health(n, m - 1)
              if (shot_cell.dataset.state == 2) { st = 'miss' } else { st = 'shot_ship' }
              break
            } else if (m + 1 < 10 && shot_enemy.querySelector(`.r${m + 1}`).querySelector(`.c${n}`).dataset.state < 2) {
              let shot_cell = shot_enemy.querySelector(`.r${m + 1}`).querySelector(`.c${n}`)
              shot_cell.dataset.state = `${shot_cell.dataset.state * 1 + 2}`
              check_health(n, m + 1)
              if (shot_cell.dataset.state == 2) { st = 'miss' } else { st = 'shot_ship' }
              break
            }

        }

        // if (flag_x == 1){
        //   for (let gg = 1; gg <5; gg++){
        //     let shot_cell = shot_enemy.querySelector(`.r${m}`).querySelector(`.c${n-gg}`).dataset.state
        //     if (shot_cell < 2){ 
        //       shot_cell = `${shot_cell * 1 + 2}`
        //       check_health(n-gg, m)
        //       if (shot_cell == 2){
        //         st = 'miss'
        //       }else{st = 'shot_ship'}
        //       break
        //     }else if(shot_cell == 2){break}
        //   }
        //   if (st = 'random_shot'){
        //   for (let tt = 1; tt <5; tt++){
        //     let shot_cell = shot_enemy.querySelector(`.r${m}`).querySelector(`.c${n+tt}`).dataset.state
        //     if (shot_cell < 2){ 
        //       shot_cell = `${shot_cell * 1 + 2}`
        //       check_health(n+tt, m)
        //       if (shot_cell == 2){
        //         st = 'miss'
        //       }else{st  = 'shot_ship'}
        //       break
        //     }else if(shot_cell == 2){break}
        //   }}
        // }
        // if (flag_x == 2){
        //   for (let gg = 1; gg <5; gg++){
        //     let shot_cell = shot_enemy.querySelector(`.r${m-gg}`).querySelector(`.c${n}`).dataset.state
        //     if (shot_cell < 2){ 
        //       shot_cell = `${shot_cell * 1 + 2}`
        //       check_health(n, m-gg)
        //       if (shot_cell == 2){
        //         st = 'miss'
        //       }else{st  = 'shot_ship'}
        //       break
        //     }else if(shot_cell == 2){break}
        //   }
        //   if (st = 'random_shot'){
        //   for (let tt = 1; tt <5; tt++){
        //     let shot_cell = shot_enemy.querySelector(`.r${m+tt}`).querySelector(`.c${n}`).dataset.state
        //     if (shot_cell < 2){ 
        //       shot_cell = `${shot_cell * 1 + 2}`
        //       check_health(n, m+tt)
        //       if (shot_cell == 2){
        //         st = 'miss'
        //       }else{st  = 'shot_ship'}
        //       break
        //     }else if(shot_cell == 2){break}
        //     }
        //   } 
        // }

      }
    }
    if (st != 'random_shot') { break }
  }
  if (st == 'shot_ship') {
    setTimeout(turn_enemy, 2000)
  } else if (st == 'miss') { gameState = "your_turn" }
  else {
    let rnd_r = random_num();
    let rnd_c = random_num();
    let shot_colum = shot_enemy.querySelector(`.r${rnd_r} .c${rnd_c}`);
    if (shot_colum.dataset.state < 2) {
      shot_colum.dataset.state = `${shot_colum.dataset.state * 1 + 2}`
      check_health(rnd_c, rnd_r)
      if (shot_colum.dataset.state == 3) {
        setTimeout(turn_enemy, 2000)
      } else { gameState = "your_turn" }
    } else { turn_enemy() }
  }
}

// Смотрит после выстрела вокруг и заполняет пустые клетки если там нет корабля (бомбит пока только по противнику)
function check_health(a, b) {
  let how_fire = ''
  if (gameState == "your_turn") {
    how_fire = 'enemy'
  } else { how_fire = 'self' }

  let memory_id = document.querySelector(`.battle-field.${how_fire} .r${b} .c${a}`).dataset.deck
  let a_ship = [] //colum
  let b_ship = []  // row
  let kill = 0

  for (let i = b - 1; i <= b + 1; i++) {
    for (let j = a - 1; j <= a + 1; j++) {
      if (i >= 0 && i < 10 && j >= 0 && j < 10) {
        if (document.querySelector(`.battle-field.${how_fire} .r${i} .c${j}`).dataset.deck == memory_id) {
          b_ship.push(i);
          a_ship.push(j);
        }
      }
    }
  }
  if (a_ship[0] == a_ship[1]) {
    for (let g = 0; g < 10; g++) {
      if (document.querySelector(`.battle-field.${how_fire} .r${g} .c${a_ship[0]}`).dataset.deck == memory_id) {
        if (!b_ship.includes(g)) {
          a_ship.push(a_ship[0]);
          b_ship.push(g);
        }
        if (document.querySelector(`.battle-field.${how_fire} .r${g} .c${a_ship[0]}`).dataset.state == 3) { kill += 1 }
      }
    }
  } else {
    for (let g = 0; g < 10; g++) {
      if (document.querySelector(`.battle-field.${how_fire} .r${b_ship[0]} .c${g}`).dataset.deck == memory_id) {
        if (!a_ship.includes(g)) {
          a_ship.push(g);
          b_ship.push(b_ship[0]);
        }
        if (document.querySelector(`.battle-field.${how_fire} .r${b_ship[0]} .c${g}`).dataset.state == 3) { kill += 1 }
      }
    }
  }
  if (kill == a_ship.length) {
    for (let paint = 0; paint <= a_ship.length; paint++) {
      for (let i = b_ship[paint] - 1; i <= b_ship[paint] + 1; i++) {
        for (let j = a_ship[paint] - 1; j <= a_ship[paint] + 1; j++) {
          if (i >= 0 && i < 10 && j >= 0 && j < 10) {
            if (document.querySelector(`.battle-field.${how_fire} .r${i} .c${j}`).dataset.state == 0) {
              document.querySelector(`.battle-field.${how_fire} .r${i} .c${j}`).dataset.state = 2
              document.querySelector(`.battle-field.${how_fire} .r${i} .c${j}`).classList.add("open")
            }
          }
        }
      }
    }
  }
}



function startGame() {
  // обработчик кнопки старт
  gameState = "your_turn"
  resetFields()
  return false;
}
function resetFields() {
  // сброс полей
  for (let own of ['self', 'enemy']) {
    let field = document.querySelector(`.battle-field.${own}`)
    let fieldShips = setShips()
    for (let i = 0; i < 10; i++) {
      let row = field.querySelector(`.r${i}`) // .r0 .r1 ... .r9
      for (let j = 0; j < 10; j++) {
        let cell = row.querySelector(`.c${j}`) //.c0 ... .c9
        if (own === 'self') {
          cell.classList.add("open")
        } else {
          cell.classList.remove("open")
        }
        cell.dataset.row = `${i}`
        cell.dataset.col = `${j}`
        cell.dataset.state = fieldShips[i][j] > 0 ? 1 : 0
        cell.dataset.deck = fieldShips[i][j]
        cell.dataset.own = own
      }
    }
  }
}

function setShips() {

  let warfield = [];
  for (let i = 0; i < 10; i++) {
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

  function set_ship(length_ship) {

    let start = length_ship - 1;
    let end = length_ship + 1;

    while (true) {

      let x = random_num();
      let y = random_num();

      if (y >= 3 && x >= 3 && y <= 6 && x <= 6) {
        // строит направо
        if (check(y, x) === 'True' && check(y, x + start) === 'True') {
          let rnd = Math.floor(Math.random() * 10000);
          for (i = x; i <= (x + start); i++) {
            warfield[y][i] = rnd;

          }
          break;
        }
      }
      // строит вниз
      else if (y < start && x < start) {
        if (check(y, x) === 'True' && check(y + start, x) === 'True') {
          let rnd = Math.floor(Math.random() * 10000);
          for (i = y; i <= (y + start); i++) {
            warfield[i][x] = rnd;

          }
          break;
        }
      }
      // строит влево
      else if (x > end && y < end) {
        if (check(y, x - start) === 'True' && check(y, x) === 'True') {
          let rnd = Math.floor(Math.random() * 10000);
          for (i = (x - start); i <= x; i++) {
            warfield[y][i] = rnd;
          }
          break;
        }
      }
      //строит вверх
      else if (x < end && y > end) {
        if (check(y - start, x) === 'True' && check(y, x) === 'True') {
          let rnd = Math.floor(Math.random() * 10000);
          for (i = (y - start); i <= y; i++) {
            warfield[i][x] = rnd;
          }
          break;
        }
      }
      //строит влево
      else if (x > end && y > end) {
        if (check(y - start, x) === 'True' && check(y, x) === 'True') {
          let rnd = Math.floor(Math.random() * 10000);
          for (i = (y - start); i <= y; i++) {
            warfield[i][x] = rnd;
          }
          break;
        }
      }
    }
  }

  ship_flot = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]

  for (let i = 0; i < 10; i++) {
    set_ship(Number(ship_flot[i]))
  }


  return warfield
}