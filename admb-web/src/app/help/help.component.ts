import { Component, OnInit } from '@angular/core';
import 'marked/lib/marked';

@Component({
  selector: 'admb-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  visible = false;

  constructor() { }

  ngOnInit(): void {
  }

}
