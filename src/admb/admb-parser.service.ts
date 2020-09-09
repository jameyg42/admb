import { Injectable } from '@angular/core';
import * as parser from '@metlife/appd-services-js/lib/metrics-pipeline/parser';

@Injectable({
  providedIn: 'root'
})
export class AdmbParserService {
  constructor() { }

  parse(expr: string): ParseResult {
    let parseResult = {expr, ast: null, valid: false} as ParseResult;
    try {
      const p = parser.streaming();
      p.feed(expr);
      const ast = p.results.length === 1 ? p.results[0] : null;
      if (ast) {
        parseResult = {expr, ast, valid: true };
      } else {
        parseResult = {expr, ast, valid: false};
      }
    } catch (e) {
      parseResult = {expr, valid: false, error: e};
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

