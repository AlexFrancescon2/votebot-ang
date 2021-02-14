import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';

import { AnsweredQuestion } from "../shared/answered-question.model";
import { Answer } from '../shared/answer.model';

import { AnsweredQuestionsService } from '../answer-questions/answer-question.service';
import { PreparedQuestionsService } from '../prepare-questions/prepare-questions.service';


@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit, OnDestroy {
  chart: Chart;
  canvas: any;
  ctx: any;
  answeredQuestions: AnsweredQuestion[] = [];
  answers: Answer[] = [];
  chartIsActive: boolean = false;
  chartSteps: number = 1;
  chartStepTreshold:number = 10;
  title: string = '';
  private anwseredQuestionChangeSubs: Subscription;
  private anwsersChangeSubs: Subscription;
  private titleChangedSub: Subscription;
  private resetAllSubs: Subscription;

  constructor(private answeredQuestionsService: AnsweredQuestionsService,
    private preparedQuestionsService: PreparedQuestionsService) { }

  ngOnInit(): void {

    // Subscribe to anweredQUestion change
    this.anwseredQuestionChangeSubs = this.answeredQuestionsService.answeredQuestionChanged.subscribe(
      (answeredQuestions: AnsweredQuestion[]) => {
        this.answeredQuestions = answeredQuestions;

        // If is the first subscription, Init poll. Otherwise, Update poll
        if (answeredQuestions.length === 1 && !this.chartIsActive) {
            // Get and init poll
            this.chartIsActive = true;
            this.canvas = <HTMLCanvasElement>document.getElementById("poll");
            this.ctx = this.canvas.getContext("2d");
            this.initPoll();
        } else if (answeredQuestions.length > 0) {
            this.updatePoll();
        }

      }
    );

    // Subscribe to anwers change
    this.anwsersChangeSubs = this.preparedQuestionsService.answerChanged.subscribe(
      (answers: Answer[]) => {
        this.answers = answers;
        // Udpate also poll if is active
        if(this.chartIsActive) {
          this.updatePoll();
        }
      }
    );

    // Subscribe to title changes
    this.titleChangedSub = this.preparedQuestionsService.titleChanged.subscribe(
      (title: string) => {
        this.title = title;
      }
    );

    // Subscribe to reset all change
    this.resetAllSubs = this.preparedQuestionsService.resetAll.subscribe(
      () => {
        this.answeredQuestions = [];
        this.answers = [];
        this.title = '';
        if (this.chartIsActive) {
          this.chartIsActive = false;
          this.chartSteps = 1;
          this.chartStepTreshold = 10;
          this.chart.destroy();
        }
      }
    );
  }

  ngOnDestroy() {
    this.anwseredQuestionChangeSubs.unsubscribe();
    this.anwsersChangeSubs.unsubscribe();
    this.titleChangedSub.unsubscribe();
    this.resetAllSubs.unsubscribe();
  }

  // Init poll
  initPoll() {
     // Merge answers and answeredQUestion
     var mergedAnswers = this.answers.map(answer => ({...answer, ...this.answeredQuestions.find(
        answeredQuestion => answeredQuestion.answerId === answer.id
    )}));

    // Create labels and data values. Take just voted answers (amount > 1)
    var labels = [];
    var data = [];
    mergedAnswers.forEach(
        element => {
            if (element.amount > 0) {
                labels.push(element.text.length > 25 ? element.text.slice(0, 22) + '...' : element.text);
                data.push(element.amount);
            }
        }
    );

    this.chart = new Chart(this.ctx, {
      // The type of chart we want to create
      type: 'bar',

      // The data for our dataset
      data: {
          labels: labels,
          datasets: [{
              label: 'votes',
              backgroundColor: '#36a8be',
              borderColor: '#36a8be',
              data: data
          }]
      },
      // Configuration options go here
      options: {
          legend: {
              display: false
          },
          tooltips: {
              callbacks: {
                 label: function(tooltipItem) {
                        return tooltipItem.yLabel;
                 }
              }
          },
          maintainAspectRatio: false,
          responsive: true,
          scales: {
              yAxes: [{
                  stacked: true,
                   ticks: {
                      min: 0,
                      stepSize: 1,
                  }

              }]
          }
      }
    });
  }

  // Update poll
  updatePoll() {

    // Merge answers and answeredQUestion
    var mergedAnswers = this.answers.map(answer => ({...answer, ...this.answeredQuestions.find(
        answeredQuestion => answeredQuestion.answerId === answer.id
    )}));
    let increase: boolean = false;

    // Create labels and data values. Take just voted answers (amount > 1)
    let labels = [];
    var data = [];
    mergedAnswers.forEach(
        element => {
            if (element.amount > 0) {
                labels.push(element.text.length > 25 ? element.text.slice(0, 22) + '...' : element.text);
                data.push(element.amount);
                // Update dynamically chart steps.
                if (element.amount >= this.chartStepTreshold) {
                    increase = true;
                    this.chartSteps = this.chartStepTreshold;
                    let newAmount = (this.chartStepTreshold * (0.5)).toFixed(0);
                    this.chartStepTreshold = parseInt(newAmount) ;
                }
            }
        }
    );

    this.chart.data.datasets[0].data = data;
    this.chart.data.labels = labels;
    if (increase) {
        this.chart.options.scales.yAxes[0].ticks.stepSize = this.chartSteps;
    }
    this.chart.update({
        duration: 800,
        easing: 'easeOutBounce'
    });

  }

}
