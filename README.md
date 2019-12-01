# Overview

This is mobile React Native application for tracking financial conditions and creating snapshots for the current financial situation. 

It uses AWS AppSync to quickly syncronize data between several devices.

# Configuring and running

## Setting up AWS Cognito and AppSync

You will need to have your own instances of AWS servces set up.

Clone this project to some directory and then:

`aws configure`

`aws init`

`aws add auth` to add Cognito pool

`aws add api` to add GraphQL for AppSync

## Installation

Install Android Studio and Java binaries.

Make sure you have installed NodeJs, NPM.

Install React Native CLI: `npm install react-native-cli --global`

## Running

Configure and start any android device (AVD) in the Android Studio

Run Metro Bundler: `react-native start &`

Build and Deploy to emulated device: `react-native run-android`
