# Easy Server

You can use Easy-Server to test ZEGOCLOUD's product quickly.

> **Warning**
> 
> This project is for TEST only! Do not use it for production!
> 
> You can copy the code and deploy to your own server.

## Get get access token

You may need access token when you using ZEGOCLOUD's service. Click the Deploy button below to deploy a server then you can get access token from it:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FZEGOCLOUD%2Feasy_server_nextjs&env=ZEGOCLOUD_APP_ID,ZEGOCLOUD_SERVER_SECRET)

```
https://your_vercel_project_name.vercel.app/api/get_access_token?uid=123
```

> **Note**
> 
> Token valid in 3600 seconds by default. If you want to change the expired time, request with the `expired_ts` parameter. e.g. 
> 
> `https://your_vercel_project_name.vercel.app/api/get_access_token?uid=123&expired_ts=7200`

## Implement call invitation functionality with 

### Create Firebase project

We use [Firebase FCM](https://firebase.google.com/docs/cloud-messaging) for call invitation service.

1. Go to [Firebase Console](https://console.firebase.google.com/) and create new project if you don't have one.

2. Generate `Firebase Admin SDK Private Key`

![fcm_admin_sdk_key](https://user-images.githubusercontent.com/5242852/209456355-80fba59a-ea47-46af-8bd8-c9fafb62d745.gif)

### Deploy service

1. Click this deploy button below to start deploy your service.
> [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FZEGOCLOUD%2Feasy_server_nextjs&env=ZEGOCLOUD_APP_ID,ZEGOCLOUD_SERVER_SECRET,FA_PROJECT_ID,FA_PRIVATE_KEY_ID,FA_PRIVATE_KEY,FA_CLIENT_EMAIL,FA_CLIENT_ID,FA_CLIENT_X509_CERT_URL)
2. Create git repository for the service
3. Open the `Firebase Admin SDK Private Key` you just obtain at the above step, and fill in the content to the `Required Environment Variables` parameter input box.
4. Press `Deploy` button, wait for the depoly process completed.

> **Note**
> This URL can also get access token too.


## About us

https://www.zegocloud.com

