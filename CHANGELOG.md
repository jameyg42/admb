# Changes
This file contains a list of notable changes for all packages in the 
mono-repo.  The version specified in this file will be the largest
version among the changed packages.  In general, all changed packages
will be published at once with the same version number, but unchanged 
packages will not be published.

## [Unreleased]
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
