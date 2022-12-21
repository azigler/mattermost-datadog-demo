# mattermost-datadog-demo

> Mattermost and Datadog incident resolution demo

## Background

This is a multi-container Docker deployment featuring the following services:

- [Mattermost](https://mattermost.com/) (secure collaboration)
- [Postgres](https://hub.docker.com/_/postgres) (database)
- [Redis](https://hub.docker.com/_/redis) (database)
- [Datadog Agent](https://hub.docker.com/r/datadog/agent) (monitoring for Datadog)
- [Healthchecks](https://hub.docker.com/r/linuxserver/healthchecks) (cron job monitoring)

In addition to the above stack, this orchestration has a demonstrative application called `plantalytics` that is triaged by the demo user.

## Install

You need the latest version of [Docker Desktop](https://docs.docker.com/desktop/) (Windows, Mac, or Linux desktop application) or [Docker Engine](https://docs.docker.com/engine/) (CLI) installed with [Docker Compose](https://docs.docker.com/compose/).

Enter the following commands in a terminal:

```
git clone https://github.com/azigler/mattermost-datadog-demo && cd mattermost-datadog-demo
```

On the [Datadog website](https://app.datadoghq.com/):

- Create a free account
- Create an API key and [install a Datadog Agent via Docker](https://app.datadoghq.com/account/settings#agent/docker)

Back in your terminal:

- Set the API key in your bash environment variables with `export DD_APIKEY=<YOUR_API_KEY>`
- Start the demo:

```
docker compose up
```

Now you can access each container at their address below.

## Usage

To start:

### Mattermost

http://localhost:8065

- Create an admin user and default team

### Datadog Agent

... instructions coming soon ...

### Healthchecks

http://localhost:8000

- Create Mattermost integration (use `mattermost` instead of `localhost`)

### `plantalytics`

http://localhost:8005

... instructions coming soon ...
