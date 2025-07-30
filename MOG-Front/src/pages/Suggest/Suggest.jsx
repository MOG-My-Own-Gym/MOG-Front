import PageBackButton from '../../components/Button/Routine/PageBackButton/PageBackButton';
import Stage from '../../components/Stage/Stage';
import styles from './Suggest.module.css';

export default function Suggest() {
  return (
    <div className={styles['suggest']}>
      <PageBackButton />
      <div className={styles['suggest-wrapper']}>
        <div className={styles['suggest-container']}>
          <Stage />
        </div>
      </div>
    </div>
  );
}
