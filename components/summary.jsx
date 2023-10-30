import styles from '@/styles/summary.module.scss'

export default function Summary({ points, level }) {
  const COLORS=["red", "orange", "yellow", "lime", "green"]
  return (
    <div className={styles.container} style={{backgroundColor : COLORS[level - 1]}}>
      <h3>Summary</h3>
      <h3><b>Priority level: {level}</b></h3>
      <ul>
        {points.map((elem, idx) => (
          <li key={idx}>{elem}</li>
        ))}
      </ul>
    </div>
  )
}
