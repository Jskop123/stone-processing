import Point from './Point'
import { canvas, ctx, rectangles } from '../index'

class Rect{
    constructor(width, height){
        this.dimensions = new Point(width, height)
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
            this.dimensions.x,
            this.dimensions.y
        )
        ctx.fillStyle = this.colors.outer
        ctx.fill()

        if(!this.isHovered){
            const borderWidth = 10
            ctx.beginPath()
            ctx.rect(
                this.position.x + borderWidth,
                this.position.y + borderWidth,
                this.dimensions.x - borderWidth*2,
                this.dimensions.y - borderWidth*2
            )
            ctx.fillStyle = this.colors.inner
            ctx.fill()
        }
        return this
    }

    getLeftTopCorner(){
        return this.position
    }

    getRightTopCorner(){
        return new Point(this.position.x + this.dimensions.x, this.position.y)
    }

    getLeftBottomCorner(){
        return new Point(this.position.x, this.position.y + this.dimensions.y)
    }

    getRightBottomCorner(){
        return new Point(this.position.x + this.dimensions.x, this.position.y + this.dimensions.y)
    }

    getStartingPosition(){
        // return Point (new boxex should render to the left or below previous ones)
        return new Point(100, 100)
    }

    setHoverState(e){
        const hover =
            e.offsetX > this.position.x && e.offsetX < this.getRightBottomCorner().x &&
            e.offsetY > this.position.y && e.offsetY < this.getRightBottomCorner().y

        if(hover) this.isHovered = true
        else this.isHovered = false

        this.draggedBoxPoint = false
    }

    move(e){
        let newPosX, newPosY
        if(!this.draggedBoxPoint){
            this.draggedBoxPoint = new Point(e.offsetX - this.position.x, e.offsetY - this.position.y)
        }

        newPosX = e.offsetX - this.draggedBoxPoint.x
        newPosY = e.offsetY - this.draggedBoxPoint.y

        const isOutLeft = newPosX < 0
        const isOutRight = newPosX + this.dimensions.x > canvas.width
        const isOutTop = newPosY < 0
        const isOutBottom = newPosY + this.dimensions.y > canvas.height

        if(isOutLeft) newPosX = 0
        else if(isOutRight) newPosX = canvas.width - this.dimensions.x
        if(isOutTop) newPosY = 0
        else if(isOutBottom) newPosY = canvas.height - this.dimensions.y

        //split to horizontal and vertical  intersections

        if(!this.isIntersecting()){
            const delta = 20 // rects move by delta pixels
            if(newPosX % delta >= delta/2) this.position.x = newPosX - newPosX % delta + delta
            if(newPosX % delta < delta/2) this.position.x = newPosX - newPosX % delta
            if(newPosY % delta >= delta/2) this.position.y = newPosY - newPosY % delta + delta
            if(newPosY % delta < delta) this.position.y = newPosY - newPosY % delta
        }
    }

    isIntersecting(){
        //split to horizontal and vertical  intersections so object can still be moved in one direction if it has space
        let state = false
        // need to add some + 1 in those lines
        const intersectionCondition = rect =>
            this.getLeftTopCorner().x > rect.getLeftTopCorner().x && this.getLeftTopCorner().x < rect.getRightTopCorner().x &&
            this.getLeftTopCorner().y > rect.getLeftTopCorner().y && this.getLeftTopCorner().y < rect.getLeftBottomCorner().y
            ||
            this.getRightTopCorner().x > rect.getLeftTopCorner().x && this.getRightTopCorner().x < rect.getRightTopCorner().x &&
            this.getRightTopCorner().y > rect.getLeftTopCorner().y && this.getRightTopCorner().y < rect.getLeftBottomCorner().y
            ||
            this.getLeftBottomCorner().x > rect.getLeftTopCorner().x && this.getLeftBottomCorner().x < rect.getRightTopCorner().x &&
            this.getLeftBottomCorner().y > rect.getLeftTopCorner().y && this.getLeftBottomCorner().y < rect.getLeftBottomCorner().y
            ||
            this.getRightBottomCorner().x > rect.getLeftTopCorner().x && this.getRightBottomCorner().x < rect.getRightTopCorner().x &&
            this.getRightBottomCorner().y > rect.getLeftTopCorner().y && this.getRightBottomCorner().y < rect.getLeftBottomCorner().y


        for(let i = rectangles.length; i--;){
            const rect = rectangles[i]
            if(intersectionCondition(rect)){
                state = true
                break
            }
        }
        return state
    }
}
export default Rect