/* Incomplete command, was messing around with AWS buckets to store audio files uploaded by users in the discord server
*/

const https = require('https');
const fs = require('fs');
//const stream = require('stream')
const Axios = require('axios')

const DISCORD_BUCKET = "discord-audio-clips"

// Import required AWS SDK clients and commands for Node.js
const { S3Client, PutObjectCommand, ListObjectsCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
//const fs = require("fs");

// Set the AWS reion
const REGION = "us-west-1"; //e.g. "us-east-1"

// Set the parameters
//const uploadParams = { Bucket: "discord-audio-clips", Key: "KEY" }; //BUCKET_NAME, KEY (the name of the selected file),
//const bucketParams = { Bucket: "discord-audio-clips", Key: "newOraclesF.wav" };

// BODY (the contents of the uploaded file - leave blank/remove to retain contents of original file.)
//const file = "newOraclesF.wav"; //FILE_NAME (the name of the file to upload (if you don't specify KEY))
//const fileName = "the-file-name"
// Create S3 service object


module.exports = {
  args: false,
	name: 'upload',
	description: 'Uploads audio clip to database',
	async execute(message, args, server) {
    if (args.length > 1) {
      message.channel.send('Invalid args! Usage: !upload (message id | blank)')
      return
    }
    if(args.length == 0) {
      //var channel = message.channel
      // Get messages and filter by user ID
      message.channel.messages.fetch({ limit: 10 }).then(messages => {
        var finished = false
        for (let [_, msg] of messages) { 
          if(finished) break;
          for (let [_, attachment] of msg.attachments) {
            console.log(`ATTACHMENT FOUND: ${attachment.url}`)
            if (!upload_to_aws(attachment.url, message.id))
              message.channel.send('This file already exists.')
            else  
              message.channel.send('Uploaded succesfully.')
            finished = true
            break
          }
        }
        if(!finished) {
          message.channel.send("Attachment not found within the last 10 messages")
          return
        }
      }).catch(console.error);    //filter(m => m.author.id === message.author.id
    } else {
      try {
        message.channel.messages.fetch(args[0]).then(msg => {
          if(msg.attachments.size == 0) {
            message.channel.send(`Message ${message.id} is not a file!`)
            return
          }
          for (let [_, attachment] of msg.attachments) {
            console.log(`ATTACHMENT FOUND: ${attachment.url}`)
            upload_to_aws(attachment.url, extract_name(attachment.url))
            break
            //if (!upload_to_aws(attachment.url, message.id))
              //message.channel.send('This file already exists.')
            //else  
              //message.channel.send('Uploaded succesfully.')
          }
        }).catch(console.error)
      }
      catch(err){
        message.channel.send(`Something went wrong: ${err}, make sure the ID is of an audio file`)
      
      }
    }
    //const playing_message = await server.channel.send(`Playing '${yt_link}' click on reaction to pause`)
    //server.dispatcher = server.connection.play(await ytdl(yt_link), {type: 'opus'} );
    },
};

function extract_name(discord_attachment_url) {
  var subsets = discord_attachment_url.split('/');
  return subsets[subsets.length - 1];
}

async function upload_to_aws(url, key){
    const s3 = new S3Client(REGION);
    // call S3 to retrieve upload file to specified bucket
      // Configure the file stream and obtain the upload parameters

      //uploadParams.Key = path.basename(file);
      // call S3 to retrieve upload file to specified bucket
      try {
        const bucketParams = { Bucket: DISCORD_BUCKET, Key: key };
        console.log(`Attempting to parse S3 bucket for item name: ${key}`)
        const data = await s3.send(new HeadObjectCommand(bucketParams));
        console.log("File name already exists. Doing nothing.")
        //return false
        // Name already exists, don't upload
        
      } catch (err) {
        // Name doesn't exist, proceeds to upload the file to the bucket
        console.log(`Filename: ${key} does not exist, attempting to upload it`)
        const response = await Axios.get(url)
        var params = {Bucket: DISCORD_BUCKET, Key: key, Body: response.data};
        try {
            const data = await s3.send(new PutObjectCommand(params));
            console.log("Upload success", data);
        } catch (err) {
            console.log("Error", err);
        }
      }
}