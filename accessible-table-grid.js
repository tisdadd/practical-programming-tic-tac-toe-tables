const selectables = document.querySelectorAll('table td[role="gridcell"]')

selectables[0].setAttribute('tabindex', 0)

const trs = document.querySelectorAll('table tbody tr')
let row = 0
let col = 0
let maxrow = trs.length - 1
let maxcol = 0

trs.forEach(gridrow => {
  gridrow.querySelectorAll('td').forEach(el => {
    el.dataset.row = row
    el.dataset.col = col
    el.ariaColIndex = col + 1
    el.ariaRowIndex = row + 1
    el.ariaLabel = `Row ${row + 1}, Column ${col + 1} - Not Yet Played`
    col++
  })
  if (col > maxcol) {
    maxcol = col - 1
  }
  col = 0
  row++
})

function moveto (newrow, newcol) {
  const tgt = document.querySelector(
    `[data-row="${newrow}"][data-col="${newcol}"]`
  )
  if (tgt?.getAttribute('role') === 'gridcell') {
    document.querySelectorAll('[role=gridcell]').forEach(el => {
      el.setAttribute('tabindex', '-1')
    })
    tgt.setAttribute('tabindex', '0')
    tgt.focus()
    return true
  } else {
    return false
  }
}

document.querySelector('table').addEventListener('keydown', event => {
  const col = parseInt(event.target.dataset.col, 10)
  const row = parseInt(event.target.dataset.row, 10)
  switch (event.key) {
    case 'ArrowRight': {
      const newrow = col === 6 ? row + 1 : row
      const newcol = col === 6 ? 0 : col + 1
      moveto(newrow, newcol)
      break
    }
    case 'ArrowLeft': {
      const newrow = col === 0 ? row - 1 : row
      const newcol = col === 0 ? 6 : col - 1
      moveto(newrow, newcol)
      break
    }
    case 'ArrowDown':
      moveto(row + 1, col)
      break
    case 'ArrowUp':
      moveto(row - 1, col)
      break
    case 'Home': {
      if (event.ctrlKey) {
        let i = 0
        let result
        do {
          let j = 0
          do {
            result = moveto(i, j)
            j++
          } while (!result)
          i++
        } while (!result)
      } else {
        moveto(row, 0)
      }
      break
    }
    case 'End': {
      if (event.ctrlKey) {
        let i = maxrow
        let result
        do {
          let j = maxcol
          do {
            result = moveto(i, j)
            j--
          } while (!result)
          i--
        } while (!result)
      } else {
        moveto(
          row,
          document.querySelector(
            `[data-row="${event.target.dataset.row}"]:last-of-type`
          ).dataset.col
        )
      }
      break
    }
    case 'PageUp': {
      let i = 0
      let result
      do {
        result = moveto(i, col)
        i++
      } while (!result)
      break
    }
    case 'PageDown': {
      let i = maxrow
      let result
      do {
        result = moveto(i, col)
        i--
      } while (!result)
      break
    }
    case 'Enter':
    case ' ': {
      makeMove(row, col)
      break
    }
  }
  event.preventDefault()
})
