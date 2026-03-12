import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FashionAPIService } from '../fashion-api.service';
import { Fashion } from '../models/Fashion';

@Component({
  selector: 'app-fashion-detail',
  templateUrl: './fashion-detail.component.html',
  styleUrls: ['./fashion-detail.component.css']
})
export class FashionDetailComponent implements OnInit {
  fashion: Fashion = new Fashion();
  errMessage: string = '';

  constructor(
    private route: ActivatedRoute,
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

  goBack() {
    window.history.back();
  }
}
