import { Completion } from '@codemirror/autocomplete';
import * as processorDefs from '@metlife/appd-pipeline/out/lang/processor-defs';
import { AdmbCompletionContext } from './moduule';
import { AdmbCompletionProvider } from './provider';

const commands:Completion[] = Object.values(processorDefs).map(def => ({
  label: def.name,
  info: def.documentation
}));



export function commandCompletions(context:AdmbCompletionContext, provider:AdmbCompletionProvider): Promise<Completion[]> {
  return Promise.resolve(commands);
}
export function nameCompletions(context:AdmbCompletionContext, provider:AdmbCompletionProvider): Promise<Completion[]> {
  const node = currentNode(context);
  const commandExpression = findParent(node, "CommandExpression");
  const command = text(commandExpression?.getChild("Command"), context);
  console.log(command);
  if (command != null) {
    const defs = processorDefs as ({[key:string]:CommandDescription})
    const def = defs[command];
    if (def) {
      const options = def.arguments?.map(arg => ({
        label:arg.name,
        info:arg.documentation
      }));
      return Promise.resolve(options || []);
    }
  }
  return Promise.resolve([]);

}
