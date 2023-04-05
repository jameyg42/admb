# SAML LoginForm LoginProvider
This package is primarily intended to act as an example of how to
implement a `@appd/client` LoginProvider to handle SAML logins for
SAML providers that authenticate using a login form.

It expects the SAMLRequest flow to land (i.e. HTTP 302 redirects) on
an HTML page containing a loginForm that can be submitted to 
eventual completion of the SAMLResponse flow.
