import styles from '@/styles/summary.module.scss'

export default function Summary({ text }) {
  return (
    <div className={styles.container}>
      <p>Summary</p>
      <h3>{text}</h3>
    </div>
  )
}
