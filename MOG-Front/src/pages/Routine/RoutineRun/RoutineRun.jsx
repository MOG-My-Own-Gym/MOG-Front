import React, { useContext, useEffect, useState } from 'react';
import styles from './RoutineRun.module.css';

import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../Login/AuthContext';
import ExerciseImage from '../../../components/Image/Routine/ExerciseImage';
import RoutineButton from '../../../components/Button/Routine/RoutineButton/RoutineButton';
import PageBackButton from '../../../components/Button/Routine/PageBackButton/PageBackButton';

export default function RoutineRun() {
  const navigate = useNavigate();
  const [param] = useSearchParams();
  const routineId = param.get('routineId');
  const { user } = useContext(AuthContext);

  console.log(routineId);

  const [routineData, setRoutineData] = useState(null);
  useEffect(() => {
    const fetchRoutine = async () => {
      const data = await axios
        .get(`http://localhost:8080/api/v1/routine/${routineId}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        })
        .then(res => {
          console.log(res.data);
          setRoutineData(res.data);
        });
    };
    fetchRoutine();
  }, []);

  useEffect(() => {
    console.log(routineData);
    console.log(routineData?.saveRoutineDto);
    console.log(routineData?.length);
  }, [routineData]);

  return (
    <div className={styles['routine-run']}>
      <div className={styles['routine-run-back']}>
        <PageBackButton />
      </div>
      <h2 className={styles['routine-run-title']}>루틴 실행</h2>

      <div className={styles['routine-run-container']}>
        {routineData ? (
          routineData.saveRoutineDto.length > 0 ? (
            <div className={styles['routine-detail-list']}>
              {routineData.saveRoutineDto.map(sr => {
                return (
                  <div
                    className={styles['routine-detail-item']}
                    onClick={() => {
                      navigate(`/routine/detail?routineId=${routineId}&detailId=${sr.srId}`);
                    }}
                  >
                    <ExerciseImage name={sr.srName} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div>운동 정보가 없습니다 운동을 추가해주세요!</div>
          )
        ) : (
          <div>정보 호출에 실패했습니다</div>
        )}
      </div>
      <RoutineButton type={'RUN'} routineId={parseInt(routineId)} />
    </div>
  );
}
