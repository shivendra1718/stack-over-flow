import { Permission,Role } from "node-appwrite";
import { db, answerCollection } from "./name";
import { databases } from "./config";


export default  async function createAnswerCollection() {

    await databases.createCollection(db, answerCollection,answerCollection,[
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
        Permission.read(Role.users())
    ])
    console.log(" answer collection is created ")

    //creating arttibutes and indexes
    await Promise.all([databases.createStringAttribute(db, answerCollection,"questionId",100,true),
    databases.createStringAttribute(db, answerCollection,"content",10000,true),
    databases.createStringAttribute(db, answerCollection,"authorId",50,true)
])
         console.log("attributes are created successfully")

}