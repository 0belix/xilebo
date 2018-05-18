// 'use strict'

$(document).ready(() => {
  $('.containerFlex').on('click', (e) => { calculate_sum_heat('_home') })
  $('.containerFlex').on('click', (e) => { calculate_sum_heat('_away') })
  $('.containerFlex').on('click', (e) => { calculate_sum_driver('_home') })
  $('.containerFlex').on('click', (e) => { calculate_sum_driver('_away') })
  $('.containerFlex').on('click', (e) => { calculate_bonus_driver('_home') })
  $('.containerFlex').on('click', (e) => { calculate_bonus_driver('_away') })
  $('.containerFlex').on('click', (e) => { hider(e) })
  $('.containerFlex').on('click', (e) => { lane_changer(e) })
  // $('.containerFlex').on('click', calc)
})

function lane_changer(e) {
  let one = document.querySelectorAll('.lane_1')
  let two = document.querySelectorAll('.lane_2')
  let three = document.querySelectorAll('.lane_3')
  let four = document.querySelectorAll('.lane_4')
  one.forEach((e) => {
    e.classList.remove('lane_1')
    e.classList.add('lane_2')
  })
  two.forEach((e) => {
    e.classList.remove('lane_2')
    e.classList.add('lane_1')
  })
  three.forEach((e) => {
    e.classList.remove('lane_3')
    e.classList.add('lane_4')
  })
  four.forEach((e) => {
    e.classList.remove('lane_4')
    e.classList.add('lane_3')
  })
}

function hider(e) {
  let theID = e.target.id
  let theRE = /(^h([1-9]|1[0-5])_home$|^h([1-9]|1[0-5])_away$)/
  if (theID === 'h16_home' || theID === 'h16_away') {
    for (let x = 0; x < 2; x++) {
      let where = x === 0 ? '_home' : '_away'
      document.querySelector('#h16' + where).classList.toggle('hide')
      for (let i = 1; i <= 8; i++) {
        document.querySelector('#d' + i + 'h16' + where).classList.toggle('hide')
      }
      document.querySelector('#h16_sum' + where).classList.toggle('hide')
      document.querySelector('#h16_tot' + where).classList.toggle('hide')
    }
    document.querySelector('#h16_time').classList.toggle('hide')
  } else {
    if (theID.match(theRE)) {
      for (let x = 0; x < 2; x++) {
        let where = x === 0 ? '_home' : '_away'
        for (let j = 1; j <= 15; j++) {
          if (theID === 'h' + j + '_home' || theID === 'h' + j + '_away') { continue }
          document.querySelector('#h' + j + '' + where).classList.toggle('hide')
          for (let i = 1; i <= 8; i++) {
            document.querySelector('#d' + i + 'h' + j + '' + where).classList.toggle('hide')
            if (j === 1) {
              document.querySelector('#d' + i + '_sum' + where).classList.toggle('hide')
              document.querySelector('#d' + i + '_bonus' + where).classList.toggle('hide')
              document.querySelector('#d' + i + '_heats' + where).classList.toggle('hide')
            }
          }
        document.querySelector('#h' + j + '_sum' + where).classList.toggle('hide')
          document.querySelector('#h' + j + '_tot' + where).classList.toggle('hide')
          if (x === 1) { document.querySelector('#h' + j + '_time').classList.toggle('hide') }
        }
        document.querySelector('#sum' + where).classList.toggle('hide')
        document.querySelector('#bonus' + where).classList.toggle('hide')
        document.querySelector('#heats' + where).classList.toggle('hide')
        document.querySelector('#sum_sum' + where).classList.toggle('hide')
        document.querySelector('#sum_bonus' + where).classList.toggle('hide')
        document.querySelector('#sum_heats' + where).classList.toggle('hide')
        document.querySelector('#tot_sum' + where).classList.toggle('hide')
        document.querySelector('#tot_bonus' + where).classList.toggle('hide')
        document.querySelector('#tot_heats' + where).classList.toggle('hide')
      }
    }
  }
}

function calculate_sum_heat(who) {
  for (let j = 1; j <= 16; j++) { 
    if (check_active_heat(j, who) == 0) {
      break
    }
    let sum = 0
    for (let i = 1; i <= 8; i++) {
      if (!(i >= 6 && i <= 7 && j >= 15)) {
        sum += get_points('#d' + i + 'h' + j + who)
      }
    }
    document.querySelector('#h' + j + '_sum' + who).textContent = sum
    if (j > 1) {
      sum += parseInt(document.querySelector('#h' + (j - 1) + '_tot' + who).textContent, 10)
    }
    document.querySelector('#h' + j + '_tot' + who).textContent = sum
  }
}

function calculate_sum_driver(who) {
  for (let i = 1; i <= 8; i++) {
    let sum = 0
    for (let j = 1; j <= 16; j++) {
      if (!(i >= 6 && i <= 7 && j >= 15)) {
        sum += get_points('#d' + i + 'h' + j + who)
      }
    }
    if (check_active_driver(i, who) > 0) {
      document.querySelector('#d' + i + '_sum' + who).textContent = sum
      document.querySelector('#d' + i + '_heats' + who).textContent = count_driver_heats(i, who)
    }
  }
}

function calculate_bonus_driver(who) {
  for (let i = 1; i <= 8; i++) {
    let sum = 0
    for (let j = 1; j <= 16; j++) {
      if (!(i >= 6 && i <= 7 && j >= 15)) {
        if (get_points('#d' + i + 'h' + j + who) === 2) {
          if (find_point(3, j, who)) {
            sum++
          }
        } else if (get_points('#d' + i + 'h' + j + who) === 1) {
          if (find_point(2, j, who)) {
            sum++
          }
        }
      }
    }
    if (sum > 0) {
      document.querySelector('#d' + i + '_bonus' + who).textContent = sum
    }
  }
}

function find_point(n, heat, who) {
  let found = false
  for (let i = 1; i <= 8; i++) {
    if (!(i >= 6 && i <= 7 && heat >= 15)) {
      if (get_points('#d' + i + 'h' + heat + who) === n) {
        found = true
      }
    }
  }
  return found
}

function get_points(cell) {
  let element = document.querySelector(cell)
  if (element.textContent.length > 0 && !isNaN(element.textContent)) {
    return parseInt(document.querySelector(cell).textContent, 10)
  } else {
    return 0
  }
}

function check_active_heat(heat, who) {
  let x = 0
  for (let i = 1; i <= 8; i++) {
    if (!(i >= 6 && i <= 7 && heat >= 15)) {
      if (document.querySelector('#d' + i + 'h' + heat + who).textContent.length > 0) {
        x++
      }
    }
  }
  return x
}

function check_active_driver(driver, who) {
  let x = 0
  for (let j = 1; j <= 16; j++) {
    if (!(driver >= 6 && driver <= 7 && j >= 15)) {
      if (document.querySelector('#d' + driver + 'h' + j + who).textContent.length > 0) {
        x++
      }
    }
  }
  return x
}

// Räknas som körd heat: F, FX, X, TT, R, M. Räknas ej: N, FN, RR.
function count_driver_heats(driver, who) {
  let x = 0
  for (let j = 1; j <= 16; j++) {
    if (!(driver >= 6 && driver <= 7 && j >= 15)) {
      let element = document.querySelector('#d' + driver + 'h' + j + who)
      if (element.textContent.length > 0 && element.textContent !== 'N' && element.textContent !== 'FN' && element.textContent !== 'RR') {
        x++
      }
    }
  }
  return x
}
