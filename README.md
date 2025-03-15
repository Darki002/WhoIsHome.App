# WhoIsHome Mobile App

This repository is the mobile app for the WhoIsHome project. For the app to work, it needs a running instance of
the Backend Service either local or hosted on a server. 
See the docs on the backend repo for how to run it locally: https://github.com/Darki002/WhoIsHome

# What is WhoIsHome

This mobile app is a family Manager Tool to instantly see who is at home at which time. 
The whole project is fully open source and free to use.

## Features

- Create "Events"
- Have simple overview over all family members
- See who is at home at which time
- Easily see what the outer members are doing today

# Use the app for yourself

*TODO:* new set up with configuration for

* EAS
* Sentry (optional)
* Firebase Cloud Messaging

Explain how to build the app with the Action

## Build App

### Env Variables for GitHub Action

| Field                    | Description                                                                                                                                         |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| EXPO_PUBLIC_API_BASE_URI | The URL to the server where the Backend Service is hosted                                                                                           |
| EXPO_PUBLIC_API_KEY      | The API Key configured in the Backend Service. See [Env Variables](https://github.com/Darki002/WhoIsHome/blob/main/README.md#environment-variables) |
| SENTRY_AUTH_TOKEN        | Sentry Auth Token for Logging to Sentry. You also have to change `app.json` in order to work                                                        |

## Backend Service

This has to be used yourself. For information on how to set it up see the Documentation on this [Repo](https://github.com/Darki002/WhoIsHome/blob/main/README.md)

# Local Development

To start the project

1. Check out the repo
2. Make sure Node.js is installed
3. run `npm i`
4. start the project with `npx expo start`

For more information check out the documentation of [Expo](https://expo.dev/).
