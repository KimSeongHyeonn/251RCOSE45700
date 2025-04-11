export class IdGenerator {
  private static instance: IdGenerator;
  private currentId: number = 1;

  private constructor() {}

  public static getInstance(): IdGenerator {
    if (!IdGenerator.instance) {
      IdGenerator.instance = new IdGenerator();
    }
    return IdGenerator.instance;
  }

  public generateId(): number {
    return this.currentId++;
  }
}
