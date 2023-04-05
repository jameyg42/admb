import { LoginProvider } from "./spi"

export type ProviderMapping = {[method:string]:LoginProvider};

export class LoginProviderRegistry {
   private providers:ProviderMapping = {};
   constructor (providers?: ProviderMapping) {
      if (providers) {
         for (let p in providers) {
            this.register(p, providers[p]);
         }
      }
   }
   lookup(method:string):LoginProvider {
      const provider = this.providers[method];
      if (!provider) {
         throw new Error(`no provider found for method '${method}'`);
      }
      return provider;
   }
   register(method:string, provider:LoginProvider) {
      this.providers[method] = provider;
   }
}

