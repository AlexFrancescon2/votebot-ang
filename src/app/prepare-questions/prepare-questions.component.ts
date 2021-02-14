import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AnsweredQuestionsService } from '../answer-questions/answer-question.service';
import { Answer } from '../shared/answer.model';
import { PreparedQuestionsService } from './prepare-questions.service';

@Component({
  selector: 'app-prepare-questions',
  templateUrl: './prepare-questions.component.html',
  styleUrls: ['./prepare-questions.component.css']
})
export class PrepareQuestionsComponent implements OnInit, OnDestroy {
  title: string = '';
  incomingAnswer: string = '';
  totalPreparedAnswers: number = 0;
  answers: Answer[] = [];

  constructor(private preparedQuestionService: PreparedQuestionsService, private answeredQuestionsService: AnsweredQuestionsService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {

  }

  // Update title
  onTitleChange() {
    this.preparedQuestionService.updateTitle(this.title);
  }

  // Add new answer
  onAddAnswer(element: any) {
    let value = element.value;
    if (value) {
    // Add answer
    this.preparedQuestionService.addAnswer(element.value);
    // Increment count
    this.totalPreparedAnswers++;
    // retrieve new answers array
    this.answers = this.preparedQuestionService.getAnswers();
    // Clear it
    element.value = '';
    }
  }

  // Modify answer text
  onModifyAnswer(id: number, event:any) {
    // Get new value from input
    let newValue = event.target.value;
    // update
    this.preparedQuestionService.modifyAnswer(id, newValue);
    // retrieve new answers array
    this.answers = this.preparedQuestionService.getAnswers();
  }

  // Remove answer
  onRemoveAnswer(id: number) {
    this.preparedQuestionService.removeAnswer(id);
    // retrieve new answers array
    this.answers = this.preparedQuestionService.getAnswers();
    // decrement count
    this.totalPreparedAnswers--;
    // Remove all the Answered question with the given ID
    this.answeredQuestionsService.removeAnswer(id);
  }

  // Reset the components
  onReset() {
  if (confirm('Are you sure to reset all the components?')) {
      this.answers = [];
      this.title = '';
      this.preparedQuestionService.reset();
    }
  }


}
