import { Component } from '@angular/core';
import { FashionAPIService } from '../fashion-api.service';

@Component({
  selector: 'app-fashion',
  templateUrl: './fashion.component.html',
  styleUrls: ['./fashion.component.css']
})
export class FashionComponent {
  fashions: any;
  errMessage: string = '';

  constructor(public _service: FashionAPIService) {
    this._service.getFashions().subscribe({
      next: (data) => { this.fashions = data; },
      error: (err) => { this.errMessage = err.message; }
    });
  }

  viewDetail(id: any) {
    // Navigate to detail view (implement routing as needed)
    console.log("View detail for:", id);
  }

  editFashion(id: any) {
    // Navigate to edit view (implement routing as needed)
    console.log("Edit fashion:", id);
  }

  deleteFashion(id: any) {
    if (confirm("Are you sure you want to delete this fashion?")) {
      this._service.deleteFashion(id).subscribe({
        next: (data) => {
          this.fashions = this.fashions.filter((f: any) => f._id !== id);
          alert("Fashion deleted successfully!");
        },
        error: (err) => { this.errMessage = err.message; }
      });
    }
  }
}
