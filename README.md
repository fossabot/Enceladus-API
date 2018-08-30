# Enceladus API

[Documentation][docs]

![License][license]
![Version][version]
![Build][build]
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fr-spacex%2FEnceladus-API.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fr-spacex%2FEnceladus-API?ref=badge_shield)

## Endpoints

### Authentication hierarchy

- None
- Signed in
- Thread author
- Local admin (subreddit-specific)
- Global admin

### Version 1

_Version 1 is in progress,
and may change at any time without warning._

| Method    | Endpoint               | Expected status | Min. authn.   | Allowed parameters                                                                                                                         |
| --------- | ---------------------- | --------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `GET`     | `/oauth`               | 200 ok          | None          | `callback`                                                                                                                                 |
| `GET`     | `/oauth/callback`      | 303 see other   | None          | `code`<br>`state`                                                                                                                          |
| `GET`     | `/v1/user`             | 200 ok          | None          | _none_                                                                                                                                     |
| `GET`     | `/v1/user/:id`         | 200 ok          | None          | _none_                                                                                                                                     |
| `POST`†   | `/v1/user`             | 201 created     | None          | `reddit_username`<br>`lang`<br>`refresh_token`<br>`is_global_admin`<br>`spacex__is_admin`<br>`spacex__is_mod`<br>`spacex__is_slack_member` |
| `PATCH`†  | `/v1/user/:id`         | 200 ok          | None          | `lang`<br>`refresh_token`<br>`is_global_admin`<br>`spacex__is_admin`<br>`spacex__is_mod`<br>`spacex__is_slack_member`                      |
| `DELETE`† | `/v1/user/:id`         | 204 no content  | None          | _none_                                                                                                                                     |
| `GET`     | `/v1/event`            | 200 ok          | None          | _none_                                                                                                                                     |
| `GET`     | `/v1/event/:id`        | 200 ok          | None          | _none_                                                                                                                                     |
| `POST`    | `/v1/event`            | 201 created     | Thread author | `message`<br>`posted`<br>`terminal_count`<br>`section`                                                                                     |
| `PATCH`   | `/v1/event/:id`        | 200 ok          | Thread author | `message`<br>`posted`<br>`terminal_count`                                                                                                  |
| `DELETE`  | `/v1/event/:id`        | 204 no content  | Thread author | _none_                                                                                                                                     |
| `GET`     | `/v1/preset_event`     | 200 ok          | None          | _none_                                                                                                                                     |
| `GET`     | `/v1/preset_event/:id` | 200 ok          | None          | _none_                                                                                                                                     |
| `POST`    | `/v1/preset_event`     | 201 created     | Global admin  | `holds_clock`<br>`message`<br>`name`                                                                                                       |
| `PATCH`   | `/v1/preset_event/:id` | 200 ok          | Global admin  | `holds_clock`<br>`message`<br>`name`                                                                                                       |
| `DELETE`  | `/v1/preset_event/:id` | 204 no content  | Global admin  | _none_                                                                                                                                     |
| `GET`     | `/v1/section`          | 200 ok          | None          | _none_                                                                                                                                     |
| `GET`     | `/v1/section/:id`      | 200 ok          | None          | _none_                                                                                                                                     |
| `POST`    | `/v1/section`          | 201 created     | Thread author | `content`<br>`name`<br>`thread`                                                                                                            |
| `PATCH`   | `/v1/section/:id`      | 200 ok          | Thread author | `content`<br>`name`<br>`lock`<br>`events`                                                                                                  |
| `DELETE`  | `/v1/section/:id`      | 204 no content  | Thread author | _none_                                                                                                                                     |
| `GET`     | `/v1/thread`           | 200 ok          | None          | _none_                                                                                                                                     |
| `GET`     | `/v1/thread/:id`       | 200 ok          | None          | _none_                                                                                                                                     |
| `POST`    | `/v1/thread`           | 201 created     | Signed in     | `launch_name`<br>`subreddit`<br>`t0`<br>`take_number`<br>`youtube_id`<br>`created_by`<br>`spacex__api_id`                                  |
| `PATCH`   | `/v1/thread/:id`       | 200 ok          | Thread author | `launch_name`<br>`t0`<br>`take_number`<br>`youtube_id`<br>`created_by`<br>`spacex__api_id`                                                 |
| `DELETE`  | `/v1/thread/:id`       | 204 no content  | Thread author | _none_                                                                                                                                     |

† These endpoints are only available when in the development environment.
When in production, these endpoints will return a 404.

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
[license]: https://img.shields.io/github/license/r-spacex/Enceladus-API.svg?style=flat-square
[version]: https://img.shields.io/github/package-json/v/r-spacex/Enceladus-API.svg?style=flat-square
[build]: https://img.shields.io/travis/r-spacex/Enceladus-API.svg?style=flat-square
[docs]: https://r-spacex.github.io/Enceladus-API


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fr-spacex%2FEnceladus-API.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fr-spacex%2FEnceladus-API?ref=badge_large)