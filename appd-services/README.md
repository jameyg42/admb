# @metlife/appd-services
A RESTful service client and front-ends for various AppDynamics
APIs.

    npm install @metlife/appd-services

## Client
A semi-generic RESTful service client that can be used to invoke
AppDynamics RESTful services (including the `/restui` set of services).
Also includes machinery to authenticate using LDAP and SAML (MetLife's
accessone.metlife.com SAML provider) authentication providers.

### Usage
JS Example
    const appd = require('@metlife/appd-services);
    appd.Client.open(
        'https://ml-prod.saas.appdynamics.com/controller', 'ml-prod', 
        'username', 'password'
    ).then(async client => {
        const apps = await client.get('/rest/applications', {output:'JSON'});
    });

## Basic service wrappers
Aside from the Client which can be used to call any AppDynamics RESTful service, 
development of the 2.0.x versions is heavily influenced by the needs of the
AppDynamics Metrics Browser (ADMB).  In support of that, there are several 
"wrapper" APIs that call specific AppDynamics REST APIs (mainly to provide
type information).  See the `app` and `metrics` sub-packages for specific info.
NOTE that the `metrics` wrapper is based on the `/restui` metric services, not
the `/controller/rest/metrics` API.

## Extended Metrics Services (metrics-ex)
The `metrics-ex` sub-package extends the AppDynamics `metrics` services with
several additional features, including:

- support for glob-like wildcards
- support for "virtual nodes" - additional metric nodes not actually present in
  the metric tree (but should be...) that allows one to navigate objects related
  to the application, such as `servers`, `containers`, and `databases`.

### wildcards
NOTE that all current wildcards only match individual node names, not metric paths.
In all cases, wildcards simply map to an associated regular expression that's tested
against a metric node name - the alternate syntax is because regular expression syntax
tends to conflict w/ node+path naming conventions.

- `*` - the asterix wildcard matches zero-to-many characters. Equal to `/.*/` regex.
- `?` - the question-mark wildcard matches one character.  Equal to `/.+/` regex.
- `{a,b}` - the alternation wildcard provides N number of comma-separated
  match options.  Equal to `/a|b/` regex.

