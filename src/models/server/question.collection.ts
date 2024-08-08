import { Permission, Role } from "node-appwrite";
import { db, questionCollection } from "./name";
import { databases } from "./config";

export default async function createQuestionCollection() {
    try {
        // Create the collection with permissions
        await databases.createCollection(
            db,
            questionCollection,
            questionCollection,
            [
                Permission.read(Role.any()),     // Read access for any user (authenticated or not)
                Permission.create(Role.users()), // Create access for authenticated users
                Permission.update(Role.users()), // Update access for authenticated users
                Permission.delete(Role.users()), // Delete access for authenticated users
                Permission.read(Role.users())    // Additional read access for authenticated users
            ]
        );
        console.log("Question collection is created");

        // Create attributes
        await Promise.all([
            databases.createStringAttribute(db, questionCollection, "title", 100, true),
            databases.createStringAttribute(db, questionCollection, "content", 10000, true),
            databases.createStringAttribute(db, questionCollection, "authorId", 100, true),
            databases.createStringAttribute(db, questionCollection, "tag", 100, true, undefined, true),
            databases.createStringAttribute(db, questionCollection, "attachmentId", 50, false)
        ]);
        console.log("Question attributes are created successfully");

        // Uncomment and modify as needed for creating indexes
        /*
        await Promise.all([
            databases.createIndex(db, questionCollection, "title_index", "fulltext", ["title"], ["asc"]),
            databases.createIndex(db, questionCollection, "content_index", "fulltext", ["content"], ["asc"])
        ]);
        console.log("Indexes are created successfully");
        */
        
    } catch (error) {
        console.error("Error creating question collection or attributes:", error);
    }
}
