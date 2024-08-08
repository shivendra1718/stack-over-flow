import { Permission,Role } from "node-appwrite";
import { db, voteCollection } from "./name";
import { databases } from "./config";


export default  async function createVoteCollection() {

    await databases.createCollection(db, voteCollection,voteCollection,[
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
        Permission.read(Role.users())
    ])
    console.log(" vote question collection is created ")

    //creating arttibutes and indexes
    await Promise.all([databases.createStringAttribute(db, voteCollection,"voteById",100,true),
    databases.createStringAttribute(db, voteCollection,"typeId",10000,true),
    databases.createEnumAttribute(db, voteCollection,"type",["question","answer"],true),
    databases.createEnumAttribute(db, voteCollection,"voteStatus",["upVoted","downVoted"],true,undefined,true)
])
         console.log(" voteattributes are created successfully")
}