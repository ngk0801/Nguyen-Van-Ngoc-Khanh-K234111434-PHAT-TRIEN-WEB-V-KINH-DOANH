import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Fashion } from '../../models/Fashion';

@Component({
  selector: 'app-fashion-detail',
  templateUrl: './fashion-detail.component.html',
  styleUrls: ['./fashion-detail.component.css']
})
export class FashionDetailComponent {
  @Input() fashion: Fashion | null = null;
  @Output() onClose = new EventEmitter<void>();

  close() {
    this.onClose.emit();
  }
}
