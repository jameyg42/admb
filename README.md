MetLife AMS AppDynamics JS package monorepo
----
Various JS packages related to AppDynamics.

### appd-services
This module contains:

- the generic AppD service client, including various login routines
  (SAML, LDAP, Local, etc).
- a few "raw" services that map more-or-less directly to AppD REST-UI services
- the metrics-ex service, that extends the "raw" AppD metrics services (browse,get)
  with a) robust wildcard support and b) "virtual nodes"

### appd-libmetrics
This module is a semi-generic (i.e. not AppD specific) set of routines that operate
on timeseries data.  It includes routes to transform/aggregate timeseries data.

### appd-libstats
This module is a generic (operates on arrays of numbers) statistics/mathematics
package.

### appd-libutils
The package where things that don't belong anywhere else go....

### appd-pipeline
The "pipeline" is basically the backend implementation of the AppDynamics Metrics Browser (ADMB).  It includes the pipeline grammer, compiler, and runtime.  

### admb-ui, admb-server
The Angular-based user-interface for the AppDynamics Metrics Browser (ADMB) and
the thin server-side.  See admb-ui/README.md for more.
