import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
//Components
import { AppComponent } from './app.component';
import { ArticleComponent } from './article/article.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ArticleListComponent } from './article-list/article-list.component';
//Services
import { ArticleService } from './article.service';
import { ArticleListHeaderComponent } from './article-list-header/article-list-header.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticleComponent,
    SidebarComponent,
    ArticleListComponent,
    ArticleListHeaderComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [ArticleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
