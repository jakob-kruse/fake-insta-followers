# Fake instagram followers in bio
![Node.js CI](https://github.com/jakob-kruse/fake-insta-followers/workflows/Node.js%20CI/badge.svg)

This application automatically updates your bio with bold text to make it look like anyone is following you.

IMPORTANT: Im not responsible for your account getting banned. Use this at you own risk. (I dont think you will get banned though)


## Demo

![Demo](../assets/demo.jpg?raw=true)

## Setup

#### Install Node.js and NPM

#### Clone repo

`git clone https://github.com/jakob-kruse/fake-insta-followers.git fake-insta-followers`

#### Enter directory

`cd fake-insta-followers`

#### Install Dependencies

`npm install`

#### Build

`npm run build`

# Usage

### Without cronjob

Create a `.env` (no file extensions just this) in the root directory of the projects (same layer as the package.json, README.md etc.) with the following options:

```env
IG_FOLLOWER1=someusername1
IG_FOLLOWER2=someusername2
IG_USERNAME=YOUR_INSTA_USERNAME
IG_PASSWORD=YOUR_INSTA_PASSWORD
```

Finally run `npm run start` and **leave it open**.

### With cronjob

If you operating system supports cron jobs add `IS_CRON=true` to the `.env` file and setup a cronjob.

#### Hint

If you set the enviroment variable `NO_ENV` to `true`, the `.env` file will not be loaded. you can achieve this by running the command like this:

`NO_ENV=true npm start`
