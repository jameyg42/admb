import { HttpClient, HttpConfig, HttpResponse } from "@admb/client/out/http";
import { LoginProvider, SessionIds } from "@admb/client/out/login-providers/spi";
import { CookieJar } from "tough-cookie";
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent/http';
import { HTMLElement, parse as htmlParse} from 'node-html-parser';

type SAMLMethod = "get"|"post";

/**
 * class that implements a form-based SAML authentication sequence.
 * At the cost of legibility/complexity, this class intentionally decomposes
 * many of the descrete operations into individual method calls HOPEFULLY to 
 * allow for easier customization via subclassing (we'll see...)
 */
export class LoginFormProvider implements LoginProvider {
   /**
    * creates a new LoginFormProvider.  The arguments are CSS selectors that are used
    * to find/fill the login form and input elements
    * @param loginFormSelector 
    * @param usernameSelector 
    * @param passwordSelector 
    * @param accountSelector 
    */
   constructor(
      protected loginFormSelector:string="form",
      protected usernameSelector:string="input[name=USER]",
      protected passwordSelector:string="input[name=PASSWORD]",
      protected accountSelector?:string
   ) {}

   login(baseURL:string, account:string, username:string, password:string):Promise<SessionIds> {
      // the SAML flows will likely use cookies
      const jar = new CookieJar();
      const client = new HttpClient({
         httpAgent: new HttpCookieAgent({ cookies: { jar } }),
         httpsAgent: new HttpsCookieAgent({ cookies: { jar } }),
         baseURL
      });

      try {
         return this.doAppDynamicsSAMLRequest(client, baseURL, account)
            .then(rsp => this.doAuthenticate(client, rsp, username, account, password))
            .then(rsp => this.createSession(baseURL, client, jar));
      } catch (e) {
         return Promise.reject(e);
      }
   }



   /* Methods related to generating the SAMLRequest to submit to the SAML provider */

   /**
    * creates and submits the SAMLRequest to the SAML provider, returning the resulting
    * HttpResponse.
    * @param client 
    * @param baseURL 
    * @param account 
    * @returns 
    */
   doAppDynamicsSAMLRequest(client:HttpClient, baseURL:string, account:string):Promise<HttpResponse> {
      return this.createSAMLRequest(client, baseURL, account)
         .then(request => client.request(request));
   }

   /**
    * creates the SAML HttpRequest. By default, this ochestrates the calls between
    * getSAMLMethod, getSAMLRequest, and (if SAML method = POST) adaptSAMLRequestURLToPOST
    * methods
    * @param client 
    * @param baseURL 
    * @param account 
    */
   createSAMLRequest(client:HttpClient, baseURL:string, account:string):Promise<HttpConfig> {
      return this.getSAMLMethod(client, account)
         .then(method => 
            this.getSAMLRequest(client, baseURL, account)
            .then(url => this.adaptSAMLRequestToHttpRequest(url, method))
         );
   }

   /**
    * calls the AppDynamics query-saml-http-method endpoint to determine if SAML is configured for
    * GET or POST mode.  Returns the method.
    * @param client 
    * @param account 
    * @returns 
    */
   getSAMLMethod(client:HttpClient, account:string):Promise<SAMLMethod> {
      return client.get('/public-info', {
         'action' : 'query-saml-http-method',
         'account-name' : account
      })
      .then(rsp => rsp.data as SAMLMethod);
   }
   /**
    * calls the AppDynamics get-saml-auth-request-info endpoint to generate the SAMLRequest
    * URL that can be submitted to the SAML provider to trigger the authentication process
    * @param client 
    * @param baseURL 
    * @param account 
    * @returns 
    */
   getSAMLRequest(client:HttpClient, baseURL: string, account:string):Promise<string> {
      const requestedUrl = new URL(`/controller/?accountName=${account}#/location=HOME_FREQUENTLY_VISITED`, baseURL);
      return client.get('/saml-auth', {
              'action':'get-saml-auth-request-info',
              'account-name' : account,
              'requested-url' : Buffer.from(requestedUrl.toString()).toString('base64')
      })
      .then(rsp => rsp.data);
   }
   /**
    * AppD get-saml-auth-request-info will always be a URL response applicable with 
    * the SAML method is HTTP GET, but needs to be adjusted when the SAML method is
    * HTTP POST.  This particular implementation only pulls out the SAMLRequest and
    * RelayState parameters into the POST body
    * @param url 
    */
   adaptSAMLRequestToHttpRequest(url:string, method: string):HttpConfig {
      const u = new URL(url);
      if (method.toLowerCase() == 'post') {
         return {
            url,
            method: 'POST',
            data: {
               'SAMLRequest': u.searchParams.get('SAMLRequest'),
               'RelayState' : u.searchParams.get('RelayState')
            }
         }
      } else {
         return {
            url,
            method: 'GET'
         }
      }
   }

   /* Methods related to submitting the login form */

   /**
    * Do the form based authentication
    * NOTE that the behavior here is likely to vary greatly by SAML provider.  This implementation assumes
    * that submitting the login form (done here) will redirect all the way back to 
    */
   doAuthenticate(client:HttpClient, loginFormResponse:HttpResponse, username:string, account:string, password:string):Promise<HttpResponse> {
      // we expect a lot of redirects leading to the loginForm response - this probably varies by Axios version
      const loginFormURL = loginFormResponse.request.res.responseUrl;

      const loginForm = this.createLoginForm(loginFormResponse);
      this.fillLoginInputs(loginForm, username, account, password);

      const loginRequest = this.createAuthenticateRequest(loginFormURL, loginForm);

      return client.request(loginRequest)
         .then(rsp => {
            // FIXME this probably needs a more flexible check
            // if we're still on the login page, assume the login failed
            if (rsp.request.res.responseUrl == loginFormURL) {
               throw Error('not authorized');
            }
            return rsp;
         })
         .then(rsp => this.handleAuthenticationResponse(client, rsp));
   }
   /**
    * handle the submit of login form.  This particular implementation assumes submitting the login form
    * will redirect all the way back to the AppDynamics saml-auth endpoint, so it does nothing other than
    * echo the `rsp` input
    * @param client 
    * @param rsp 
    * @returns 
    */
   handleAuthenticationResponse(client:HttpClient, rsp: HttpResponse):Promise<HttpResponse> {
      return Promise.resolve(rsp);
   }

   /**
    * creates the login form
    */
   createLoginForm(rsp:HttpResponse):HTMLElement {
      const doc = htmlParse(rsp.data);
      return this.findLoginForm(doc);
   }

   findLoginForm(document:HTMLElement):HTMLElement {
      const loginForm = document.querySelector(this.loginFormSelector);
      if (!loginForm) {
         throw Error(`login form not found using selector ${this.loginFormSelector}`)
      }
      return loginForm;
   }

   fillLoginInputs(loginForm:HTMLElement, username:string, account:string, password:string) {
      this.fillUsername(loginForm, username, account);
      this.fillPassword(loginForm, password, account);
   }

   fillUsername(loginForm:HTMLElement, username:string, account:string) {
      const input = loginForm.querySelector(this.usernameSelector);
      if (!input) {
         throw Error(`username input not found using selector ${this.usernameSelector}`);
      }
      input.setAttribute('value', username);
   }
   fillPassword(loginForm:HTMLElement, password:string, account:string) {
      const input = loginForm.querySelector(this.passwordSelector);
      if (!input) {
         throw Error(`password input not found using selector ${this.passwordSelector}`);
      }
      input.setAttribute('value', password);
   }
   /**
    * converts the login FORM to an HttpConfig that can be submitted.
    * NOTE that the login form should be filled before this is called!
    * @param loginFormURL 
    * @param loginForm 
    * @returns 
    */
   createAuthenticateRequest(loginFormURL:string, loginForm:HTMLElement):HttpConfig {
      const lu = new URL(loginFormURL);
      const action = loginForm.getAttribute('action') || '';
      const au = new URL(action, lu);

      const method = loginForm.getAttribute('method') || 'GET';
      const params = Object.fromEntries(
            loginForm.querySelectorAll('input')
            .map(i => [i.attributes.name, i.attributes. value])
      ) as any;

      const req = {
         url: au.toString(), 
         method
      } as HttpConfig;
      if (method.toLowerCase() == 'post') {
         req.data = new URLSearchParams(params);
      } else {
         req.params = params;
      }
      return req;
   }

   /* methods related to creating the credentials */
   createSession(baseURL: string, client:HttpClient, cookies:CookieJar):Promise<SessionIds> {
      return this.reauthenticateWithAppDynamics(client)
         .then(rsp => {
            const authCookies = Object.fromEntries(
               cookies.getCookiesSync(baseURL)
               .filter(c => c.key == 'JSESSIONID' || c.key == 'X-CSRF-TOKEN')
               .map(c => [c.key, c.value])
            ) as any;
            return {
               jsessionid: authCookies['JSESSIONID'],
               xcsrf: authCookies['X-CSRF-TOKEN']
            };
         })
   }

   /**
    * after SAMLResponse processing ends, we should have a JSESSIONID, but we need to call the auth?action=login endpoint 
    * one last time to establish the CSRF token
    * @param client 
    */
   reauthenticateWithAppDynamics(client:HttpClient):Promise<HttpResponse> {
      return client.get('/auth', {action:'login'});
   }
}