import { Injectable } from '@angular/core';
import { compile } from '@admb/pipeline/out/lang/compiler';

@Injectable({
  providedIn: 'root'
})
export class AdmbParserService {
  constructor() { }

  parse(expr: string): ParseResult {
    let parseResult = {expr, valid: true} as ParseResult;
    try {
      parseResult.ast = compile(expr);
    } catch (e) {
      parseResult.valid = false;
      parseResult.error = e;
    }
    return parseResult;
  }
}

export interface ParseResult {
  expr: string;
  valid: boolean;
  ast?: any;
  error?: any;
}
