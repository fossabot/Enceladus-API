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

| Method   | Endpoint            | Expected status     | Min. authn.   | Allowed parameters                                                                                                                         |
| -------- | ------------------- | ------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `GET`    | `/oauth`            | 200 ok              | None          | `callback`                                                                                                                                 |
| `GET`    | `/oauth/callback`   | 303 see other       | None          | `code`<br>`state`                                                                                                                          |
| `GET`    | `/user`             | 200 ok              | None*         | _none_                                                                                                                                     |
| `GET`    | `/user/:id`         | 200 ok              | None*         | _none_                                                                                                                                     |
| `POST`   | `/user`             | 201 created         | Global admin  | `reddit_username`<br>`lang`<br>`refresh_token`<br>`is_global_admin`<br>`spacex__is_admin`<br>`spacex__is_mod`<br>`spacex__is_slack_member` |
| `PATCH`  | `/user/:id`         | 200 ok              | Global admin  | `lang`<br>`refresh_token`<br>`is_global_admin`<br>`spacex__is_admin`<br>`spacex__is_mod`<br>`spacex__is_slack_member`                      |
| `DELETE` | `/user/:id`         | 204 no content      | Global admin  | _none_                                                                                                                                     |
| `GET`    | `/event`            | 501 not implemented | TBD           | TBD                                                                                                                                        |
| `GET`    | `/event/:id`        | 501 not implemented | TBD           | TBD                                                                                                                                        |
| `POST`   | `/event`            | 501 not implemented | TBD           | TBD                                                                                                                                        |
| `PATCH`  | `/event/:id`        | 501 not implemented | TBD           | TBD                                                                                                                                        |
| `DELETE` | `/event/:id`        | 501 not implemented | TBD           | TBD                                                                                                                                        |
| `GET`    | `/preset_event`     | 200 ok              | None          | _none_                                                                                                                                     |
| `GET`    | `/preset_event/:id` | 200 ok              | None          | _none_                                                                                                                                     |
| `POST`   | `/preset_event`     | 201 created         | Global admin  | `holds_clock`<br>`message`<br>`name`                                                                                                       |
| `PATCH`  | `/preset_event/:id` | 200 ok              | Global admin  | `holds_clock`<br>`message`<br>`name`                                                                                                       |
| `DELETE` | `/preset_event/:id` | 204 no content      | Global admin  | _none_                                                                                                                                     |
| `GET`    | `/section`          | 501 not implemented | TBD           | TBD                                                                                                                                        |
| `GET`    | `/section/:id`      | 501 not implemented | TBD           | TBD                                                                                                                                        |
| `POST`   | `/section`          | 501 not implemented | TBD           | TBD                                                                                                                                        |
| `PATCH`  | `/section/:id`      | 501 not implemented | TBD           | TBD                                                                                                                                        |
| `DELETE` | `/section/:id`      | 501 not implemented | TBD           | TBD                                                                                                                                        |
| `GET`    | `/thread`           | 200 ok              | None          | _none_                                                                                                                                     |
| `GET`    | `/thread/:id`       | 200 ok              | None          | _none_                                                                                                                                     |
| `POST`   | `/thread`           | 201 created         | Signed in     | `launch_name`<br>`subreddit`<br>`t0`<br>`take_number`<br>`youtube_id`<br>`created_by`<br>`spacex__api_id`                                  |
| `PATCH`  | `/thread/:id`       | 200 ok              | Thread author | `launch_name`<br>`t0`<br>`take_number`<br>`youtube_id`<br>`created_by`<br>`spacex__api_id`                                                 |
| `DELETE` | `/thread/:id`       | 204 no content      | Thread author | _none_                                                                                                                                     |

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
