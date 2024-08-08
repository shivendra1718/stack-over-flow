import { Permission, Role } from "node-appwrite";
import { db, commentCollection } from "./name";
import { databases } from "./config";

export default async function createCommentCollection() {
    try {
        // Create the collection with correct permissions
        await databases.createCollection(
            db,
            commentCollection,
            commentCollection,
            [
                Permission.read(Role.any()),                 // Read access for any user (authenticated or not)
                Permission.create(Role.users()),             // Create access for authenticated users
                Permission.update(Role.users()),             // Update access for authenticated users
                Permission.delete(Role.users())              // Delete access for authenticated users
            ]
        );
        console.log("Comment collection is created");

        // Create attributes
        await Promise.all([
            databases.createEnumAttribute(db, commentCollection, "type", ["question", "answer"], true),
            databases.createStringAttribute(db, commentCollection, "content", 10000, true),
            databases.createStringAttribute(db, commentCollection, "authorId", 100, true),
            databases.createStringAttribute(db, commentCollection, "typeId", 50, false)
        ]);
        console.log("Attributes are created successfully");
    } catch (error) {
        console.error("Error creating comment collection or attributes:", error);
    }
}
