import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TagModel} from '../models/TagModel';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private http: HttpClient) { }

  getTags(): Observable<any[]> {
    const url = 'http://localhost:8080/api/tag';

    return this.http.get<any[]>(url);
  }

  getExisting(name): Observable<TagModel> {
    const url = 'http://localhost:8080/api/tag/find-existing?name=' + name;

    return this.http.get<TagModel>(url);
  }
}
