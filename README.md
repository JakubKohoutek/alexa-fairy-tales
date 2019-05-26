# Skill Handler for Amazon Alexa

This is custom built skill handler for Amazon Alexa. It was developed specifically
for "fairy tales" skill, but it can be easily modified to handle any other skill.

Documentation of ASK-SDK (official development kit for Alexa skills) with usage 
examples can be found [here](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs)

## Installation

Before running the application, one must install all dependencies:
```bash
npm install
```

Also it is necessary to create `public_media` folder in the project's root folder with
media files that Alexa should play. 

## Running the Application

To run the skill handler, execute:
```bash
npm start
```

## Tip for Development on Local Machine

For fast development and testing I utilized an SSH reverse tunnel to my server. Very
useful guide with details on how to do that can be found 
[here](https://jerrington.me/posts/2019-01-29-self-hosted-ngrok.html).

When using the SSH tunnel, one can run the code on local machine and at the same
time expose it at the public URL that can be set as skill's endpoint in Amazon
developer portal.

For example, to expose my local port `3000` on my public server on the port `3333`
I executed:
```bash
ssh -R 3333:localhost:3000 user@mydomain.com
```

## Configuration

Accepted environment variables:

```bash
MEDIA_URL_BASE='https://domain-with-media-files.com/'
PORT=3333
```