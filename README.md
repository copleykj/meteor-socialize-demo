# Meteor Socialize Demo #

The start of a quick demo of the socialize packages for meteor. At the moment it is pretty basic, but has a login/register page, user feed, messaging, profiles, and friend requests. There is quite a bit more to be added and a ton of polish to apply still. This is very much a work in progress and you are welcome to help it along with issues and pull requests.

## Setup ##

Currently this app has `cultofcoders:redis-oplog` and `disable-oplog` installed, but it is completely optional and the app will run without them. If you do not wish to go through the setup, you can just remove them and ignore the configuration steps for redis-oplog.

**Step 1**
```sh
$ git clone https://github.com/copleykj/meteor-socialize-demo.git
$ meteor npm install
```

**Step 2**
Setup a redis server for the app to connect to. This can be a tiny instance as redis-oplog requires very little resources. For a quick and easy way to get up and running, I totally recommend a free instance on redis labs.

**Step 3**
Create and edit a `settings.json` with the following settings for redis-oplog, replacing the host and port.

```json
{
  "redisOplog": {
    "redis": {
      "port": ####,
      "host": "you.host.here"
    },
    "retryIntervalMs": 10000,
    "mutationDefaults": {
        "optimistic": true,
        "pushToRedis": true
    },
    "overridePublishFunction": true
  }
}
```

## Running ##

```shell
$ meteor npm start
```

## Contributing ##

This repo contains ESLint and Editor configurations. Please use them when contributing so I don't have to fight your code :-P
