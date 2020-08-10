import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Application, Range } from './model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { HistoryService } from '../history-list/history.service';

@Injectable({
  providedIn: 'root'
})
export class AdmbService {
  constructor(private http: HttpClient, private historyService: HistoryService, private messageService: MessageService) {
  }

  public listApps(): Observable<Application[]> {
    return this.http.get<Application[]>('/api/apps')
      .pipe(
        catchError((e, c) => {
          this.messageService.add({severity: 'error', detail: e.message, life: 5000});
          throw e;
        })
      );
  }

  public execPipelineExpression(expr: string, range: Range, vars: any): Observable<any[]> {
    this.historyService.push(expr, range);
    return this.http.post<any[]>('/api/pipeline/exec', {expr, range, vars})
      .pipe(
        catchError((e, c) => {
          this.messageService.add({severity: 'error', detail: e.message, life: 5000});
          throw e;
        })
      );
  }

}
