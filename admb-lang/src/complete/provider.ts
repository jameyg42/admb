/**
 * a type that can provide metric-pipeline data for ADMB autocomplete
 */
export interface AdmbCompletionProvider {
  /**
   * return a list all the applications 
   */
  listApps():Promise<string[]>;

  /**
   * returns all child nodes for nodes matching the given app/path
   * @param app 
   * @param path 
   */
  browseTree(app:string, path:string[]):Promise<string[]>;
}
 
/**
 * A CompletionProvider that "provides" no results (empty arrays).
 * This is mainly intended for testing purposes.
 */
export class NoOpProvider implements AdmbCompletionProvider {
  listApps():Promise<string[]> {
    return Promise.resolve([]);
  }
  browseTree(app:string, path:string[]):Promise<string[]> {
    return Promise.resolve([]);
  }
}
