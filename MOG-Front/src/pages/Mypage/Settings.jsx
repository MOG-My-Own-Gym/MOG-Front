import OnConstruction from '../../components/OnConstruction/OnConstruction';
import styles from './Settings.module.css';
export default function Settings() {
  return (
    <>
      <div className={styles['settings']}>
        <OnConstruction />
      </div>
    </>
  );
}
