'use client'

import { useEffect, useState } from 'react'
import styles from '@/styles/controls.module.scss'

export default function Controls() {
  const [secElapsed, setSecElapsed] = useState(50)
  useEffect(() => {
    setInterval(() => {
      setSecElapsed((prev) => prev + 1)
    }, 1000)
  }, [])

  return (
    <div className={styles.container}>
      <h4>Zeroth Responder</h4>
      <h2>
        {Math.floor(secElapsed / 3600) < 10
          ? '0' + Math.floor(secElapsed / 3600)
          : Math.floor(secElapsed / 3600)}
        :
        {Math.floor(secElapsed / 60) < 10
          ? '0' + Math.floor(secElapsed / 60)
          : Math.floor(secElapsed / 60)}
        :{secElapsed % 60 < 10 ? '0' + (secElapsed % 60) : secElapsed % 60}
      </h2>
      <button className={styles.endButton}>
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.2144 33.7945L13.8938 33.0346C16.3118 32.3488 18 29.9652 18 27.237C18 27.237 18 27.237 18 27.237C18 27.237 18 23.9278 24 23.9278C29.9999 23.9278 30 27.2369 30 27.237C30 27.237 30 27.237 30 27.237C30 29.9652 31.6882 32.3488 34.1062 33.0346L36.7856 33.7945C40.4368 34.8301 44 31.8205 44 27.7008C44 25.2254 43.4468 22.7461 41.8342 21.0064C39.1195 18.0778 33.6136 14 24 14C14.3864 14 8.88046 18.0778 6.16577 21.0064C4.55318 22.7461 4 25.2254 4 27.7008C4 31.8205 7.56315 34.8301 11.2144 33.7945Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  )
}
