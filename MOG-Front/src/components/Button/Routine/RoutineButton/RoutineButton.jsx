import { useNavigate } from 'react-router-dom';
import styles from './RoutineButton.module.css';
import { useContext } from 'react';
import { RoutineContext } from '../../../../pages/Routine/RoutineContext';
export default function RoutineButton({
  type,
  routineId,
  detailId,
  createRoutine,
  setUserExercise,
  onPrev,
  onNext,
}) {
  const { routine } = useContext(RoutineContext);
  const navigate = useNavigate();

  return (
    <div className={styles['exercise-button-wrapper']}>
      <div className={styles['exercise-button-container']}>
        <button
          className={styles['exercise-button']}
          disabled={
            routine.saveRoutineDto.findIndex(item => item.srId === parseInt(detailId)) === 0
          }
          onClick={e => {
            e.stopPropagation();
            type === 'SELECT' ? createRoutine() : type === 'DETAIL' ? onPrev(e) : null;
          }}
        >
          {type === 'SELECT'
            ? routineId
              ? '운동 수정'
              : '운동 추가'
            : type === 'DETAIL'
              ? '이전'
              : '운동 시작'}
        </button>
        <button
          className={styles['exercise-button']}
          disabled={
            routine.saveRoutineDto.findIndex(item => item.srId === parseInt(detailId)) ===
            routine.saveRoutineDto.length - 1
          }
          onClick={e => {
            e.stopPropagation();
            type === 'SELECT'
              ? setUserExercise(prev => prev.slice(0, -1))
              : type === 'DETAIL'
                ? onNext(e)
                : navigate(`/routine/select?routineId=${routineId}`);
          }}
        >
          {type === 'SELECT' ? '되돌리기' : type === 'DETAIL' ? '다음' : '운동 추가'}
        </button>
      </div>
    </div>
  );
}
