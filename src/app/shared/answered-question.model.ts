export class AnsweredQuestion {
  public answerId: number;
  public amount: number;

  constructor(answerId: number, amount: number) {
      this.answerId = answerId;
      this.amount = amount;
  }
}
