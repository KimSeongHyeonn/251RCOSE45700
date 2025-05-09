import { DrawableShape } from "~/Model/interfaces/drawable-shape.interface";
import { DrawStrategy } from "~/ViewModel/drawStrategies/draw.strategy";

export abstract class BaseDrawStrategy<T extends DrawableShape> implements DrawStrategy<T> {
  public draw(ctx: CanvasRenderingContext2D, shape: T): void {
    // 컨텍스트 상태 저장
    ctx.save();

    try {
      ctx.beginPath();
      this.drawShape(ctx, shape);

      // 스타일 적용
      if (shape.fillStyle) {
        ctx.fillStyle = shape.fillStyle;
        ctx.fill();
      }
      if (shape.strokeStyle) {
        ctx.strokeStyle = shape.strokeStyle;
        if (shape.lineWidth !== undefined) {
          ctx.lineWidth = shape.lineWidth;
        }
        if (shape.lineDash !== undefined) {
          ctx.setLineDash(shape.lineDash);
        }
      }

      ctx.stroke();
    } finally {
      // 컨텍스트 상태 복원
      ctx.restore();
    }
  }

  // 각 도형에 맞는 그리기 로직 구현
  protected abstract drawShape(ctx: CanvasRenderingContext2D, shape: T): void;
}
