# mattermost-datadog-demo

> Mattermost and Datadog incident resolution demo

## Background

This is a multi-container Docker deployment for usage on Gitpod, featuring the following services:

- [Mattermost](https://mattermost.com/) (secure collaboration)
- [Postgres](https://hub.docker.com/_/postgres) (database)
- [Datadog Agent](https://hub.docker.com/r/datadog/agent) (monitoring for Datadog)

In addition to the above stack, this orchestration has a demonstrative application called `plantalytics` that is triaged by the demo user.

## Install & Usage

This demo is built to be self-guided on Gitpod. To get your own workspace and start the demo, click below:

<a href="https://gitpod.io/#https://github.com/azigler/mattermost-datadog-demo" target="_blank">![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)</a>

On the [Datadog website](https://app.datadoghq.com/):

- Create a free account
- Create an API key and [install a Datadog Agent via Docker](https://app.datadoghq.com/account/settings#agent/docker)

Back in your terminal:

- Start the demo:

```
yarn start
```

Gitpod will automatically open browser pages to Mattermost and the demo application. Your browser may block the new tabs from automatically opening, but you can click the **Ports** tab at the bottom to find both service URLs that are unique to your Gitpod deployment.

The script will create and share your Mattermost login credentials. Next, navigate to your Mattermost server and log in.

### Mattermost

... instructions coming soon ...

### Datadog Agent

... instructions coming soon ...

### `plantalytics`

... instructions coming soon ...
