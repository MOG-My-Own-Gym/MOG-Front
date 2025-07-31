import { useEffect, useState } from 'react';
import styles from './Level.module.css';
import { useSuggest } from '../../../../context/SuggestContext';

export default function Level({ categories }) {
  const { suggestState, saveSuggest } = useSuggest();

  const [typeCheck, setTypeCheck] = useState([]);
  const korMap = {
    beginner: '운동을 처음 해봐요',
    intermediate: '운동을 해본 경험이 있어요',
    expert: '운동을 좋아하고 평소에도 자주해요',
  };
  useEffect(() => {
    saveSuggest({
      Level: [...typeCheck],
      Type: [...suggestState.suggest.Type],
      BodyPart: [...suggestState.suggest.BodyPart],
      Equipment: [...suggestState.suggest.Equipment],
    });
  }, [typeCheck]);
  useEffect(() => {
    if (suggestState.suggest.Level.length > 0) {
      setTypeCheck(suggestState.suggest.Level);
    }
  }, []);
  return (
    <div>
      <form className={styles['radio-form']}>
        {categories?.map(item => {
          return (
            <div
              className={`${styles['radio-list']} ${styles[typeCheck.includes(item) ? 'radioed' : '']}`}
              onClick={() => {
                setTypeCheck([item]);
              }}
            >
              <span
                className={`${styles['radio-input']} ${styles[typeCheck.includes(item) ? 'radioed' : '']}`}
                onClick={() => {
                  setTypeCheck([item]);
                }}
              >
                {typeCheck.includes(item) && (
                  <div
                    className={styles['radio']}
                    style={{ border: 'none', color: '#ffffffff' }}
                  ></div>
                )}
              </span>
              <label className={styles['label']}>{korMap[item]}</label>
            </div>
          );
        })}
      </form>
    </div>
  );
}
