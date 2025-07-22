import styles from './RadialGradientSpinner.module.css';

export default function RadialGradientSpinner({ isMobile }) {
  return (
    <div className={styles['spinner-container']}>
      <div className={styles['spinner-title']}>
        <h3>
          <span>로딩 </span>중 입니다...
        </h3>
      </div>
      <div className={styles['spinner-wrapper']}>
        <div className={styles['spinner']} />
      </div>
    </div>
  );
}
