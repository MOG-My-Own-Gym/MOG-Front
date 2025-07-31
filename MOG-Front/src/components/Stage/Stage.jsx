import { useContext, useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';

import styles from './Stage.module.css';
import Type from './StageContent/Type/Type';
import Exercises from './Exercises/Exercises';
import BodyPart from './StageContent/BodyPart/BodyPart';
import Level from './StageContent/Level/Level';
import Equipment from './StageContent/Equipment/Equipment';
import RadialGradientSpinner from '../Loader/RadialGradientSpinner';
import { useSuggest } from '../../context/SuggestContext';

export default function Stage() {
  const { suggestState } = useSuggest();
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
    BodyPart: '운동 부위',
    Equipment: '운동 장비',
    Level: '운동 경력',
  };
  const QuestionMap = {
    Type: '어떤 타입의 운동을 선호하세요?',
    BodyPart: '원하시는 운동 부위가 있나요?',
    Equipment: '운동 장비를 사용하고 싶으신가요?',
    Level: '운동을 해보신 경험이 있나요?',
  };

  const getExerciseCategories = categoryList => {
    setStageCategories(categoryList);
  };

  useEffect(() => {
    console.log(stageLevel, suggestState.suggest[Stage[stageLevel]]);
    console.log(stageLevel + suggestState.suggest[Stage[stageLevel]].length > 0 ? 1 : 0);
  }, [suggestState]);

  return (
    <div className={styles['stage']}>
      <div className={styles['stage-title']}>{StageMap[Stage[stageLevel]]}</div>
      {stageLevel === Stage.length && (
        <>
          <div className={styles['complete-loader']}>
            <div className={`${styles['animate-loader']} ${styles['play']}`}>
              <RadialGradientSpinner isText={true} />
            </div>
            <ProgressBar
              striped
              variant="yellow"
              style={{
                width: '60%',
                height: '20px',
                borderRadius: '20px',
                '--bs-progress-bar-bg': '#fdc800',
              }}
              animated
              now={(stageLevel / Stage.length) * 100}
            />
          </div>
        </>
      )}

      {stageLevel !== Stage.length && (
        <>
          <ProgressBar
            striped
            variant="yellow"
            style={{
              width: '60%',
              height: '20px',
              borderRadius: '20px',
              '--bs-progress-bar-bg': '#fdc800',
            }}
            animated
            now={
              ((stageLevel + (suggestState.suggest[Stage[stageLevel]].length > 0 ? 1 : 0)) /
                Stage.length) *
              100
            }
          />
          <div className={styles['stage-content-question']}>{QuestionMap[Stage[stageLevel]]}</div>
          <div className={styles['stage-content']}>
            {StageComponents[stageLevel]}
            <Exercises
              getExerciseCategories={getExerciseCategories}
              categories={Stage[stageLevel]}
            />
            <div className={styles['stage-button-container']}>
              <div
                className={`${styles['stage-button-prev']} ${stageLevel === 0 && styles['disabled']}`}
                onClick={() => {
                  stageLevel === 0 ? null : setStageLevel(prev => prev - 1);
                }}
              >
                이전
              </div>
              <div
                className={`${styles['stage-button-next']} ${suggestState.suggest[Stage[stageLevel]].length === 0 && styles['disabled']}`}
                onClick={() => {
                  suggestState.suggest[Stage[stageLevel]].length === 0
                    ? null
                    : setStageLevel(prev => prev + 1);
                }}
              >
                {Stage[stageLevel] === 'Equipment' ? '완료' : '다음'}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
