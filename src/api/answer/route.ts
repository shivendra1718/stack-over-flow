import { databases } from "@/models/client/config";
import { users } from "@/models/server/config";
import { answerCollection, db } from "@/models/server/name";
import { UserPref } from "@/store/auth";
import { NextRequest, NextResponse } from "next/server";
import {ID} from 'node-appwrite'


export default async function POST(request:NextRequest) {
    try {
        const{ questionId,authorId, answer} = await request.json()
        const response = databases.createDocument(db,answerCollection,ID.unique(),{
            content:answer,
            authorId,questionId
        })
        // increase authur reputation
      const prefs = await users.getPrefs(authorId)
      await users.updatePrefs(authorId,
        {
         reputation:   Number(prefs.reputation)+1
        })
        return NextResponse.json(response,{
            status:201
        })
        
    } catch (error:any) {
        return NextResponse.json(
            {
                error:error.message|| "error in creating in answer"
            },
            {
                status:error?.status||error?.code|| 500
            }
        )
        
    }
    
}

export  async function DELETE(request:NextRequest) {

    try {
const {answerId} = await request.json()
 const answer = await databases.getDocument(db,answerCollection,answerId)

 const response = await databases.deleteDocument(db,answerCollection,answerId)
 // decrease  the reputation 
 const prefs = await users.getPrefs(answer.authorId)
      await users.updatePrefs(answer.authorId,
        {
         reputation:   Number(prefs.reputation)-1
        })
        return NextResponse.json(response,{
            status:201
        })

        
    } catch (error:any) {

        NextResponse.json(error.message||"error in deleting the answer",{
            status:501
        })
        
    }
    
}