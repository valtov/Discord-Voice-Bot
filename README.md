# Discord Voice Controlled Bot

A hotword activated discord bot that runs commands based on your voice input.
 
Any command added to the bot (follow sample commands from the commands folder) will automatically work

All music is played by ytdl-core and speech-text processing is done with DialogFlow and Bumblebee hotword

### Sample Usage After Bot is Installed and Running

Type !join while in a voice channel to have the bot join

Say the hotword (the default hotword is "blueberry" [see .hotword.js for more info]) into your discord mic

The bot will play a confirmation sound, meaning it is ready to listen to your next command

Say "play my way by frank sinatra" into your microphone

### ⚡ Configuration

Create two configuration files in the base directory

key.json: The Google service account for dialogflow

config.json: The discord bot configuration including the Discord Bot API key

```sample config.json
{
    "prefix": "!",
    "token": "NzQ1ODAwMDM2NzEyOTcyNDI4.Xz3CaQ.5zB2cR0SxHO0pMIU-XAZfJGCAtE",
    "aws_access_key_id": "AKIAJX6SGP3GRDHWJCRQ",
    "aws_secret_access_key": "rF5blqeCATixxpqdK7hMxo1lI4TP6OWbJyNZH6Rh"
}
```

```sample key.json
{
  "type": "service_account",
  "project_id": "music-rett",
  "private_key_id": "ckhcic7ca98s7c9a8sc98c79c",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMI$$$$$$$$$$$$$$$$KGLVDrGa\n-----END PRIVATE KEY-----\n",
  "client_email": "music-371@music-rett.iam.gserviceaccount.com",
  "client_id": "0000000000000000",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/"
}

```
### 📑 Before Installation
1. Must have node and npm installed
   https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04

2. Must create a Google Project, register a DialogFlow account under this project and register a service account on the google dashboard (key.json)
   https://console.cloud.google.com/   ---> https://console.developers.google.com/project/_/apiui/credential
   https://dialogflow.cloud.google.com/

   IMPORTANT: After key.json is created must set the environment variable in the base directory:
   export GOOGLE_APPLICATION_CREDENTIALS="./key.json"

3. Must create a Discord Bot and generate an API key for it (config.json)
   https://discord.com/developers/applications

### 📑 Installation

git clone https://github.com/valtov/Discord-Voice-Bot

create config.json and key.json and populate them with the above info

npm install

node bot.js

Test:
run !join while in a voice channel