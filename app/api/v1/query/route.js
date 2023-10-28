import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { MilvusClient } from '@zilliz/milvus2-sdk-node'

require('dotenv').config()


export async function GET(req) {
  const MILVUS_URL = process.env.MILVUS_URL
  // - For a serverless cluster, use an API key as the token.
  // - For a dedicated cluster, use the cluster credentials as the token
  // in the format of 'user:password'.
  const MILVUS_KEY = process.env.MILVUS_KEY

  const client = new MilvusClient({ MILVUS_URL, MILVUS_KEY })

  // vectorizing the input vector
  const req_json = JSON.parse(req.body);
  if (!req_json.text) {
    return NextResponse.json({ msg: 'Usage: body {text: text for request}' }, { status: 400 })
  }

  //vectorize the vector
  const vector_in = vectorize(req_json.text)

  // searching the DB
  res = await client.search({
    collection_name: "NAME",
    vector: vector_in,
    output_fields: ['text']
  }).then(data => JSON.parse(data))

  if (res.status.error_code != 'Success') {
    return NextResponse.json({ msg: "DB query error (" + res.status.error_code + ":" + res.status.reason + ")" }, { status: 405 })
  }

  // take up to five results as context
  const context = res.results.slice(0, min(5, len(res.results)))
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const gptResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    temperature: 1,
    messages: [
      {
        role: "system",
        content: `You are to be a trained emergency dispatcher, a caller is in danger and is reporting their situation to you.
        You will be provided a question and a JSON array containing semantically similar embeddings to the question queried from a vector 
        database containing your instruction manual. Give them instructions on what they should do, keep in mind that you must be professional
        as a 911 operator and use the adequate language.`,
      },
      {
        role: "user",
        content: req_json.text + JSON.stringify(context),
      },
    ],
  }).then(data=>JSON.parse(data));


  return NextResponse.json({ msg: gptResponse.choices[0].message.content }, { status: 200 })
}
