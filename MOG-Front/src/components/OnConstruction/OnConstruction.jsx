import { useEffect, useState } from 'react';
import styles from './OnConstruction.module.css';
export default function OnConstruction() {
  const [shake, setShake] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShake(false), 800);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div style={{paddingTop:'100px'}}>
      <div className={styles['on-construction']}>
        <div className={styles['construction-position']}>
          <div className={styles['construction-border']}>
            <div className={styles['construction-wrapper']}>
              <div className={styles['construction-container']}>
                <i
                  className={`fa-solid fa-wrench fa-10x ${shake ? 'fa-shake' : ''}`}
                  style={{ color: 'black', position: 'absolute', left: '-100px', bottom: '-300px'}}
                ></i>
              </div>
            </div>
          </div>
        </div>

        <h3 style={{paddingTop:'300px'}}>
          현재 <span className={styles['construction-span']}>개발중</span>인 페이지입니다
        </h3>
      </div>
    </div>
  );
}
