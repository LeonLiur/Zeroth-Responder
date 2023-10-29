"use client";

import MicrophoneComponent from './components/microphone';
import SpeakerComponent from './components/speaker';
import styles from './page.module.scss'
import { useState } from 'react';

// This is the main component of our application
export default function Home() {
  const [instructions, setInstructions] = useState("");
  const [doneRecording, setDoneRecording] = useState(true);
  return (
    <main className={styles.main}>
      <MicrophoneComponent setGptInstructions={setInstructions} setMicrophoneDoneRecording={setDoneRecording} />
      <SpeakerComponent text={"hi hello i am under the water"} isDone={true}/>
    </main>
  )
}