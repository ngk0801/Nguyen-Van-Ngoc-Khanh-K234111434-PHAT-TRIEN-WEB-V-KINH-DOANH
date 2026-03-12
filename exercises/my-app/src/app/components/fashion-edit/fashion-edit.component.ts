import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FashionAPIService } from '../fashion-api.service';
import { Fashion } from '../models/Fashion';

@Component({
  selector: 'app-fashion-edit',
  templateUrl: './fashion-edit.component.html',
  styleUrls: ['./fashion-edit.component.css']
})
export class FashionEditComponent implements OnInit {
  fashion = new Fashion();
  errMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _service: FashionAPIService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this._service.getFashion(id).subscribe({
        next: (data) => { this.fashion = data; },
        error: (err) => { this.errMessage = err.message; }
      });
    }
  }

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

  putFashion() {
    if (!this.fashion.style || !this.fashion.fashion_subject || !this.fashion.fashion_detail) {
      this.errMessage = "Please fill in all required fields!";
      return;
    }

    this._service.putFashion(this.fashion).subscribe({
      next: (data) => {
        this.successMessage = "Fashion updated successfully!";
        this.errMessage = '';
        setTimeout(() => {
          this.router.navigate(['/fashions']);
        }, 1500);
      },
      error: (err) => {
        this.errMessage = "Error updating fashion: " + err.message;
        this.successMessage = '';
      }
    });
  }

  goBack() {
    this.router.navigate(['/fashions']);
  }
}
