import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../article';
import { Observable } from 'rxjs';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  //articles: Article[];
  public articles: Observable<Article[]>

  constructor(
          private articleService: ArticleService,
          private route: ActivatedRoute
      ) { 
          this.articles = articleService.orderedArticles;
  }

  ngOnInit() {
/*          this.articleService.getArticles().then(articles => {
              this.articles = articles;
          })*/
          this.route.params.subscribe(params => {
              const sourceKey = params['sourceKey'];
              this.articleService.updateArticles(sourceKey);
          })
          this.articleService.getArticles();
  }

}
