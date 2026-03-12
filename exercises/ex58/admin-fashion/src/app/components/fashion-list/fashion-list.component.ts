import { Component, OnInit } from '@angular/core';
import { FashionService } from '../../services/fashion.service';
import { Fashion } from '../../models/Fashion';

@Component({
  selector: 'app-fashion-list',
  templateUrl: './fashion-list.component.html',
  styleUrls: ['./fashion-list.component.css']
})
export class FashionListComponent implements OnInit {
  fashions: Fashion[] = [];
  styles: string[] = [];
  selectedStyle: string = '';
  errMessage: string = '';
  successMessage: string = '';
  editingId: string | null = null;
  showForm: boolean = false;
  currentFashion: Fashion = new Fashion();

  constructor(private fashionService: FashionService) { }

  ngOnInit() {
    this.loadFashions();
    this.loadStyles();
  }

  loadFashions() {
    this.fashionService.getAllFashions().subscribe({
      next: (data) => {
        this.fashions = data;
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

  filterByStyle() {
    if (!this.selectedStyle) {
      this.loadFashions();
      return;
    }
    
    this.fashionService.filterByStyle(this.selectedStyle).subscribe({
      next: (data) => {
        this.fashions = data;
        this.errMessage = '';
      },
      error: (err) => {
        this.errMessage = "Error filtering fashions: " + err.message;
      }
    });
  }

  viewDetail(fashion: Fashion) {
    console.log("View detail:", fashion);
    alert(`Fashion: ${fashion.title}\nDetail: ${fashion.detail}`);
  }

  editFashion(fashion: Fashion) {
    this.editingId = fashion._id;
    this.currentFashion = { ...fashion };
    this.showForm = true;
  }

  addNew() {
    this.editingId = null;
    this.currentFashion = new Fashion();
    this.showForm = true;
  }

  saveFashion() {
    if (!this.currentFashion.title || !this.currentFashion.style) {
      this.errMessage = "Please fill in all required fields!";
      return;
    }

    if (this.editingId) {
      this.fashionService.updateFashion(this.currentFashion).subscribe({
        next: (data) => {
          this.successMessage = "Fashion updated successfully!";
          this.showForm = false;
          this.loadFashions();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errMessage = "Error updating fashion: " + err.message;
        }
      });
    } else {
      this.fashionService.createFashion(this.currentFashion).subscribe({
        next: (data) => {
          this.successMessage = "Fashion created successfully!";
          this.showForm = false;
          this.loadFashions();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errMessage = "Error creating fashion: " + err.message;
        }
      });
    }
  }

  deleteFashion(id: string) {
    if (confirm("Are you sure you want to delete this fashion?")) {
      this.fashionService.deleteFashion(id).subscribe({
        next: (data) => {
          this.successMessage = "Fashion deleted successfully!";
          this.loadFashions();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errMessage = "Error deleting fashion: " + err.message;
        }
      });
    }
  }

  cancelForm() {
    this.showForm = false;
    this.editingId = null;
    this.currentFashion = new Fashion();
  }
}
