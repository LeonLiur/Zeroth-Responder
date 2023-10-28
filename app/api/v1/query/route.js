import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { MilvusClient } from '@zilliz/milvus2-sdk-node'

export async function GET(req) {
  const address =
    'https://in03-575b131d648efbe.api.gcp-us-west1.zillizcloud.com'
  // - For a serverless cluster, use an API key as the token.
  // - For a dedicated cluster, use the cluster credentials as the token
  // in the format of 'user:password'.
  const token =
    'ade46ba572172c1a5655d38a460e85df620e2367068dbec49cb913ff491249881e5182d8f07dbacd0af53751289a389eef8715b8'

  const client = new MilvusClient({ address, token })

  // res = await client.describeCollection({
  //   collection_name: 'OperatorTraining',
  // })

  // console.log(res)

  return NextResponse.json({ msg: 'hello world' }, { status: 200 })
}
