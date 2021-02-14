import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnsweredQuestion } from '../shared/answered-question.model';
import { Subscription } from 'rxjs';

import { AnsweredQuestionsService } from './answer-question.service';
import { PreparedQuestionsService } from '../prepare-questions/prepare-questions.service';
import { Answer } from '../shared/answer.model';


@Component({
  selector: 'app-answer-questions',
  templateUrl: './answer-questions.component.html',
  styleUrls: ['./answer-questions.component.css']
})
export class AnswerQuestionsComponent implements OnInit, OnDestroy {
  answeredQuestions: AnsweredQuestion[] = [];
  answers: Answer[] = [];
  title: string = '';
  selectedAnswerId: number;
  private titleChangedSub: Subscription;
  private anwsersChangeSubs: Subscription;
  private resetAllSubs: Subscription;

  constructor(private answeredQuestionsService: AnsweredQuestionsService, private preparedQuestionsService: PreparedQuestionsService) { }

  ngOnInit(): void {
    this.answers = this.preparedQuestionsService.getAnswers();
    this.title = this.preparedQuestionsService.getTitle();

    // Subscribe to title changes
    this.titleChangedSub = this.preparedQuestionsService.titleChanged.subscribe(
      (title: string) => {
        this.title = title;
      }
    );

    // Subscribe to anwers change
    this.anwsersChangeSubs = this.preparedQuestionsService.answerChanged.subscribe(
      (answers: Answer[]) => {
        this.answers = answers;
      }
    );

    // Subscribe to reset all change
    this.resetAllSubs = this.preparedQuestionsService.resetAll.subscribe(
      () => {
        this.title = '';
        this.answeredQuestions = [];
        this.answers = [];
        this.answeredQuestionsService.clean();
      }
    );
  }

  ngOnDestroy() {
    this.titleChangedSub.unsubscribe();
    this.anwsersChangeSubs.unsubscribe();
    this.resetAllSubs.unsubscribe();
  }

  // Disable vote button
  onDisableVoteButton(button:any) {
    button.disabled = false;
  }

  // On select radio
  onRadioSelect(id: number) {
    this.selectedAnswerId = id;
  }

  // on vote
  onVote(element: any) {
    this.answeredQuestionsService.addAnsweredQuestion(this.selectedAnswerId);
    this.answeredQuestions = this.answeredQuestionsService.getAnsweredQuestions();
    //element.disabled = true;
  }

}
