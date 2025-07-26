import { useContext, useEffect, useState } from 'react';
import RadialGradientSpinner from '../../../components/Loader/RadialGradientSpinner';
import axios from 'axios';
import styles from './SelectExercises.module.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Login/AuthContext';

export default function SelectExercises() {
  const [originExerciseData, setOriginExerciseData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);
  const [search, setSearch] = useState('');
  const [userExercise, setUserExercise] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/kimbongkum/ict4e/master/exercises.json')
      .then(res => res.json())
      .then(exercise => {
        exercise.exercises = exercise.exercises.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setOriginExerciseData(exercise.exercises);
        setExerciseData(exercise.exercises);
      });
  }, []);
  useEffect(() => {
    console.log(search, exerciseData);
    setExerciseData(originExerciseData.filter(ex => ex.name.includes(search)));
  }, [search]);

  useEffect(() => {
    console.log(userExercise);
  }, []);
  const handleSearchBar = e => {
    setSearch(e.target.value);
  };
  const createRoutine = async () => {
    await axios
      .post(
        'http://localhost:8080/api/v1/routine/create',
        {
          routineName: `루틴`,
          saveRoutineDto: userExercise.map(ex => {
            return {
              exId: ex.id,
              srName: ex.name,
              reps: 1,
              set: [
                {
                  weight: 0,
                  many: 0,
                },
              ],
            };
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      )
      .then(res => {
        navigate(`/detail?routineId=${res.data.setId}`);
      });
  };
  return (
    <div className={styles['exercise']}>
      <h2>운동 선택</h2>
      <input
        className={styles['searchbar']}
        type="text"
        placeholder="원하는 운동을 검색하세요"
        onChange={handleSearchBar}
      />
      <div className={styles['exercise-list']}>
        {exerciseData?.map(exercise => {
          return (
            <div
              className={styles['exercise-container']}
              onClick={() => setUserExercise(prev => [...prev, exercise])}
            >
              <div className={styles['exercise-item']}>
                {imageLoading && (
                  <div className={styles['image-loader']}>
                    <RadialGradientSpinner />
                  </div>
                )}
                <img
                  className={styles['exercise-img']}
                  onLoad={() => {
                    setImageLoading(false);
                  }}
                  style={{
                    display: imageLoading ? 'none' : 'block',
                    opacity: imageLoading ? 0 : 1,
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                  src={`https://raw.githubusercontent.com/kimbongkum/ict4e/master/exercises/${exercise.name.replaceAll(' ', '_').replaceAll('/', '_')}/images/0.jpg`}
                />

                <div>{exercise.name}</div>
                <div>
                  {userExercise?.filter(val => val.name === exercise.name)?.length !== 0
                    ? userExercise?.filter(val => val.name === exercise.name).length
                    : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {userExercise.length > 0 && (
        <div className={styles['exercise-button-container']}>
          <div
            className={styles['exercise-button']}
            onClick={e => {
              console.log(userExercise);
              e.stopPropagation();
              createRoutine();
            }}
          >
            운동 추가
          </div>
          <div
            className={styles['exercise-button']}
            onClick={e => {
              console.log(userExercise);
              e.stopPropagation();
              setUserExercise(prev => prev.slice(0, -1));
            }}
          >
            되돌리기
          </div>
        </div>
      )}
    </div>
  );
}
