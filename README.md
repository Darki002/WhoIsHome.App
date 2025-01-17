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

## Mobile App

In the future a prebuild of the Mobile app will be available here on this repository, but only as an `.apk` for Android.
For IOS or any other platform you can a build yourself. 

### Installation (Android only)

1. Download the `.apk` file
2. Enable `Setting > Security > Unknown Sources` *
3. Execute the apk
4. Open the app
5. Set the configs on the configs screen

\* Must be enabled since you don't download it from the Google Play Store.

### Config Screen

| Field    | Description                                                                                                                                         |
|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| Base URL | THe URL to the server where the Backend Service is hosted                                                                                           |
| API KEy  | The API Key configured in the Backend Service. See [Env Variables](https://github.com/Darki002/WhoIsHome/blob/main/README.md#environment-variables) |

## Backend Service

This has to be used yourself. For information on how to set it up see the Documentation on this [Repo](https://github.com/Darki002/WhoIsHome/blob/main/README.md)

# Local Development

To start the project

1. Check out the repo
2. Make sure Node.js is installed
3. run `npm i`
4. start the project with `npx expo start`

For more information check out the documentation of [Expo](https://expo.dev/).

## Local Configuration

To avoid the Config Screen everytime you start up the project you can set the configs in the Environment Variables instead.

*Note: only works for local development*

| ENV VAR                    | Description                                                                                                                     | Value                              |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| EXPO_PUBLIC_USE_ENV_CONFIG | If True use the configs of the following env variables                                                                          | A boolean True or False            |
| EXPO_PUBLIC_API_BASE_URI   | The Base URL to the Server or local instance                                                                                    | A string URL e.g. `localhost:8080` |
| EXPO_PUBLIC_API_KEY        | The API Key defined in the backend. See [here](https://github.com/Darki002/WhoIsHome/blob/main/README.md#environment-variables) | A string for the API Key           |