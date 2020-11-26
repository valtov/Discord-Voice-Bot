const https = require('https');
const fs = require('fs');
const stream = require('stream')
const Axios = require('axios')

const DISCORD_BUCKET = "discord-audio-clips"
const link = 'https://cdn.discordapp.com/attachments/669100761359187972/778026958683373628/UIFinal.mp3'
// Import required AWS SDK clients and commands for Node.js
const { S3Client, PutObjectCommand, ListObjectsCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
//const fs = require("fs");

// Set the AWS region
const REGION = "us-west-1"; //e.g. "us-east-1"

async function upload_to_aws(){
    const s3 = new S3Client(REGION);
    const response = await Axios.get(link)
    //response.data.pipe(uploadFromStream(s3))
    var params = {Bucket: DISCORD_BUCKET, Key: '778026958683373628', Body: response.data, 'x-amz-decoded-content-length': 18228, 'Content-Length': 18228};
    try {
        const data = await s3.send(new PutObjectCommand(params));
        console.log("Upload success", data);
    } catch (err) {
        console.log("Error", err);
    }
    //response.data.pipe(fs.createWriteStream('DISCORD_FILE.mp3'))

    

}
async function uploadFromStream(s3) {
    var pass = new stream.PassThrough();

    var params = {Bucket: DISCORD_BUCKET, Key: '778026958683373628', Body: pass};
    try {
        const data = await s3.send(new PutObjectCommand(params));
        console.log("Upload success", data);
    } catch (err) {
        console.log("Error", err);
    }

    return pass;
}

upload_to_aws()