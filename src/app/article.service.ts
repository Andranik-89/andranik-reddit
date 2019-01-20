import { Injectable } from '@angular/core';
import { Article } from './article';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import 'rxjs';
import { map, filter, tap } from 'rxjs/operators';


import { environment } from '../environments/environment';

interface ArticleSortFn {
    (a: Article, b: Article): number;
}

interface ArticleSortOrderFn {
    (direction: number): ArticleSortFn;
}

const sortByTime: ArticleSortOrderFn = (direction: number) => (a: Article, b: Article) => {
    return direction * (b.publishedAt.getTime() - a.publishedAt.getTime());
}

const sortByVotes: ArticleSortOrderFn = (direction: number) => (a: Article, b: Article) => {
    return direction * (b.votes - a.votes);
}

const sortFns = {
    'Time': sortByTime,
    'Votes': sortByVotes
}

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    private _articles: BehaviorSubject<Article[]> = new BehaviorSubject<Article[]>([]);
    private _sources: BehaviorSubject<any> = new BehaviorSubject<any>([]);

    private refreshSubject: BehaviorSubject<string> = new BehaviorSubject<string>('reddit-r-all');
    private sortByDirectionSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);
    private sortByFilterSubject: BehaviorSubject<ArticleSortOrderFn> = new BehaviorSubject<ArticleSortOrderFn>(sortByTime);
    private filterBySubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

    public sources: Observable<any> = this._sources.asObservable();
    public articles: Observable<Article[]> = this._articles.asObservable();
    public orderedArticles: Observable<Article[]>;
    constructor(
        private http: HttpClient
        ) { 
        this.refreshSubject
            .subscribe(
                this.getArticles.bind(this));

        this.orderedArticles = 
            combineLatest( this._articles, this.sortByFilterSubject, this.sortByDirectionSubject, this.filterBySubject )
            .pipe(map(([articles, sorter, direction, filterStr]) => {
                const re = new RegExp(filterStr, 'gi');
                return articles
                    .filter(a => re.exec(a.title))
                    .sort(sorter(direction))
        }))
    }

    public sortBy( filter: string, direction: number) : void {
        this.sortByDirectionSubject.next(direction);
        this.sortByFilterSubject.next(sortFns[filter]);
    }

    public filterBy(filter: string) {
        this.filterBySubject.next(filter);
    }

    public updateArticles(sourceKey): void {
        this.refreshSubject.next(sourceKey);
    }

    public getArticles(sourceKey: string = 'reddit-r-all'): void {
        //make the http request -> Observable
        //converte response into article class
        //update our subject
        this.httpReq('/v1/articles', sourceKey)
            .pipe(map(json => json.articles))
            .subscribe(articlesJSON => {
                console.log('here: ', articlesJSON);
                const articles = articlesJSON
                    .map(articlejson => Article.fromJSON(articlejson));
                this._articles.next(articles);
            })
    }

    public getSources(): void {
        this.httpReq('/v1/sources')
            .pipe(
                tap(data => console.log('data: ', data)),
                map(json => json.sources),
                filter(list => list.length > 0),
            )
            .subscribe(this._sources)

    }

    private httpReq(path: string, sourceKey?: string): Observable<any> {
        let params = new HttpParams();
        params = params.append('apiKey', environment.newsApiKey);
        if (sourceKey && sourceKey !== '') {
            params = params.append('source', sourceKey);
        }
        //`${baseUrl}/v1/articles?apiKey=${newsApiKey}`
        return this.http
            .get(`${environment.baseUrl}${path}`, {
                params: params
            })
//            .pipe(map(resp => resp.json()))
/*            .then( resp => resp.json())
            .then( json => json.articles)
            .then( articles => {
                console.log(articles);
                return articles
                        .map(article => Article.fromJSON(article));
            })*/
/*            .catch(err => {
                console.log(err);
            })*/
    }
}
