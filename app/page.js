'use client'

import MicrophoneComponent from '@/components/microphone'
import SpeakerComponent from '@/components/speaker'
import Controls from '@/components/controls'
import MessageBlock from '@/components/messageBlock'
import Summary from '@/components/summary'
import styles from './page.module.scss'
import { useState } from 'react'

// This is the main component of our application
export default function Home() {
  const STAGES = ["describe_emergency", "personal_information", "followup_questions"]
  const [instructions, setInstructions] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [problemDescription, setProblemDescription] = useState("")
  const [questions, setQuestions] = useState()
  const [backNForth, setBackNForth] = useState([])
  const [loading, setLoading] = useState(false)
  const [triage, setTriage] = useState()
  return (
    <main className={styles.main}>
      {triage && <Summary points={triage.summary_points} level={triage.priority}/>}
      {backNForth.map((elem, idx) => (
        <MessageBlock key={idx} role={elem.role} text={elem.content} />
      ))}
      <Controls />

      {!triage && <MicrophoneComponent
        setGptReply={setInstructions}
        setMicrophoneDoneRecording={setIsReady}
        problem_description={problemDescription}
        setProblemDescription={setProblemDescription}
        setQuestions={setQuestions}
        backNForth={backNForth}
        questions={questions}
        setBackNForth={setBackNForth}
        setLoading={setLoading}
        setTriage={setTriage}
      />}
      <SpeakerComponent text_in={instructions} isDone={isReady} />
      {loading && (<img src="/images/loading.gif" height={100} width={100}/>)}
    </main >
  )
}