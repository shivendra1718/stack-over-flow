import { databases } from "@/models/client/config";
import { voteCollection,db, questionCollection, answerCollection } from "@/models/server/name";
import { NextRequest,NextResponse } from "next/server";
import {Query} from 'node-appwrite'


 export async function POST(request:NextRequest) {
    try {
        //grab data

        const {votedById,voteStatus,type,typeId} =  await request.json()

        // list document 

       const response=  await databases.listDocuments(db, voteCollection,[
            Query.equal("type",type),
            Query.equal("votedById",votedById),
            Query.equal("typeId",typeId),
        ])


            if (response.documents.length>0) {
                //
            }
            if (response.documents[0]?.voteStatus!==voteStatus) {
                //
                const questionAndAnswer = await databases.getDocument(db,
                  type === "question"  ? questionCollection: answerCollection,typeId
                    )
            }

             const [upvotes,downvote] = await Promise.all([
                databases.listDocuments(db, voteCollection,[
                    Query.equal("type",type),
                    Query.equal("typeId",typeId),
                    Query.equal("voteStatus","upvoted"),
                    Query.equal("voteById",votedById),
                    Query.limit(1)
                ]),
                databases.listDocuments(db, voteCollection,[
                    Query.equal("type",type),
                    Query.equal("typeId",typeId),
                    Query.equal("voteStatus","downvoted"),
                    Query.equal("voteById",votedById),
                    Query.limit(1)
                ])
                
             ])

             return NextResponse.json(
                { data:{
                    document:null,
                    voteResult: upvotes.total= downvote.total
                }},
                {status:201}
             )






        
    } catch (error:any) {
        return NextResponse.json(
            {
                error:error.message|| "error in voting"
            },
            {
                status:error?.status||error?.code|| 500
            }
        )
    }
    
 }