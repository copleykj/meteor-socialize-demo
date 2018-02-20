# Meteor Socialize Demo #

The start of a quick demo of the socialize packages for meteor. At the moment it is pretty basic, but has a login/register page, user feed, messaging, profiles, friend requests, friends list, and avatar upload. There is quite a bit more to be added and a ton of polish to apply still. This is very much a work in progress and you are welcome to help it along with issues and pull requests.

## Setup ##

Currently this app has `cultofcoders:redis-oplog` and `disable-oplog` installed, but it is completely optional and the app will run without them. If you do not wish to go through the setup, you can just remove them and ignore the configuration steps for redis-oplog.

Also this app uses [Cloudinary](https://cloudinary.com) for uploading and displaying user avatars. You will need a free cloudinary account to use this app. Once you have an account you can enter your credentials into `settings.json` and you'll be all set.

**Step 1**
```sh
$ git clone https://github.com/copleykj/meteor-socialize-demo.git
$ meteor npm install
```

**Step 2**
Setup a redis server for the app to connect to. This can be a tiny instance as redis-oplog requires very little resources. For a quick and easy way to get up and running, I totally recommend a free instance on redis labs.

**Step 3**
Create and edit a `settings.json` with the following settings for redis-oplog and Cloudinary, replacing necessary details with your own.

```json
{
  "redisOplog": {
    "redis": {
      "port": 1337,
      "host": "you.host.here"
    },
    "retryIntervalMs": 10000,
    "mutationDefaults": {
        "optimistic": true,
        "pushToRedis": true
    },
    "overridePublishFunction": true
  },
  "cloudinary": {
      "api_secret": "DD_DeMOI7O5rYSGqBTWINSeCRet"
  },
  "public": {
      "cloudinary": {
          "cloud_name": "cloud773name",
          "api_key": "830573649475848"
      }
  }
}
```

## Running ##

```shell
$ meteor npm start
```

## Contributing ##

This repo contains ESLint and Editor configurations. Please use them when contributing so I don't have to fight your code :-P
