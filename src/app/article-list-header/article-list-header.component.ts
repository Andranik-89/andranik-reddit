import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';

declare var jQuery: any;

@Component({
  selector: 'app-article-list-header',
  templateUrl: './article-list-header.component.html',
  styleUrls: ['./article-list-header.component.css']
})
export class ArticleListHeaderComponent implements OnInit {

    public currentFilter: string = 'Time';
    public sortDirection: number = 1;

  constructor(
      private articleService: ArticleService
      ) { }

  ngOnInit() {
      jQuery('.ui.dropdown').dropdown();
  }

  changeDirection() {
      this.sortDirection = this.sortDirection * -1;
      this.updateSort();
  }

  changeSort(filter: string) {
      if (filter === this.currentFilter) {
          this.changeDirection();
      } else {
          this.currentFilter = filter;
          this.updateSort();
      }
  }

  liveSearch(evt) {
      const val = evt.target.value;
      this.articleService.filterBy(val);
  }

  updateSort() {
      this.articleService.sortBy(this.currentFilter, this.sortDirection);
  }

}
