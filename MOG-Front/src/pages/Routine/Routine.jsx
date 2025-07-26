import axios from 'axios';
import styles from './Routine.module.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Login/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function Routine() {
  const [routines, setRoutines] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRoutines = async () => {
      const data = await axios
        .get(`http://localhost:8080/api/v1/routine/list`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        })
        .then(res => {
          return res.data;
        });
      setRoutines(data);
      return data;
    };
    fetchRoutines();
  }, []);
  useEffect(() => {
    console.log(routines);
  }, []);
  return (
    <div className={styles['routine']}>
      <h2>루틴</h2>
      <div className={styles['routine-container']}>
        <div className={styles['routine-list']}>
          {routines.map(routine => {
            return (
              <div
                className={styles['routine-item']}
                onClick={() => {
                  navigate(`/select?routineId=${routine.setId}`);
                }}
              >
                {routine.routineName}
              </div>
            );
          })}
        </div>
        <div
          className={styles['routine-button']}
          onClick={() => {
            navigate(`/select`);
          }}
        >
          루틴 생성하기
        </div>
      </div>
    </div>
  );
}
