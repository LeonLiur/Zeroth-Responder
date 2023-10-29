import { NextResponse } from 'next/server'
import { MilvusClient } from '@zilliz/milvus2-sdk-node'
import OpenAI from 'openai';


require('dotenv').config()


export async function POST(req) {
  const address = process.env.MILVUS_URL
  const token = process.env.MILVUS_KEY

  const client = new MilvusClient({ address, token })

  const req_json = await req.json();

  if (!req_json.text) {
    return NextResponse.json({ msg: 'Usage: body {text: text for request}' }, { status: 400 })
  }

  //vectorize the vector
  const vector_res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
    },
    body: JSON.stringify({
      input: req_json.text,
      model: 'text-embedding-ada-002',
    }),
  }).then(response => response.json())

  const vector_in = vector_res.data[0].embedding


  // searching the DB
  const res = await client.search({
    collection_name: "operator_training",
    vector: vector_in,
    output_fields: ['text'],
    limit: 5
  })

  if (res.status.error_code != 'Success') {
    return NextResponse.json({ msg: "DB query error (" + res.status.error_code + ":" + res.status.reason + ")" }, { status: 405 })
  }

  // take up to five results as context
  const context = res.results

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const gptResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    temperature: 1,
    messages: [
      {
        role: "system",
        content: `You are to be an emergency dispatcher, a caller is in danger and is reporting their situation to you.
        You will be provided a question and a JSON array containing semantically similar embeddings to the question queried from a vector 
        database containing your instruction manual. Give them instructions on what they should do, keep in mind that you must be professional
        as a 911 operator and use the adequate language.`,
      },
      {
        role: "user",
        content: req_json.text + JSON.stringify(context),
      },
    ],
  })

  return NextResponse.json({ msg: gptResponse.choices[0].message.content }, { status: 200 })
}
