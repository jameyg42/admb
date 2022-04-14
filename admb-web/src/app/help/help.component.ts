import { Component, OnInit } from '@angular/core';

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
