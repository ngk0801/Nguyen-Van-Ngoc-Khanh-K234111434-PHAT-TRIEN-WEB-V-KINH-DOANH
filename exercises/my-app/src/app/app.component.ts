import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Fashion Management App';
  currentView = 'list';

  showFashionList() {
    this.currentView = 'list';
  }

  showFashionNew() {
    this.currentView = 'new';
  }
}
