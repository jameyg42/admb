# Changes
This file contains a list of notable changes for all packages in the 
mono-repo.  The version specified in this file will be the largest
version among the changed packages.  In general, all changed packages
will be published at once with the same version number, but unchanged 
packages will not be published.

## UNRELEASED ##
### Changed
- [admb-ui] Angular@17 update

### Fixed
- [admb-server] fixed issue in authentication middleware when not authenticated

### Removed
- [admb-lang-tester] the parser/language testing utility removed from main build and
  relegated to the ./tools directory

## [3.7.1] - 2023-11-15 ##
### Fixed
- [admb-server] don't try to authenticate via APPDSESSION cookie when explicity invoking
  login.  Fixes "stale session cookie breaks login" issue.

## [3.7.0] - 2023-11-09 ##
### Added
- [admb-server] can now authenticate service calls with `x-api-key` and `authorization` headers
- [admb-ui] trivial APIKey generator

## [3.6.1] - 2023-09-25 ##
### Changed
- [admb-ui] experimental tweak to plot hover labels to try to make them more useful

## [3.6.0] - 2023-09-22 ##
### Added
- [appd-libmetrics] new `bin` operation to combine continuous metric series values
  into discrete sets of a given time span
- [appd-pipeline] new `bin` command that makes use of the libmetrics `bin` operation

## [3.5.3] - 2023-08-22 ##
### Changed
- [admb-ui] dependency updates

## [3.5.2] - 2023-06-12 ##
### Fixed
- [appd-client] only split domain on last `@` sign in username allowing usernames like 
  `user@domain@account` to be used
  
## [3.5.1] - 2023-05-17 ##
### Fixed
- [appd-client] serialize/deserialize sequence loses account property

## [3.5.0] - 2023-03-30 ##
### Added
- [admb-ui] new (experimental) `plot type=table` plot type.  
### Fixed
- [appd-pipeline] series copied with `copy` actually need to be copied (deep cloned)
  to prevent transforms (`plot`, `label`, etc) from being applied to the
  source series

## [3.4.0] - 2023-03-29 ##
### Added
- [appd-pipeline] allow `relativeTo` to take ValueType expressions
- [appd-pipeline] allow ValueType expressions to contain `%{variables}`

## [3.3.2] - 2023-03-28 ##
### Fixed
- [appd-pipeline] fixed bug where `range` operator wasn't actually adjusting the search range

## [3.3.1] - 2023-03-23 ##
### Fixed
- [appd-pipeline] need to check all data points for a potential value when excluding series, not just the first
## [3.3.0] - 2023-03-23 ##
### Changed
- [appd-client] set `maxSockets` for the underlying NodeJS `http.Agent` to prevent thrashing the controller
- [appd-pipeline] the `valueType` must now match an actual metric value, otherwise the series is excluded from the results
### Fixed
- [admb-server] improve handling of "not signed in" state
- [appd-services] don't call metrics service with an empty metrics query

## [3.2.0] - 2023-03-09 ##
### Added
- [appd-client] new `@metlife/appd-client` module.  This is just the `@metlife/appd-services/client`
  export broken out into its own top-level module.
### Changed
- [appd-services] use separate @metlife/appd-client module 
  (@metlife/appd-services/client is still exported for backwards compat)
- [appd-services] Database virtual nodes now use the DBMON Database name instead of the backend name
### Fixed
- [appd-services] virtual nodes now work with SaaS controllers 
### Deprecated
- [appd-services] deprecated the use of the appd-services/client export - use the `@metlife/appd-client` 
  top level package instead.

## [3.1.0] - 2023-02-13 ##
### Added
- [appd-metrics] added additional reducer 'aliases' to the `reduce` op reducerMap
### Fixed
- [appd-services] fixed issue where baseline metrics for more than one metric could not be fetched
- [appd-pipeline] fixed issue where falsey required argument values were causing compile errors

## [3.0.2] - 2023-01-24
### Added
- [admb-ui] additional time range presets
### Changed
- [admb-ui] automatic autocomplete of PathSegments (experimental)
- [appd-services] reduced relative range caching to 1 minute (was 2)

### Fixed
- [admb-ui] Application autocomplete now works when left-adjacent to the Application node
- [admb-ui] bump PrimeNG version to fix drop-down issue (see https://github.com/primefaces/primeng/issues/12525)
- [admb-ui] fixed issue w/ timeselector "between" calendar widgets rendering offscreen

## [3.0.1] - 2023-01-19
### Changed
- [admb-ui] replaced codemirror `basicSetup` dep with individual modules and streamlined editor features
- [project] updated to Angular@15 (currency chore) and other minor dep updates

### Fixed
- [admb-ui] set a `min-height` style on Plotly `DIV`s as a tactical fix for `0px` height plots that can occur during
  plot redraws (window resize or option changes)
- [appd-services] pinned to axios@1.2.2.  Axios@1.2.3 introduced a breaking API change (this likely was by accident)

## [3.0.0] - 2022-11-14
### Added
- [project] notable changes now tracked in CHANGELOG.md
- [appd-pipeline] rough support for `%{variables}` in string and search values
- [appd-pipeline] implemented missing pipeline-ops (`plot`, `def`, `corr`, `log10`, `rangeIntersect`, `percentOf`, `threshold`)
- [appd-libmetrics] added `what` argument to `percentOf` to simplify selecting the timeseries we're taking the percentage of.
- [appd-pipeline] `relativeTo` now takes a semicolon delimited set of paths to search relative to
- [appd-ui] added ADMB language pack to expression editor *finally* providing autocomplete
- [appd-ui] added "range breaks" for weekends and work-hours (UI only - doesn't impact underlying series or calcs on them)

### Changed
- [admb-ui] empty plot groups are now suppressed instead of showing an empty plot
- [admb-ui] re-ordered SaaS controllers to the top of the list
- [appd-libmetrics] added name and segment sortBy routines back
- [appd-libmetrics] overhauled the `Range` type, basing it on Luxon instead of Moment
- [admb-ui] modified `TimePicker` to use libmetrics `Range` type and restored Relative time selection
- [appd-pipeline] MetricsProvider SPI changed to support autocomplete functions.  For now, this also ties the
  SPI to the grammar specifics (app,path,valueTypes)
- [appd-services] added support for SAML-based logins for MetLife's Siteminder-based SAML login flow

### Fixed
- [appd-libutils] only first alternatives glob is converted to regex / matched
- [appd-pipeline] `filterGroup` returns unmatched groups vs. expected matched groups
- [appd-libmetrics] `reduce` doesn't handle gaps correctly
- [appd-services] added "first class" support for logging into Local accounts even when the SAML provider is used

## [2.0.2] - 2022-07-29
### Fixed
- [multiple] inter-package dependencies are now specified

## [2.0.1] - 2022-07-29
### Added
- [project] initial working public release
