import { Injectable } from '@angular/core';
import { Member } from './member';
import { MEMBERS } from './mock-members';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { catchError, map , tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private membersUrl  = 'api/members';
  private httpOptions =  {
    headers: new HttpHeaders({ 'Contet-Type': 'application/json' })
  };

  constructor(
      private http: HttpClient,
      private messageService: MessageService
  ) { }

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.membersUrl)
    .pipe(
        tap(members => this.log('社員データを取得しました')),
        catchError(this.handleError<Member[]>('getMembers', []))
    );
  }

  getMember(id: number): Observable<Member | undefined> {
    const url = `${this.membersUrl}/${id}`;
    return this.http.get<Member>(url)
        .pipe(
            tap(_ => this.log(`社員データ(id=${id})を取得しました`)),
            catchError(this.handleError<Member>(`getMember id=${id}`))
        );
  }

  updateMember(member: Member | undefined): Observable<any> {
    return this.http.put(this.membersUrl, member, this.httpOptions)
        .pipe(
            tap(_ => this.log(`社員データを変更しました`)),
            catchError(this.handleError<any>('updateMember'))
        )
  }

  private log(message: string) {
    this.messageService.add(`MemberService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} 失敗: ${error.message}`)

      return of(result as T);
    }
  }
}
