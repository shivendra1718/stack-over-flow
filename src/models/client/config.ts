import { Client, Account, Avatars,Databases,Storage } from "appwrite";
import env from "@/app/env";

const client = new Client()
    .setEndpoint(env.appwrite.apiKey)// Your API Endpoint
    .setProject(env.appwrite.projectId);                 // Your project ID

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);


export {account,storage,databases,avatars}