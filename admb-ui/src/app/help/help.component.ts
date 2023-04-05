import { Component, OnInit } from '@angular/core';
import * as defs from '@admb/pipeline/out/lang/processor-defs';
import { CommandDescription, CommandArgument } from '@admb/pipeline/out/lang/processor-defs/api';

@Component({
  selector: 'admb-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  visible = false;
  cmds:CommandDescription[];
  cmdMarkdown:string;

  constructor() { 
    this.cmds = Object.values(defs).sort();
    this.cmdMarkdown = this.cmds.map(cmd).join('');
  }

  ngOnInit(): void {
  }

}

const cmd = (cmd:CommandDescription) => `
### ${cmd.name} 
${cmd.documentation}
${args(cmd.arguments)}
`;
const args = (args:CommandArgument[]) => {
  if (!args || args.length == 0) return '';
  return '#### Arguments' + args.map(arg => `
- **${arg.name}** | ${arg.type}  ${arg.optional ? '' : '*(required)*'}  
  ${arg.documentation.trim()}`).join('')};
