import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Fashion } from '../../models/Fashion';

@Component({
  selector: 'app-fashion-form',
  templateUrl: './fashion-form.component.html',
  styleUrls: ['./fashion-form.component.css']
})
export class FashionFormComponent {
  @Input() fashion: Fashion = new Fashion();
  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fashion.thumbnail = reader.result as string;
      };
    }
  }

  save() {
    this.onSave.emit();
  }

  cancel() {
    this.onCancel.emit();
  }
}
