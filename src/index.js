const canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    rectangles = []

let isLeftMouseClicked = false

canvas.width = window.innerWidth * 0.7
canvas.height = window.innerHeight


class Rect{
    constructor(width, height){
        this.dimensions = {
            width, height
        }
        this.colors = { // override this in diferent rect styles (ie. excluded area)
            inner: 'green',
            outer: 'darkgreen'
        }
        this.draggedBoxPoint = false
        this.position = this.getStartingPosition()
        this.isHovered = false
    }

    draw(){
        ctx.beginPath()
        ctx.rect(
            this.position.x,
            this.position.y,
            this.dimensions.width,
            this.dimensions.height
        )
        ctx.fillStyle = this.colors.outer
        ctx.fill()

        if(!this.isHovered){
            const borderWidth = 10
            ctx.beginPath()
            ctx.rect(
                this.position.x + borderWidth,
                this.position.y + borderWidth,
                this.dimensions.width - borderWidth*2,
                this.dimensions.height - borderWidth*2
            )
            ctx.fillStyle = this.colors.inner
            ctx.fill()
        }
        return this
    }

    getStartingPosition(){
        // return object { x, y } (new boxex should render to the left or below previous ones)
        return { x: 100, y: 100 }
    }

    setHoverState(e){
        const hover =
            e.offsetX > this.position.x && e.offsetX < this.position.x + this.dimensions.width &&
            e.offsetY > this.position.y && e.offsetY < this.position.y + this.dimensions.height

        if(hover) this.isHovered = true
        else this.isHovered = false

        this.draggedBoxPoint = false
    }

    move(e){
        let newPosX, newPosY
        if(!this.draggedBoxPoint){
            this.draggedBoxPoint = {
                x: e.offsetX - this.position.x,
                y: e.offsetY - this.position.y
            }
        }

        newPosX = e.offsetX - this.draggedBoxPoint.x,
        newPosY = e.offsetY - this.draggedBoxPoint.y

        const isOutLeft = newPosX < 0
        const isOutRight = newPosX + this.dimensions.width > canvas.width
        const isOutTop = newPosY < 0
        const isOutBottom = newPosY + this.dimensions.height > canvas.height

        if(isOutLeft) newPosX = 0
        else if(isOutRight) newPosX = canvas.width - this.dimensions.width
        if(isOutTop) newPosY = 0
        else if(isOutBottom) newPosY = canvas.height - this.dimensions.height

        if(!this.isIntersecting()){
            const delta = 20 // rects move by delta pixels
            if(newPosX % delta >= delta/2) this.position.x = newPosX - newPosX % delta + delta
            if(newPosX % delta < delta/2) this.position.x = newPosX - newPosX % delta
            if(newPosY % delta >= delta/2) this.position.y = newPosY - newPosY % delta + delta
            if(newPosY % delta < delta) this.position.y = newPosY - newPosY % delta
        }
    }

    isIntersecting(){
        //intersection logic here
        return false
    }
}

function renderLoop(e){
    ctx.clearRect(0, 0, canvas.width, canvas.height) //clear canvas to draw again
    rectangles.forEach(rect => {
        if(rect.isHovered && isLeftMouseClicked) rect.move(e)
        if(!isLeftMouseClicked) rect.setHoverState(e)

        rect.draw()
    })
}

canvas.addEventListener('mousemove', renderLoop)

canvas.addEventListener('mousedown', e => {
    switch (e.which){
    case 1:
        isLeftMouseClicked = true
        break
    case 3:
        //right mouse button to remove elements
        break
    }
})

document.addEventListener('mouseup', e => {
    switch (e.which){
    case 1:
        isLeftMouseClicked = false
        break
    case 3:
        //right mouse button
        break
    }
})

document.querySelector('.createRect').addEventListener('click', () => {
    rectangles.push(new Rect(100, 100).draw())
})