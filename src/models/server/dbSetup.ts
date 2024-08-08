import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
import { db } from "./name";
import { databases } from "./config";

export async function getOrCreateDB() {
    try {
        // Try to get the database
        await databases.get(db);
        console.log("Database connected 1 1 1");
    } catch (error) {
        console.log("Database not found, attempting to create a new one...");
        
        try {
            // Create the database
            await databases.create(db, db);
            console.log("Database created");

            // Create the collections
            await Promise.all([
                createAnswerCollection(),
                createCommentCollection(),
                createQuestionCollection(),
                createVoteCollection()
            ]);

            console.log("Collections created successfully");
            console.log("Database connected");
        } catch (collectionError) {
            console.error("Error in creating collections or connecting to the database:", collectionError);
            throw collectionError; // Re-throw the error to ensure it can be handled upstream
        }
    }
    return databases;
}
