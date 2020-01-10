import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Application, MetricTimeseries, Range } from './model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class AdmbService {
  constructor(private http: HttpClient, private messageService: MessageService) { }

  public listApps(): Observable<Application[]> {
    return this.http.get<Application[]>('/api/apps')
      .pipe(
        catchError((e, c) => {
          this.messageService.add({severity: 'error', detail: e.message, life: 5000});
          throw e;
        })
      );
  }

  public execPipelineExpression(expr: string, app: Application, range: Range): Observable<any[]> {
    return this.http.post<any[]>('/api/pipeline/exec', {expr, app, range})
      .pipe(
        catchError((e, c) => {
          this.messageService.add({severity: 'error', detail: e.message, life: 5000});
          throw e;
        })
      );
}

}
