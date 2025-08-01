import { useEffect, useState } from 'react';
import styles from './Equipment.module.css';
import { useSuggest } from '../../../../context/SuggestContext';

export default function Equipment({ categories }) {
  const { suggestState, saveSuggest } = useSuggest();
  const [typeCheck, setTypeCheck] = useState([]);
  const korMap = {
    'body only': '맨몸 운동',
    machine: '머신 웨이트',
    other: '기타',
    'foam roll': '폼롤러',
    kettlebells: '케틀벨',
    dumbbell: '덤벨',
    cable: '케이블 머신',
    barbell: '바벨',
    'medicine ball': '메디신 볼',
    bands: '저항 밴드',
    'exercise ball': '짐 볼',
    'e-z curl bar': '이지컬 바',
    null: '잘 모르겠어요',
  };
  useEffect(() => {
    saveSuggest({
      Level: [...suggestState.suggest.Level],
      Type: [...suggestState.suggest.Type],
      BodyPart: [...suggestState.suggest.BodyPart],
      Equipment: [...typeCheck],
    });
  }, [typeCheck]);
  useEffect(() => {
    if (suggestState.suggest.Equipment.length > 0) {
      setTypeCheck(suggestState.suggest.Equipment);
    }
  }, []);
  return (
    <div>
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
                    style={{ border: 'none', color: '#ffffffff' }}
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
