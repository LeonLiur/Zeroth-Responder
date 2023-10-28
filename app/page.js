"use client";

import MicrophoneComponent from './components/microphone';
import styles from './page.module.scss'

// This is the main component of our application
export default function Home() {

  return (
    <main className={styles.main}>
      <MicrophoneComponent />
    </main>
  )
}