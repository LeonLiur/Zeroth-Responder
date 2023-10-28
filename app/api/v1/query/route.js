import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { MilvusClient } from '@zilliz/milvus2-sdk-node'

export function GET(req) {
  return NextResponse.json({ msg: 'hello world' }, { status: 200 })
}
