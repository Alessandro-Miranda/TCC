import dotenv from 'dotenv';
import firebase, { initializeApp } from 'firebase/app';

dotenv.config();

const API_KEY = process.env.API_KEY?.trimEnd();
const AUTH_DOMAIN = process.env.AUTH_DOMAIN?.trimEnd();
const PROJECT_ID = process.env.PROJECT_ID?.trimEnd();
const STORAGE_BUCKET = process.env.STORAGE_BUCKET?.trimEnd();
const MESSAGIN_SENDER_ID = process.env.MESSAGIN_SENDER_ID?.trimEnd();
const APP_ID = process.env.APP_ID?.trimEnd();
const DATABASE_URL = process.env.DATABASE_URL?.trimEnd();

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    databaseURL: DATABASE_URL,
    messagingSenderId: MESSAGIN_SENDER_ID,
    appId: APP_ID
}

export const firebaseApp = initializeApp(firebaseConfig);