// 'use strict'

// $(document).ready(() => {
//   $('a').click((e) => { e.preventDefault() })
//   $('.containerFlex').on('click', (e) => {
//     if (e.shiftKey) {
//       lane_changer(e)
//     } else if (e.ctrlKey) {
//       hider_rows(e)
//     } else if (e.altKey) {
//       hider_columns(e)
//     }
//   })
//   $('.containerFlex').on('click', calc)
// })

$(document).ready(() => {
  $('.btn-container').on('click', (e) => { button_toggler(e) })
  $('.containerFlex').on('click', (e) => { calculate_sum_heat() })
  $('.containerFlex').on('click', (e) => { calculate_sum_driver() })
  $('.containerFlex').on('click', (e) => { calculate_bonus_driver() })
  $('.containerFlex').on('click', (e) => { hider_rc(e) })
})

let selected_column = ''
let lane_direction = 'right'

function button_toggler(e) {
  let theID = e.target.id
  e.target.classList.toggle('active')
  if (theID === 'butt_round') {
    if (selected_column === '') {
      document.querySelector('#btn-container-misc').classList.toggle('hide')
    } else {
      hider_columns(selected_column)
      if (document.querySelectorAll('.txtDeco').length > 0) {
        document.querySelector('#btn-container-score').classList.toggle('hide')
      } else {
        if (!document.querySelector('#btn-container-lanes-colors').classList.contains('hide')) {
          document.querySelector('#btn-container-lanes-colors').classList.add('hide')
        }
      }
    }
    if (document.querySelector('#btn-container-lanes-colors').classList.contains('hide') &&
        document.querySelector('#btn-container-score').classList.contains('hide') &&
       !document.querySelector('#butt_round').classList.contains('active') &&
        document.querySelectorAll('.txtDeco').length === 0) {
      selected_column = ''
    }
  } else if (theID === 'butt_reverse_lanes') {
    lane_changer(e)
    lane_direction = (lane_direction === 'right') ? 'left' : 'right'
    auto_button_hider(theID)
  } else if (theID === 'butt_h16') {
    hider_h16()
    auto_button_hider(theID)
  } else if (theID === 'butt_d8_home') {
    d8_hider('_home')
    auto_button_hider(theID)
  } else if (theID === 'butt_d8_away') {
    d8_hider('_away')
    auto_button_hider(theID)
  }
}

function auto_button_hider(element) {
  let current_butt = document.querySelector('#' + element)
  let btn_container_misc = document.querySelector('#btn-container-misc')
  let butt_round = document.querySelector('#butt_round')

  if (current_butt.classList.contains('active')) {
    setTimeout(() => { current_butt.classList.remove('active') }, 666)
  }

  if (!btn_container_misc.classList.contains('hide')) {
    setTimeout(() => { btn_container_misc.classList.add('hide') }, 1234)
  }

  if (butt_round.classList.contains('active')) {
    setTimeout(() => { butt_round.classList.remove('active') }, 1900)
  }
}

function lane_changer(e) {
  let one = document.querySelectorAll('.lane_1')
  let two = document.querySelectorAll('.lane_2')
  let three = document.querySelectorAll('.lane_3')
  let four = document.querySelectorAll('.lane_4')
  one.forEach((e) => {
    e.classList.replace('lane_1', 'lane_2')
  })
  two.forEach((e) => {
    e.classList.replace('lane_2', 'lane_1')
  })
  three.forEach((e) => {
    e.classList.replace('lane_3', 'lane_4')
  })
  four.forEach((e) => {
    e.classList.replace('lane_4', 'lane_3')
  })
}

function hider_h16() {
  for (let x = 0; x < 2; x++) {
    let where = (x === 0) ? '_home' : '_away'
    document.querySelector('#h16' + where).classList.toggle('hide')
    for (let i = 1; i <= 8; i++) {
      document.querySelector('#d' + i + 'h16' + where).classList.toggle('hide')
    }
    document.querySelector('#h16_sum' + where).classList.toggle('hide')
    document.querySelector('#h16_tot' + where).classList.toggle('hide')
  }
  document.querySelector('#h16_time').classList.toggle('hide')
}

function d8_hider(where) {
  document.querySelector('#d8_row' + where).classList.toggle('hide')
}

function hider_columns(heat) {
  for (let x = 0; x < 2; x++) {
    let where = (x === 0) ? '_home' : '_away'
    let sbh = true
    for (let j = 1; j <= 15; j++) {
      if (heat === j) {
        continue
      }
      document.querySelector('#h' + j + '' + where).classList.toggle('hide')
      for (let i = 1; i <= 8; i++) {
        document.querySelector('#d' + i + 'h' + j + '' + where).classList.toggle('hide')
        if (sbh) {
          document.querySelector('#d' + i + '_sum' + where).classList.toggle('hide')
          document.querySelector('#d' + i + '_bonus' + where).classList.toggle('hide')
          document.querySelector('#d' + i + '_heats' + where).classList.toggle('hide')
        }
      }
      document.querySelector('#h' + j + '_sum' + where).classList.toggle('hide')
      document.querySelector('#h' + j + '_tot' + where).classList.toggle('hide')
      if (x === 1) { document.querySelector('#h' + j + '_time').classList.toggle('hide') }
      sbh = false
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
  document.querySelector('#time_sum').classList.toggle('hide')
  document.querySelector('#time_bonus').classList.toggle('hide')
  document.querySelector('#time_heats').classList.toggle('hide')
  document.querySelectorAll('.cell_width_51').forEach((e) => {
    e.classList.toggle('hide')
  })
}

function hider_rows(heat) {
  for (let x = 0; x < 2; x++) {
    let where = (x === 0) ? '_home' : '_away'
    document.querySelector('#h' + heat + where).classList.toggle('txtDeco')
    for (let i = 1; i <= 7; i++) {
      let element = document.querySelector('#d' + i + 'h' + heat + where)
      if (!(element.classList.contains('color_r') ||
            element.classList.contains('color_b') ||
            element.classList.contains('color_y') ||
            element.classList.contains('color_w'))) {
        element.parentElement.classList.toggle('hide')
      }
    }
  }
  document.querySelector('.row_height_30').parentElement.classList.toggle('hide')
}

function hider_rc(e) {
  let theID = e.target.id
  let heat = parseInt(theID.replace(/\D/g, ''), 10)
  let theRE = /(^h([1-9]|1[0-6])_home$|^h([1-9]|1[0-6])_away$)/g
  let e_round = document.querySelector('#butt_round')
  if (theID.match(theRE)) {
    if (!e_round.classList.contains('active')) {
      if (selected_column === '' || selected_column === heat) {
        hider_rows(heat)
        selected_column = (selected_column === '') ? heat : ''
      }
    } else if (e_round.classList.contains('active') && selected_column === '') {
      hider_columns(heat)
      selected_column = (selected_column === '') ? heat : ''
      document.querySelector('#btn-container-lanes-colors').classList.toggle('hide')
      if (!document.querySelector('#btn-container-misc').classList.contains('hide')) {
        document.querySelector('#btn-container-misc').classList.add('hide')
      }
    }
  }
}

function calculate_sum_heat() {
  for (let x = 0; x < 2; x++) {
    let who = (x === 0) ? '_home' : '_away'
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
}

function calculate_sum_driver() {
  for (let x = 0; x < 2; x++) {
    let who = (x === 0) ? '_home' : '_away'
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
}

function calculate_bonus_driver() {
  for (let x = 0; x < 2; x++) {
    let who = (x === 0) ? '_home' : '_away'
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
