import { Subject } from "rxjs";
import { AnsweredQuestion } from "../shared/answered-question.model";

export class AnsweredQuestionsService {
  private answeredQuestions: AnsweredQuestion[] = [];
  answeredQuestionChanged = new Subject<AnsweredQuestion[]>();

  // Get answer by given answer ID
  getAnsweredQUestion(answerId: number) {
    let newAnsweredQuestion = this.answeredQuestions.filter(answer => {
      return +answer.answerId === +answerId;
    });

    return newAnsweredQuestion;
  }

  // Get answeredQuestions array
  getAnsweredQuestions() {
      return this.answeredQuestions.slice();
  }

  // Count answeredQuestions
  countAnsweredQuestions() {
    return this.answeredQuestions.length;
  }

  // Add new answeredQuestion
  addAnsweredQuestion(answerId: number) {
    // Check if the answerId is already present in AnsweredQuestions array..
    // If present, increment the count. Otherwise, create new AnsweredQuestions.
    const index = this.answeredQuestions.findIndex((answeredQuestion => +answeredQuestion.answerId === +answerId));
    if (index >= 0) {
        // Anwer exsits. Increment the value
        this.answeredQuestions[index].amount++;
    } else {
        // It's new. Let's add it into the array
        this.answeredQuestions.push(new AnsweredQuestion(+answerId, 1));
    }

    // Send event
    this.answeredQuestionChanged.next(this.answeredQuestions.slice());
  }

  // Remove answeredQuestion by given answer ID
  removeAnswer(id: number) {
    let newAnsweredQuestionsArray = this.answeredQuestions.filter(answeredQuestion => {
      return +answeredQuestion.answerId !== +id;
    });
    this.answeredQuestions = newAnsweredQuestionsArray.slice();
    // Send event
    this.answeredQuestionChanged.next(this.answeredQuestions.slice());
  }

  // Clean all
  clean() {
    this.answeredQuestions = [];
  }

}

