# Changelog

## *v1.13.2 / 2019-09-16*

* Fixed user and channel permissions issue

## *v1.13.1 / 2019-09-05*

* Update Dependencies

## *v1.13.0 / 2019-02-04*

## Final release

## *v1.13.0-rc.2 / 2019-02-01*

## Release candidate with bug fix and new script

### Bug Fix

* Fixed role deselection on edit client modal

### New Script

* Build CentOS RPM package via docker

---

## *v1.13.0-rc.1 / 2019-01-22*

## Release candidate with various bug fixes / code refactoring and dependency upgrades

### Bug Fixes

* Remove width limit on multi-select that caused truncated inputs
* Fixed tool-tips with HTML elements that weren't being rendered on hover
* Update webpack to hot reload when changes are made to the scripts
* Fix graph missing labels by disabling additional minification
* Fix show reruns button in transactions
* Fix the redirect to rerun transactions from the popover

### Code Cleanup

* Fix broken Channel test
* Update tests for dependency upgrades
* Remove console logs
* Fix channel success message wording

### Updates/Upgrades

* Update dependency minor versions and patches for security updates
* Upgrade dependency major versions where possible

### Internal Refactoring

* Separate out basicInfo, routes, dataControl, alerts, requestMatching and userAccess controllers from the channelsModal controller into their own files

### Enhancements

* Add icon to transaction log to indicate that a transaction is a rerun
* Travis CI runs console against Node Carbon, Dubnium and latest with code coverage
* Travis CI build status is posted to Jembi slack channel

---
