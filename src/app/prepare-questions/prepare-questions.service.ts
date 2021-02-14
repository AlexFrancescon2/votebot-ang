import { Subject } from "rxjs";
import { Answer } from "../shared/answer.model";

export class PreparedQuestionsService {
  private title: string = '';
  private answers: Answer[] = [];
  private incrementalId: number = 1;
  answerChanged = new Subject<Answer[]>();
  titleChanged = new Subject<string>();
  resetAll = new Subject();

  // Get answer by given ID
  getAnswer(id: number) {
    let answer = this.answers.filter(answer => {
      return +answer.id === +id;
    });
    console.log(answer);

    return answer;
  }

  // Get answers array
  getAnswers() {
      return this.answers.slice();
  }

  // Get title
  getTitle() {
    return this.title;
  }

  // Update title
  updateTitle(title: string) {
    this.title = title;
    this.titleChanged.next(this.title);
  }

  // Count aswers
  countAnswers() {
    return this.answers.length;
  }

  // Add new answer
  addAnswer(text: string) {
      let answer: Answer = new Answer(this.incrementalId, text);
      this.incrementalId ++;
      this.answers.push(answer);
      this.answerChanged.next(this.answers.slice());
  }

  // modify answer
  modifyAnswer(id: number, newValue: string) {
    //Find index of specific object using findIndex method.
    var answerIndex = this.answers.findIndex((answer => +answer.id === +id));
    this.answers[answerIndex].text = newValue;
    this.answerChanged.next(this.answers.slice());
  }

  // Remove answer by given ID
  removeAnswer(id: number) {
    let newAnswerArray = this.answers.filter(answer => {
      return +answer.id !== +id;
    });
    this.answers = newAnswerArray.slice();
    this.answerChanged.next(this.answers.slice());
  }

  // Clean all
  clean() {
    this.answers = [];
  }

  // Reset all
  reset () {
    // Reset answers
    this.clean();
    // send Subject to reset other components
    this.resetAll.next();
  }
}

