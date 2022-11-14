import { Injectable } from '@angular/core';
import { AdmbCompletionProvider } from "@metlife/admb-lang";
import { firstValueFrom } from 'rxjs';
import { LoginService } from 'src/app/login/login.service';
import { AdmbService } from '../svc/admb.service';

@Injectable({
  providedIn: 'root'
})
export class CodeEditorCompletionService implements AdmbCompletionProvider {
  appsCache:string[]|null;
  constructor(private services:AdmbService, private login:LoginService) { 
    login.userChange$.subscribe((user) => {
      this.appsCache = null;
      if (user) {
        this.listApps();
      }
    });
  }
  listApps(): Promise<string[]> {
    return this.appsCache 
      ? Promise.resolve(this.appsCache) 
      : firstValueFrom(this.services.listApps())
        .then(apps => apps.map(app => app.name))
        .then(apps => {
          this.appsCache = apps;
          return apps;
        });
  }
  browseTree(app: string, path: string[]): Promise<string[]> {
    return firstValueFrom(this.services.browseTree(app, path));
  }
}
