# AppDynamics Metrics Browser (ADMB) JS package monorepo
Various TS/JS packages related to the AppDynamics Metrics Browser.  See individual package
README.md's for example use.

So this is a couple of things.  It's primarily a way to (more) easily browse the AppDynamics
metrics tree (see [admb-ui](./admb-ui/README.md)) as an "all up" solution.  But the individual
packages can also be used standalone for more general purposes.

### @admb/client
This module is a generic AppD RESTful service client (HTTP GET/POST/DELETE/etc)

### @admb/services
This module contains:

- a few "raw" services that map more-or-less directly to AppD REST-UI services
- the metrics-ex service, that extends the "raw" AppD metrics services (browse,get)
  with a) robust wildcard support and b) "virtual nodes"

### @admb/libmetrics
This module is a semi-generic (i.e. not AppD specific) set of routines that defines and
operates on timeseries data.  It includes routes to transform/aggregate timeseries data.

### @admb/libstats
This module is a generic (operates on arrays of numbers) statistics/mathematics
package.

### @admb/libutils
The package where things that don't belong anywhere else go....

### @admb/pipeline
The "pipeline" is basically the backend implementation of the AppDynamics Metrics Browser (ADMB).  
It includes the pipeline grammer, compiler, and runtime.

### @admb/admb-ui, @admb/admb-server, @admb/admb-lang, @admb/admb-lang-tester
The Angular-based user-interface for the AppDynamics Metrics Browser (ADMB) and
the thin server-side, and supporting utilities. See admb-ui/README.md for more.
