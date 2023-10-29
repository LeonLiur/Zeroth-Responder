import { NextResponse } from 'next/server'
import { MilvusClient } from '@zilliz/milvus2-sdk-node'
import OpenAI from 'openai';

require('dotenv').config()

export async function POST(req) {
  const address = process.env.MILVUS_URL
  const token = process.env.MILVUS_KEY

  const client = new MilvusClient({ address, token })
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const req_json = await req.json();
  if (!req_json.problem_description || (typeof req_json.stage === 'undefined')) {
    return NextResponse.json({ msg: 'Usage: body {problem_description: text for request, stage: stage of request}' }, { status: 400 })
  }

  switch (req_json.stage) {
    case 0:
      return NextResponse.json({ msg: "Okay, I'm here to help you out. Stay calm, I just need a bit more information. What is your name?" }, { status: 200 })
    case 1: 
      //vectorize the vector
      const vector_res = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
        },
        body: JSON.stringify({
          input: req_json.problem_description,
          model: 'text-embedding-ada-002',
        }),
      }).then(response => response.json())
      const vector_in = vector_res.data[0].embedding

      const vector_aid = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
        },
        body: JSON.stringify({
          input: "Follow up questions to take",
          model: 'text-embedding-ada-002',
        }),
      }).then(response => response.json())
      const vector_aid_in = vector_aid.data[0].embedding


      // searching the DB
      const res = await client.search({
        collection_name: "operator_training",
        vectors: [vector_in, vector_aid_in],
        output_fields: ['text'],
        limit: 5
      })

      if (res.status.error_code != 'Success') {
        return NextResponse.json({ msg: "DB query error (" + res.status.error_code + ":" + res.status.reason + ")" }, { status: 405 })
      }

      // take up to five results as context
      const context = res.results

      const gptResponse1 = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        temperature: 1,
        messages: [
          {
            role: "assistant",
            content: "911, what is your emergency?"
          }
          ,
          {
            role: "user",
            content: req_json.problem_description
          },
          {
            role: "assistant",
            content: "Okay, I'm here to help you out. Stay calm, I just need a bit more information. What is your name?"
          }
          ,
          {
            role: "user",
            content: req_json.last_reply
          }
          ,
          {
            role: "system",
            content: `You are a 911 operator talking to a caller in danger. Use the JSON array passed to you containing semantically similar vectors queried from a vector database containing your training
            manual to return an array of strings with length 5 containing follow-up questions. Return nothing but the array`
          },
          {
            role: "system",
            content: JSON.stringify(context)
          }
        ],
      })

      const questions = JSON.parse(gptResponse1.choices[0].message.content)

      return NextResponse.json({ questions: questions }, { status: 200 })
    case 2:

  }
}
