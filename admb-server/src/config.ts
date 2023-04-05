import { ProviderMapping } from "@admb/client/out/login-providers/registry";


export const ADMB_CONFIG_KEY = Symbol("admb-configuration");

/**
 * Configuration for AdmbServer
 */
export interface AdmbServerConfiguration {
   /**
    * the port to bind to.  Defaults to 8070
    */
   port?: number;

   /**
    * an array of controllers (ControllerDefs) the server instance can connect to
    */
   controllers: AdmbControllerDef[];

   /**
    * additional login providers to register with the `@admb/client`.
    */
   loginProviders?: ProviderMapping;
}

/**
 * Definition of a Controller that can be connected (logged in) to
 */
export interface AdmbControllerDef {
   /**
    * the base URL for the controller
    */
   url: string;

   /**
    * the account to use - defaults to `customer1`
    */
   account?: string;

   /**
    * the name of the controller to present to the user for selection
    * Defaults to `url (account)`
    */
   name?: string;

   /**
    * used to control grouping controllers under a common label.  It's common to leave
    * this undefined, meaning "do not group"
    */
   group?: string;
}