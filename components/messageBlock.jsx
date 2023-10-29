import styles from '@/styles/messageBlock.module.scss'

export default function MessageBlock({ role, text }) {
  return (
    <div
      className={styles.container}
      style={{
        background:
          role === 'assistant' ? 'var(--blue-300)' : 'var(--green-500)',
        border:
          role === 'assistant'
            ? '3px solid var(--blue-400)'
            : '3px solid var(--green-600)',
      }}
    >
      <p>{role === 'assistant' ? 'Zeroth Resopnder' : 'You'}</p>
      <h3>{text}</h3>
    </div>
  )
}
