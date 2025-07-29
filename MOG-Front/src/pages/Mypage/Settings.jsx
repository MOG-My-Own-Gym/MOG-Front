import OnConstruction from '../../components/OnConstruction/OnConstruction';
import styles from './Settings.module.css';
export default function Settings() {
  return (
    <>
      <h1 id="padding" style={{ marginTop: '55px', fontWeight: 'bold' }}>
        환경 설정
      </h1>
      <div className={styles['settings']}>
        <OnConstruction />
      </div>
    </>
  );
}
