import { useState } from 'react';
import { ProgressBar } from 'react-bootstrap';

import styles from './Stage.module.css';
import Type from './StageContent/Type/Type';
import Exercises from './Exercises/Exercises';
import BodyPart from './StageContent/BodyPart/BodyPart';
import Level from './StageContent/Level/Level';
import Equipment from './StageContent/Equipment/Equipment';

export default function Stage() {
  const [stageLevel, setStageLevel] = useState(0);
  const [stageCategories, setStageCategories] = useState([]);

  const Stage = ['Level', 'Type', 'BodyPart', 'Equipment'];
  const StageComponents = [
    <Level categories={stageCategories} />,
    <Type categories={stageCategories} />,
    <BodyPart categories={stageCategories} />,
    <Equipment categories={stageCategories} />,
  ];
  const StageMap = {
    Type: '운동 타입',
    BodyType: '운동 부위',
    Equipment: '운동 장비',
    Level: '운동 경력',
  };
  const QuestionMap = {
    Type: '어떤 타입의 운동을 선호하세요?',
    BodyType: '운동 부위',
    Equipment: '운동 장비',
    Level: '운동을 해보신 경험이 있나요?',
  };

  const getExerciseCategories = categoryList => {
    setStageCategories(categoryList);
  };

  return (
    <div className={styles['stage']}>
      <div className={styles['stage-title']}>{StageMap[Stage[stageLevel]]}</div>
      <ProgressBar style={{ width: '60%', height: '20px', borderRadius: '20px' }} />
      <div className={styles['stage-content-question']}>{QuestionMap[Stage[stageLevel]]}</div>
      <div className={styles['stage-content']}>
        {StageComponents[stageLevel]}
        <Exercises getExerciseCategories={getExerciseCategories} categories={Stage[stageLevel]} />
        <div className={styles['stage-button-container']}>
          <div
            className={styles['stage-button-prev']}
            onClick={() => {
              setStageLevel(prev => prev - 1);
            }}
          >
            이전
          </div>
          <div
            className={styles['stage-button-next']}
            onClick={() => {
              setStageLevel(prev => prev + 1);
            }}
          >
            다음
          </div>
        </div>
      </div>
    </div>
  );
}
