import { Component, OnInit } from '@angular/core';
import { FashionService } from '../../services/fashion.service';
import { Fashion } from '../../models/Fashion';

interface FashionGroup {
  style: string;
  fashions: Fashion[];
}

@Component({
  selector: 'app-fashion-browse',
  templateUrl: './fashion-browse.component.html',
  styleUrls: ['./fashion-browse.component.css']
})
export class FashionBrowseComponent implements OnInit {
  fashionGroups: FashionGroup[] = [];
  styles: string[] = [];
  selectedStyle: string = '';
  errMessage: string = '';
  selectedFashion: Fashion | null = null;
  showDetail: boolean = false;

  constructor(private fashionService: FashionService) { }

  ngOnInit() {
    this.loadFashions();
    this.loadStyles();
  }

  loadFashions() {
    this.fashionService.getAllFashions().subscribe({
      next: (data) => {
        this.processFashions(data);
        this.errMessage = '';
      },
      error: (err) => {
        this.errMessage = "Error loading fashions: " + err.message;
      }
    });
  }

  loadStyles() {
    this.fashionService.getStyles().subscribe({
      next: (data) => {
        this.styles = data;
      },
      error: (err) => {
        console.error("Error loading styles:", err);
      }
    });
  }

  processFashions(fashions: Fashion[]) {
    const groupMap = new Map<string, Fashion[]>();
    
    fashions.forEach(fashion => {
      const style = fashion.style || 'Other';
      if (!groupMap.has(style)) {
        groupMap.set(style, []);
      }
      groupMap.get(style)!.push(fashion);
    });

    this.fashionGroups = Array.from(groupMap.entries()).map(([style, fashions]) => ({
      style,
      fashions
    }));
  }

  filterByStyle() {
    if (!this.selectedStyle) {
      this.loadFashions();
      return;
    }
    
    this.fashionService.filterByStyle(this.selectedStyle).subscribe({
      next: (data) => {
        this.processFashions(data);
        this.errMessage = '';
      },
      error: (err) => {
        this.errMessage = "Error filtering fashions: " + err.message;
      }
    });
  }

  viewDetail(fashion: Fashion) {
    this.selectedFashion = fashion;
    this.showDetail = true;
  }

  closeDetail() {
    this.showDetail = false;
    this.selectedFashion = null;
  }
}
