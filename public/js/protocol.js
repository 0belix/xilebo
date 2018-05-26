// 'use strict'

$(document).ready(() => {
  $('a').click((e) => { e.preventDefault() })
  $('.btn-container').on('click', (e) => { button_toggler(e) })
  $('.containerFlex').on('click', (e) => { calculate_sum_heat() })
  $('.containerFlex').on('click', (e) => { calculate_sum_driver() })
  $('.containerFlex').on('click', (e) => { calculate_bonus_driver() })
  $('.containerFlex').on('click', (e) => {
    if (e.shiftKey) {
      lane_changer(e)
    } else if (e.ctrlKey) {
      drivers_hider(e)
    } else if (e.altKey) {
      heats_hider(e)
    }
  })
  // $('.containerFlex').on('click', calc)
})

let filtered_heat = ''
let scoring_active = false
let lane_direction = 'right'

function button_toggler(e) {
  let theID = e.target.id
  e.target.classList.toggle('active')
  if (theID === 'butt_round') {
    document.querySelector('#btn-container-misc').classList.toggle('hide')
  } else if (theID === 'butt_reverse_lanes') {
    lane_changer(e)
    lane_direction = (lane_direction === 'right') ? 'left' : 'right'
    setTimeout(() => { document.querySelector('#butt_reverse_lanes').classList.toggle('active') }, 666);
    setTimeout(() => { document.querySelector('#btn-container-misc').classList.toggle('hide') }, 1234);
    setTimeout(() => { document.querySelector('#butt_round').classList.toggle('active') }, 1900);
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

function h16_hider(e) {
  let theID = e.target.id
  if (theID === 'h16_home' || theID === 'h16_away') {
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
}

function heats_hider(e) {
  let theID = e.target.id
  let theRE = /(^h([1-9]|1[0-5])_home$|^h([1-9]|1[0-5])_away$)/g
  if (theID.match(theRE)) {
    for (let x = 0; x < 2; x++) {
      let where = (x === 0) ? '_home' : '_away'
      let sbh = true
      for (let j = 1; j <= 15; j++) {
        if (theID === 'h' + j + '_home' || theID === 'h' + j + '_away') { continue }
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
    scoring_active = (scoring_active) ? false : true
    check_buttons()
  }
}

function drivers_hider(e) {
  let theID = e.target.id
  let theRE = /(^h([1-9]|1[0-6])_home$|^h([1-9]|1[0-6])_away$)/g
  let heat = theID.replace(/\D/g, '')
  if (theID.match(theRE)) {
    if (filtered_heat === theID || filtered_heat === '') {
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
      filtered_heat = (filtered_heat === '') ? theID : ''
      check_buttons()
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

function check_buttons() {
  console.log(scoring_active)
  console.log(filtered_heat)

  let score_element = document.querySelector('#btn-container-score')
  let lanes_colors_element = document.querySelector('#btn-container-lanes-colors')

  if (scoring_active && filtered_heat !== '') {
    if (score_element.classList.contains('hide')) {
      score_element.classList.remove('hide')
    }
    if (!lanes_colors_element.classList.contains('hide')) {
      lanes_colors_element.classList.add('hide')
    }
  } else if (scoring_active && filtered_heat === '') {
    if (lanes_colors_element.classList.contains('hide')) {
      lanes_colors_element.classList.remove('hide')
    }
    if (!score_element.classList.contains('hide')) {
      score_element.classList.add('hide')
    }
  } else {
    if (!score_element.classList.contains('hide')) {
      score_element.classList.add('hide')
    }
    if (!lanes_colors_element.classList.contains('hide')) {
      lanes_colors_element.classList.add('hide')
    }
  }
}
