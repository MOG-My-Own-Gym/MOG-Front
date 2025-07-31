import { useState } from 'react';
import styles from './ExerciseImage.module.css';
import RadialGradientSpinner from '../../Loader/RadialGradientSpinner';

export default function ExerciseImage({ name, userExercise, type }) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
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
        src={`https://raw.githubusercontent.com/kimbongkum/ict4e/master/exercises/${name.replaceAll(' ', '_').replaceAll('/', '_')}/images/0.jpg`}
      />

      <div>{name}</div>
      {
        (type = 'SELECT' && (
          <div>
            {userExercise?.filter(val => val?.name === name)?.length !== 0
              ? userExercise?.filter(val => val.name === name).length
              : ''}
          </div>
        ))
      }
    </div>
  );
}
