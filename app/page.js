"use client";

import MicrophoneComponent from './components/microphone';
import SpeakerComponent from './components/speaker';
import styles from './page.module.scss'
import { useState } from 'react';

// This is the main component of our application
export default function Home() {
  const STAGES = ["describe_emergency", "personal_information", "followup_questions"]
  const [instructions, setInstructions] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [problemDescription, setProblemDescription] = useState("")
  const [questions, setQuestions] = useState()
  const [backNForth, setBackNForth] = useState([])
  const [loading, setLoading] = useState(false)
  return (
    <main className={styles.main}>
      <MicrophoneComponent
        setGptReply={setInstructions}
        setMicrophoneDoneRecording={setIsReady}
        problem_description={problemDescription}
        setProblemDescription={setProblemDescription}
        setQuestions={setQuestions}
        backNForth={backNForth}
        questions={questions}
        setBackNForth={setBackNForth}
        setLoading={setLoading}
      />
      <SpeakerComponent text_in={instructions} isDone={isReady} />
      {loading && (<img src="/images/loading.gif" />)}
    </main>
  )
}