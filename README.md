# Enceladus API

[Documentation][docs]

![License][license]
![Version][version]
![Build][build]

## Endpoints

**NB**:
Authentication has not yet been implemented,
due to uncertainty about the specific architecture.

### Authentication hierarchy

- None
- Signed in
- Thread author
- Local admin (subreddit-specific)
- Global admin

### Version 1

_Version 1 is in progress,
and may change at any time without warning._
Certain endpoints _are_ functional,
and have the appropriate authentication checks in place.

| Functional?        | Method   | Endpoint               | Expected status     | Min. authn.   | Allowed parameters                                                                                                                         |
| ------------------ | -------- | ---------------------- | ------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| :heavy_check_mark: | `GET`    | `/oauth`               | 200 ok              | None          | `callback`                                                                                                                                 |
| :heavy_check_mark: | `GET`    | `/oauth/callback`      | 303 see other       | None          | `code`<br>`state`                                                                                                                          |
| :x:                | `GET`    | `/v1/user`             | 200 ok              | None*         | _none_                                                                                                                                     |
| :x:                | `GET`    | `/v1/user/:id`         | 200 ok              | None*         | _none_                                                                                                                                     |
| :heavy_check_mark: | `POST`   | `/v1/user`             | 201 created         | Global admin  | `reddit_username`<br>`lang`<br>`refresh_token`<br>`is_global_admin`<br>`spacex__is_admin`<br>`spacex__is_mod`<br>`spacex__is_slack_member` |
| :heavy_check_mark: | `PATCH`  | `/v1/user/:id`         | 200 ok              | Global admin  | `lang`<br>`refresh_token`<br>`is_global_admin`<br>`spacex__is_admin`<br>`spacex__is_mod`<br>`spacex__is_slack_member`                      |
| :heavy_check_mark: | `DELETE` | `/v1/user/:id`         | 204 no content      | Global admin  | _none_                                                                                                                                     |
| :x:                | `GET`    | `/v1/event`            | 501 not implemented | TBD           | TBD                                                                                                                                        |
| :x:                | `GET`    | `/v1/event/:id`        | 501 not implemented | TBD           | TBD                                                                                                                                        |
| :x:                | `POST`   | `/v1/event`            | 501 not implemented | TBD           | TBD                                                                                                                                        |
| :x:                | `PATCH`  | `/v1/event/:id`        | 501 not implemented | TBD           | TBD                                                                                                                                        |
| :x:                | `DELETE` | `/v1/event/:id`        | 501 not implemented | TBD           | TBD                                                                                                                                        |
| :heavy_check_mark: | `GET`    | `/v1/preset_event`     | 200 ok              | None          | _none_                                                                                                                                     |
| :heavy_check_mark: | `GET`    | `/v1/preset_event/:id` | 200 ok              | None          | _none_                                                                                                                                     |
| :heavy_check_mark: | `POST`   | `/v1/preset_event`     | 201 created         | Global admin  | `holds_clock`<br>`message`<br>`name`                                                                                                       |
| :heavy_check_mark: | `PATCH`  | `/v1/preset_event/:id` | 200 ok              | Global admin  | `holds_clock`<br>`message`<br>`name`                                                                                                       |
| :heavy_check_mark: | `DELETE` | `/v1/preset_event/:id` | 204 no content      | Global admin  | _none_                                                                                                                                     |
| :x:                | `GET`    | `/v1/section`          | 501 not implemented | TBD           | TBD                                                                                                                                        |
| :x:                | `GET`    | `/v1/section/:id`      | 501 not implemented | TBD           | TBD                                                                                                                                        |
| :x:                | `POST`   | `/v1/section`          | 501 not implemented | TBD           | TBD                                                                                                                                        |
| :x:                | `PATCH`  | `/v1/section/:id`      | 501 not implemented | TBD           | TBD                                                                                                                                        |
| :x:                | `DELETE` | `/v1/section/:id`      | 501 not implemented | TBD           | TBD                                                                                                                                        |
| :heavy_check_mark: | `GET`    | `/v1/thread`           | 200 ok              | None          | _none_                                                                                                                                     |
| :heavy_check_mark: | `GET`    | `/v1/thread/:id`       | 200 ok              | None          | _none_                                                                                                                                     |
| :x:                | `POST`   | `/v1/thread`           | 201 created         | Signed in     | `launch_name`<br>`subreddit`<br>`t0`<br>`take_number`<br>`youtube_id`<br>`created_by`<br>`spacex__api_id`                                  |
| :x:                | `PATCH`  | `/v1/thread/:id`       | 200 ok              | Thread author | `launch_name`<br>`t0`<br>`take_number`<br>`youtube_id`<br>`created_by`<br>`spacex__api_id`                                                 |
| :x:                | `DELETE` | `/v1/thread/:id`       | 204 no content      | Thread author | _none_                                                                                                                                     |

\* No authentication is required for accessing most data.
Must be authenticated as a _global admin_ in order to access refresh tokens.

## Authentication flow

To authenticate a user,
you should make a GET request to `/oauth`,
with the URL parameter `callback`.
The callback provided will be called with a URL parameter `token` upon success.
That token contains the user's reddit username,
and should be passed in the headers to authenticate the user for the appropriate endpoints.

## Policy on breaking changes

_This section will take effect after the first stable release._

This API follows [semantic versioning].
As such, all breaking changes will bump the major version.

To ensure stability among all implementations using the API,
the most recent release of the prior version will be fully supported for one month,
including updates, bug fixes, and any other open issues.
There will be at least two months from the breaking change until the prior version's endpoints are removed,
at which point it will no longer be functional.

[semantic versioning]: https://semver.org
[license]: https://img.shields.io/github/license/r-spacex/enceladus-api.svg?style=flat-square
[version]: https://img.shields.io/github/package-json/v/r-spacex/enceladus-api.svg?style=flat-square
[build]: https://img.shields.io/travis/r-spacex/enceladus-api.svg?style=flat-square
[docs]: https://r-spacex.github.io/enceladus-api

<style>
td:nth-child(-n + 2) {
  text-align: center;
}
</style>
