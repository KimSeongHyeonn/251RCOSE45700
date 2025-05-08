import { DrawableLine } from "../../Model/interfaces/drawable-shape.interface";
import { DrawStrategy } from "./draw.strategy";

export class LineDrawStrategy implements DrawStrategy<DrawableLine> {
  draw(ctx: CanvasRenderingContext2D, shape: DrawableLine) {
    ctx.beginPath();
    ctx.moveTo(shape.x1, shape.y1);
    ctx.lineTo(shape.x2, shape.y2);

    // 기본값 설정
    ctx.strokeStyle = shape.strokeStyle ?? "black";
    ctx.lineWidth = shape.lineWidth ?? 1;

    ctx.stroke();
  }
}
