import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { MilvusClient } from '@zilliz/milvus2-sdk-node'

require('dotenv').config()

export async function GET(req) {
  const address = process.env.MILVUS_URL
  // - For a serverless cluster, use an API key as the token.
  // - For a dedicated cluster, use the cluster credentials as the token
  // in the format of 'user:password'.
  const token = process.env.MILVUS_KEY

  const client = new MilvusClient({ address, token })

  // res = await client.describeCollection({
  //   collection_name: 'OperatorTraining',
  // })

  // console.log(res)

  return NextResponse.json({ msg: 'hello world' }, { status: 200 })
}
