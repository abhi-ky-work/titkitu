'use client'

import { Amplify , type ResourcesConfig } from 'aws-amplify';

export const authConfig : ResourcesConfig["Auth"] = {
    Cognito:{
        userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
        userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
        // userPoolClientSecret:  String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_SECRET)
    }
};

Amplify.configure({
    Auth: authConfig,
});

export default function ConfigureAmplifyClientside(){
    return null
}