# ChatterBox

# Table of Contents

* [Introduction](#introduction)
* [Motiviation](#motivation)
* [Features](#features)
* [Build](#build)

# Introduction

Desktop App that simulates key presses and mouse clicks by reading input from Twitch chat.

In order for you to use this application, it is recommended you do not use your own Twitch account -- rather, use a separate twitch account that will act as a bot.

Right now, this app only works with Windows 10 (64-bit) due to lack of hardware on my side. Would love to add support soon.

# Motivation

Before I created this project, I saw [this video](https://youtu.be/QIacthT6c84) and wanted to provide the same tool for a couple streamer buddies of mine. Creating this app would allow me to help out some of my friends for their Content-Creation jobs and let me have fun working in a new tool. I went with creating an Electron App because it allows me to create a Desktop application using TypeScript.

# Features

* Connect to multiple Twitch chats at once

* Set Key mappings with an alias from chat ( you can set key words such as 'move' to bind to 'w' )

* Use Mouse clicks and Keyboard presses as registered inputs

* Set duration of inputs - can either be a quick press or a long hold

# Build

## Note before building

Due to incompatibility issues, we are using a previous version of Node, Electron, and RobotJS (library that allows us to simulate key presses).

We are currently running the following versions:
```
Node:     15.2.1
Electron: 11.0.0
RobotJS:  ^0.6.0
```

Because of this, you'll need to set your environment accordingly. If you need help setting up a previous version of Node, you can use [NVM](https://github.com/nvm-sh/nvm).

***

## Building Steps

1) Clone the repository and cd into the directory

```cmd
> git clone https://github.com/huntertparks/chatterbox
> cd chatterbox
```

2) Install dependencies

```cmd
> npm i
```

3) Re-build some dependencies to work with your current Node version

```cmd
> npm run rebuild
```

4) You can either run it from your cmd or build the app from here

```cmd
> npm start

OR

> npm run make
```
