# MetLife AMS AppDynamics JS package monorepo
Various TS/JS packages related to AppDynamics.  See individual package
README.md's for example use.

Currently, all packages are published in CommonJS format.  Publishing 
as ES modules will be supported in the future.

### @metlife/appd-client
This module is a generic AppD RESTful service client (HTTP GET/POST/DELETE/etc), but also contains
various login routines (SAML, LDAP, Local, etc), most notably a scripted-out sequence of the MetLife
SAML login sequence.

### @metlife/appd-services
This module contains:

- a few "raw" services that map more-or-less directly to AppD REST-UI services
- the metrics-ex service, that extends the "raw" AppD metrics services (browse,get)
  with a) robust wildcard support and b) "virtual nodes"

### @metlife/appd-libmetrics
This module is a semi-generic (i.e. not AppD specific) set of routines that operate
on timeseries data.  It includes routes to transform/aggregate timeseries data.

### @metlife/appd-libstats
This module is a generic (operates on arrays of numbers) statistics/mathematics
package.

### @metlife/appd-libutils
The package where things that don't belong anywhere else go....

### @metlife/appd-pipeline
The "pipeline" is basically the backend implementation of the AppDynamics Metrics Browser (ADMB).  It includes the pipeline grammer, compiler, and runtime.  

### @metlife/admb-ui, @metlife/admb-server, @metlife/admb-lang, @metlife/admb-lang-tester
The Angular-based user-interface for the AppDynamics Metrics Browser (ADMB) and
the thin server-side, and supporting utilities. See admb-ui/README.md for more.
