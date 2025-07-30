import { useEffect, useState } from 'react';
import styles from './BodyPart.module.css';

export default function BodyPart({ categories }) {
  const [typeCheck, setTypeCheck] = useState([]);
  const korMap = {
    abdominals: '복근',
    hamstrings: '햄스트링 (허벅지 뒤쪽 근육)',
    adductors: '내전근 (허벅지 안쪽 근육)',
    quadriceps: '대퇴사두근 (허벅지 앞쪽 근육)',
    biceps: '이두근 (팔 앞쪽 근육)',
    shoulders: '어깨 근육',
    chest: '가슴 근육 (대흉근 등)',
    'middle back': '등 중간 부위 근육',
    calves: '종아리 근육',
    glutes: '둔근 (엉덩이 근육)',
    'lower back': '허리 아래쪽 근육',
    lats: '광배근 (등 옆쪽 넓은 근육)',
    triceps: '삼두근 (팔 뒤쪽 근육)',
    traps: '승모근 (목과 어깨 사이 근육)',
    forearms: '팔뚝 근육',
    neck: '목 근육',
    abductors: '외전근 (허벅지 바깥쪽 근육)',
  };
  useEffect(() => {
    console.log(typeCheck);
  }, [typeCheck]);
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
              <label>{korMap[item]}</label>
            </div>
          );
        })}
      </form>
    </div>
  );
}
