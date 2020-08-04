export class TimetableValidity {
  public from!: Date;
  public to!: Date;

  constructor(from?: Date, to?: Date) {
    const today = new Date();
    if (from != null && from > (to ?? today)) {
      throw Error('From must precede today or to');
    }
    if (to != null && to <= (from ?? today)) {
      throw Error('To must precede today or from');
    }

    this.from = new Date(from ?? today);
    this.to = new Date(to ?? today);
  }
}
