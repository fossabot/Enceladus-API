# Stráž API

![License](https://img.shields.io/github/license/r-spacex/straz-api.svg?style=flat-square)
![Version](https://img.shields.io/github/package-json/v/r-spacex/straz-api.svg?style=flat-square)

## Endpoints

**NB**:
Authentication has not yet been implemented,
primarily as a means for faster testing.
It should not be difficult to implement;
placing individual routes below (to be created) middleware should suffice.

### Authentication hierarchy

- None
- Signed in
- Thread author
- Local admin (subreddit-specific)
- Global admin

### Version 1

_Version 1 is in progress,
and may change at any time without warning._

| Method   | Endpoint            | Expected status code | Min. authentication | Allowed body parameters                                                                                                       |
| -------- | ------------------- | -------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `GET`    | `/user`             | 200 OK               | Global admin        | _none_                                                                                                                        |
| `GET`    | `/user/:id`         | 200 OK               | Global admin        | _none_                                                                                                                        |
| `POST`   | `/user`             | 201 CREATED          | Global admin        | `reddit_username`<br>`auth_token`<br>`is_global_admin`<br>`spacex__is_admin`<br>`spacex__is_mod`<br>`spacex__is_slack_member` |
| `PATCH`  | `/user/:id`         | 200 OK               | Global admin        | `is_global_admin`<br>`spacex__is_mod`<br>`spacex__is_slack_member`                                                            |
| `DELETE` | `/user/:id`         | 204 NO CONTENT       | Global admin        | _none_                                                                                                                        |
|          |                     |                      |                     |                                                                                                                               |
| `GET`    | `/event`            | 501 NOT IMPLEMENTED  | TBD                 | TBD                                                                                                                           |
| `GET`    | `/event/:id`        | 501 NOT IMPLEMENTED  | TBD                 | TBD                                                                                                                           |
| `POST`   | `/event`            | 501 NOT IMPLEMENTED  | TBD                 | TBD                                                                                                                           |
| `PATCH`  | `/event/:id`        | 501 NOT IMPLEMENTED  | TBD                 | TBD                                                                                                                           |
| `DELETE` | `/event/:id`        | 501 NOT IMPLEMENTED  | TBD                 | TBD                                                                                                                           |
|          |                     |                      |                     |                                                                                                                               |
| `GET`    | `/preset_event`     | 200 OK               | None                | _none_                                                                                                                        |
| `GET`    | `/preset_event/:id` | 200 OK               | None                | _none_                                                                                                                        |
| `POST`   | `/preset_event`     | 201 CREATED          | Global admin        | `holds_clock`<br>`message`<br>`name`                                                                                          |
| `PATCH`  | `/preset_event/:id` | 200 OK               | Global admin        | `holds_clock`<br>`message`<br>`name`                                                                                          |
| `DELETE` | `/preset_event/:id` | 204 NO CONTENT       | Global admin        | _none_                                                                                                                        |
|          |                     |                      |                     |                                                                                                                               |
| `GET`    | `/section`          | 501 NOT IMPLEMENTED  | TBD                 | TBD                                                                                                                           |
| `GET`    | `/section/:id`      | 501 NOT IMPLEMENTED  | TBD                 | TBD                                                                                                                           |
| `POST`   | `/section`          | 501 NOT IMPLEMENTED  | TBD                 | TBD                                                                                                                           |
| `PATCH`  | `/section/:id`      | 501 NOT IMPLEMENTED  | TBD                 | TBD                                                                                                                           |
| `DELETE` | `/section/:id`      | 501 NOT IMPLEMENTED  | TBD                 | TBD                                                                                                                           |
|          |                     |                      |                     |                                                                                                                               |
| `GET`    | `/thread`           | 200 OK               | None                | _none_                                                                                                                        |
| `GET`    | `/thread/:id`       | 200 OK               | None                | _none_                                                                                                                        |
| `POST`   | `/thread`           | 201 CREATED          | Signed in           | `launch_name`<br>`subreddit`<br>`t0`<br>`take_number`<br>`youtube_id`<br>`created_by`<br>`spacex__api_id`                     |
| `PATCH`  | `/thread/:id`       | 200 OK               | Thread author       | `launch_name`<br>`t0`<br>`take_number`<br>`youtube_id`<br>`created_by`<br>`spacex__api_id`                                    |
| `DELETE` | `/thread/:id`       | 204 NO CONTENT       | Thread author       | _none_                                                                                                                        |

## Policy on breaking changes

This API follows [semantic versioning](https://semver.org/).
As such, all breaking changes will bump the major version.

To ensure stability among all implementations using the API,
the most recent release of the prior version will be fully supported for one month,
including updates, bug fixes, and any other open issues.
There will be at least two months from the breaking change until the prior version's endpoints are removed,
at which point it will no longer be functional.
