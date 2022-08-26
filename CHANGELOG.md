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
- [appd-pipeline] implemented remaining missing pipeline-ops (plot, def, corr, percentOf, threshold)

### Fixed
- [appd-libutils] all glob alternative wildcards vs. just the first per segment are evaluated

## [2.0.2] - 2022-07-29
### Fixed
- [multiple] inter-package dependencies are now specified

## [2.0.1] - 2022-07-29
### Added
- [project] initial working public release
