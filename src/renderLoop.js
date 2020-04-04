import { canvas, ctx, rectangles, controls } from './index'

function renderLoop(e){
    ctx.clearRect(0, 0, canvas.width, canvas.height) //clear canvas to draw again
    rectangles.forEach(rect => {
        if(rect.isHovered && controls.isLeftMouseClicked) rect.move(e)
        if(!controls.isLeftMouseClicked) rect.setHoverState(e)

        rect.draw()
    })
}
export default renderLoop