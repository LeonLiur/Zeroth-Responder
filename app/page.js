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
  const [instructions, setInstructions] = useState('')
  const [isReady, setIsReady] = useState(false)
  const history = [
    {
      role: 'assistant',
      text: 'hello world',
    },
    {
      role: 'user',
      text: 'hello world',
    },
  ]
  return (
    <main className={styles.main}>
      <div className={styles.messageContainer}>
        {history.map((elem) => (
          <MessageBlock role={elem.role} text={elem.text} />
        ))}
        <Summary text={'Summary'} />
      </div>
      <Controls />

      <SpeakerComponent text_in={instructions} isDone={isReady} />
    </main>
  )
}
