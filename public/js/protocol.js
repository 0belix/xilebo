// 'use strict'

$(document).ready(() => {
  // $('.containerFlex').on('click', (e) => {}),
  $('.containerFlex').on('click', calc)
})

let calc = function () {
  for (j = 1; j < 17; j++) { 
    let sum = 0
    for (i = 1; i < 9; i++) {
      if (!(i >= 6 && i <= 7 && j >= 15)) {
        sum += getN('#d' + i + 'h' + j + '_home')
      }
    }
    document.querySelector('#h' + j + '_sum_home').textContent = sum
    if (j > 1) {
      sum += parseInt(document.querySelector('#h' + (j - 1) + '_tot_home').textContent, 10)
    }
    document.querySelector('#h' + j + '_tot_home').textContent = sum
  }
}

let getN = function (cell) {
  if (document.querySelector(cell).textContent.length > 0 && !isNaN(document.querySelector(cell).textContent)) {
    return parseInt(document.querySelector(cell).textContent, 10)
  } else {
    return 0
  }
}
