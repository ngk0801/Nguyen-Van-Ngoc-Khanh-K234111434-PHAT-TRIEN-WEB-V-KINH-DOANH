import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FashionAPIService } from '../fashion-api.service';
import { Fashion } from '../models/Fashion';

@Component({
  selector: 'app-fashion-new',
  templateUrl: './fashion-new.component.html',
  styleUrls: ['./fashion-new.component.css']
})
export class FashionNewComponent {
  fashion = new Fashion();
  errMessage: string = '';
  successMessage: string = '';

  constructor(
    private _service: FashionAPIService,
    private router: Router
  ) { }

  onFileSelected(event: any, fashion: Fashion) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        fashion.fashion_image = reader.result!.toString();
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }
  }

  postFashion() {
    if (!this.fashion.style || !this.fashion.fashion_subject || !this.fashion.fashion_detail) {
      this.errMessage = "Please fill in all required fields!";
      return;
    }

    this._service.postFashion(this.fashion).subscribe({
      next: (data) => {
        this.successMessage = "Fashion created successfully!";
        this.errMessage = '';
        this.fashion = new Fashion();
        setTimeout(() => {
          this.router.navigate(['/fashions']);
        }, 1500);
      },
      error: (err) => {
        this.errMessage = "Error creating fashion: " + err.message;
        this.successMessage = '';
      }
    });
  }

  goBack() {
    this.router.navigate(['/fashions']);
  }
}
