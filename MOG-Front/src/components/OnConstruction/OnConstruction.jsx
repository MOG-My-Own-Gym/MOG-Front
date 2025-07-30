import { useEffect, useState } from 'react';
import styles from './OnConstruction.module.css';
export default function OnConstruction() {
  const [shake, setShake] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShake(false), 800);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className='container min-vh-100'>
      <div style={{paddingTop:'100px'}}>
        <div className={`${styles['on-construction']} w-100`}>
          <div className={styles['construction-position']}>
            <div className={styles['construction-border']}>
              <div className={`${styles['construction-wrapper']} `}>
                <div className={styles['construction-container']}>
                  <i
                    className={`fa-solid fa-wrench fa-10x ${shake ? 'fa-shake' : ''} col-12 ${styles['wrench-icon']}`}
                    style={{ color: 'black', position: 'absolute', left: '-100px', bottom: '-300px'}}
                  ></i>
                </div>
              </div>
            </div>
          </div>

          <h3>
            현재 <span className={styles['construction-span']}>개발중</span>인 페이지입니다
          </h3>
        </div>
      </div>
    </div>
  );
}
