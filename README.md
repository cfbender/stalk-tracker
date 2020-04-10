# Stalk Tracker

## Summary

This is a discord bot that will allow a server to track their turnip prices together!

#### Features:
+ Price logging for Nook and Daisy
+ All-time stats summary
+ Today's stats
+ DM Notifications for price thresholds

## How to Deploy

Can be deployed on Heroku for free! Click the below button to set up your deployment. You will need to have already created a bot account for it to log into. You can follow a tutorial such as [this one](https://medium.com/davao-js/2019-tutorial-creating-your-first-simple-discord-bot-47fc836a170b) (under the "Generating Token Key" and "Adding bot to our test server" sections) to get that set up.


#### IMPORTANT: 
After deployment, you will need to set up environment secrets for the bot to run correctly. These are called `Config Vars` in Heroku, or just in a .env file locally.

You will need to set up:
+ `MONGOGB_URI` the URI of the mongoDB instance given to you by Heroku
+ `SEND_UPDATES` A boolean flag (`true` or `false`) for whether or not to post updates to the update channel
+ `COMMAND_CHANNEL` the ID of the channel to run commands in
+ `UPDATE_CHANNEL` the ID of the channel to post updates to 
+ `TIMEZONE` In standard ISO format such as `America/Denver`
+ `TOKEN` The Discord bot token for it to log into.
  
## Architecture

Written in TypeScript, runs in Node.js using the Discord.js library.


