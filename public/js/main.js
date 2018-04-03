// 'use strict'

$(document).ready(() => {
  $('.delete-club').on('click', (e) => {
    $target = $(e.target)
    const id = $target.attr('data-id')
    $.ajax({
      type: 'DELETE',
      url: '/clubs/' + id,
      success: (response) => {
        alert('Deleting Club')
        window.location.href='/clubs'
      },
      error: (error) => {
        console.log(error)
      }
    })
  })


  $('.delete-driver').on('click', (e) => {
    $target = $(e.target)
    const id = $target.attr('data-id')
    $.ajax({
      type: 'DELETE',
      url: '/drivers/' + id,
      success: (response) => {
        alert('Deleting Driver')
        window.location.href='/drivers'
      },
      error: (error) => {
        console.log(error)
      }
    })
  })
})
