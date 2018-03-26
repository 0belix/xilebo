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
        window.location.href='/'
      },
      error: (error) => {
        console.log(error)
      }
    })
  })
})
