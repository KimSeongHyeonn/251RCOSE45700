import { Component } from "~/Model/objects/component.object";
import { ComponentType, Position } from "~/Model/types/component.type";

export class Line extends Component {
  private _startX: number;
  private _startY: number;
  private _endX: number;
  private _endY: number;

  constructor({ startX = 0, startY = 0, endX = 100, endY = 100 }: { startX?: number; startY?: number; endX?: number; endY?: number }) {
    const minX = Math.min(startX, endX);
    const minY = Math.min(startY, endY);
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);

    super({ posX: minX, posY: minY, width, height });

    // 실제 선 좌표 저장
    this._startX = startX;
    this._startY = startY;
    this._endX = endX;
    this._endY = endY;
  }

  public get type(): ComponentType {
    return "line";
  }

  public get startX(): number {
    return this._startX;
  }
  public get startY(): number {
    return this._startY;
  }
  public get endX(): number {
    return this._endX;
  }
  public get endY(): number {
    return this._endY;
  }

  // 선 이동 오버라이드
  public override move({ dx, dy }: { dx: number; dy: number }): void {
    super.move({ dx, dy });

    // 실제 선의 좌표도 이동
    this._startX += dx;
    this._startY += dy;
    this._endX += dx;
    this._endY += dy;
  }

  // 선 크기 조정 오버라이드
  public override scale({ sx, sy }: { sx: number; sy: number }): void {
    // 기준점
    const originX = this.bound.x;
    const originY = this.bound.y;

    // 기준점 기준으로 상대 좌표 계산
    const relStartX = this._startX - originX;
    const relStartY = this._startY - originY;
    const relEndX = this._endX - originX;
    const relEndY = this._endY - originY;

    // 선의 좌표 스케일링 적용
    this._startX = originX + relStartX * sx;
    this._startY = originY + relStartY * sy;
    this._endX = originX + relEndX * sx;
    this._endY = originY + relEndY * sy;

    // 스케일링된 선 좌표로 bound 재계산
    const minX = Math.min(this._startX, this._endX);
    const minY = Math.min(this._startY, this._endY);
    const maxX = Math.max(this._startX, this._endX);
    const maxY = Math.max(this._startY, this._endY);

    this.setProperties({
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    });
  }

  // 선에 특화된 충돌 검사
  public override isContainPoint(point: Position): boolean {
    // 선분과 점 사이의 거리를 계산하여 충돌 여부 결정
    const lineLength = Math.sqrt(Math.pow(this._endX - this._startX, 2) + Math.pow(this._endY - this._startY, 2));

    if (lineLength === 0) return false;

    const distance =
      Math.abs((this._endY - this._startY) * point.x - (this._endX - this._startX) * point.y + this._endX * this._startY - this._endY * this._startX) /
      lineLength;

    const threshold = this.style.lineWidth ? Math.max(this.style.lineWidth, 3) : 3;

    // 점이 선에 충분히 가까운지 확인
    return distance <= threshold && super.isContainPoint(point);
  }
}
