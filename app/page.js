'use client'

import MicrophoneComponent from '@/components/microphone'
import SpeakerComponent from '@/components/speaker'
import Controls from '@/components/controls'
import styles from './page.module.scss'
import { useState } from 'react'

// This is the main component of our application
export default function Home() {
  const [instructions, setInstructions] = useState('')
  const [isReady, setIsReady] = useState(false)
  return (
    <main className={styles.main}>
      <MicrophoneComponent
        setGptInstructions={setInstructions}
        setMicrophoneDoneRecording={setIsReady}
      />
      <SpeakerComponent text_in={instructions} isDone={isReady} />
      <Controls />
    </main>
  )
}
