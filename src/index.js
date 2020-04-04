import Rect from './classes/Rect'
import renderLoop from './renderLoop'

const canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    rectangles = []

canvas.width = window.innerWidth * 0.7
canvas.height = window.innerHeight

const controls = {
    isLeftMouseClicked: false,
    isRightMouseClicked: false
}

export {
    canvas,
    ctx,
    controls,
    rectangles
}

canvas.addEventListener('mousemove', renderLoop)

canvas.addEventListener('mousedown', e => {
    switch (e.which){
    case 1:
        controls.isRightMouseClicked = false //close modal on left click
        controls.isLeftMouseClicked = true //drag element
        break
    case 3:
        //right mouse button to remove elements
        break
    }
})

document.addEventListener('mouseup', e => {
    switch (e.which){
    case 1:
        controls.isLeftMouseClicked = false
        break
    case 3:
        //right mouse button
        break
    }
})

document.querySelector('.createRect').addEventListener('click', () => {
    rectangles.push(new Rect(100, 100).draw())
})