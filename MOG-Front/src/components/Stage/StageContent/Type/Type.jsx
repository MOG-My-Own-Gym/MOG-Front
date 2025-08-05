import { useEffect, useState } from 'react';
import styles from './Type.module.css';
import { useSuggest } from '../../../../context/SuggestContext';

export default function Type({ categories }) {
  const { suggestState, saveSuggest } = useSuggest();
  const [typeCheck, setTypeCheck] = useState([]);
  const korMap = {
    strength: '근력 운동',
    stretching: '스트레칭',
    plyometrics: '플라이오메트릭스(순발력 운동)',
    strongman: '스트롱맨(강인함 경기)',
    powerlifting: '파워리프팅',
    cardio: '유산소 운동',
    'olympic weightlifting': '올림픽 역도',
  };
  useEffect(() => {
    saveSuggest({
      Level: [...suggestState.suggest.Level],
      Type: [...typeCheck],
      BodyPart: [...suggestState.suggest.BodyPart],
      Equipment: [...suggestState.suggest.Equipment],
    });
  }, [typeCheck]);
  useEffect(() => {
    if (suggestState.suggest.Type.length > 0) {
      setTypeCheck(suggestState.suggest.Type);
    }
  }, []);
  return (
    <div className={styles['form-wrapper']}>
      <form className={styles['check-form']}>
        {categories?.map(item => {
          return (
            <div
              className={`${styles['check-list']} ${styles[typeCheck.includes(item) ? 'checked' : '']}`}
              onClick={() => {
                if (!typeCheck.includes(item)) setTypeCheck(prev => [...prev, item]);
                else
                  setTypeCheck(prev =>
                    prev.filter(e => {
                      return e != item;
                    }),
                  );
              }}
            >
              <span
                className={`${styles['check-input']} ${styles[typeCheck.includes(item) ? 'checked' : '']}`}
                onClick={() => {
                  if (!typeCheck.includes(item)) setTypeCheck(prev => [...prev, item]);
                  else
                    setTypeCheck(prev =>
                      prev.filter(e => {
                        return e != item;
                      }),
                    );
                }}
              >
                {typeCheck.includes(item) && (
                  <i
                    className="fa-solid fa-check"
                    style={{ border: 'none', color: '#ffffffff', width: '1px' }}
                  ></i>
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
