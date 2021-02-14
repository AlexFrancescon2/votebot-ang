import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { PollComponent } from './poll/poll.component';
import { PrepareQuestionsComponent } from './prepare-questions/prepare-questions.component';
import { AnswerQuestionsComponent } from './answer-questions/answer-questions.component';
import { HeaderComponent } from './header/header.component';

// Services
import { PreparedQuestionsService } from './prepare-questions/prepare-questions.service';
import { AnsweredQuestionsService } from './answer-questions/answer-question.service';

@NgModule({
  declarations: [
    AppComponent,
    PollComponent,
    PrepareQuestionsComponent,
    AnswerQuestionsComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [PreparedQuestionsService, AnsweredQuestionsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
