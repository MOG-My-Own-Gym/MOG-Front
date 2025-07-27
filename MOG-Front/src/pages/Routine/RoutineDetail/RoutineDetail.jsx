import { useNavigate, useSearchParams } from 'react-router-dom';
import { RoutineContext } from '../RoutineContext';
import styles from './RoutineDetail.module.css';
import React, { useContext, useEffect, useState } from 'react';
import Timer from '../../../components/Timer/Timer';
import axios from 'axios';
import { AuthContext } from '../../Login/AuthContext';
import ToastContext from '../../../context/ToastContext';
export default function RoutineDetail() {
  const [param] = useSearchParams();
  const navigate = useNavigate();
  const routineId = param.get('routineId');
  const detailId = param.get('detailId');
  const { user } = useContext(AuthContext);
  const { routine, originRoutine, dispatch } = useContext(RoutineContext);
  const { toast, dispatch: dispatchToast } = useContext(ToastContext);
  useEffect(() => {
    console.log(originRoutine, routine);
    console.log(originRoutine === routine);
  }, [routine]);

  //루틴 저장
  const saveRoutine = async () => {
    const editRoutine = await axios
      .put(`http://localhost:8080/api/v1/routine/${routineId}/update`, routine, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(res => {
        dispatch({ type: 'SAVE', routine: res.data, originRoutine: res.data });
        dispatchToast({ type: 'SHOW_TOAST', payload: '정상적으로 저장되었습니다' });
        navigate(
          `/routine/detail?routineId=${routineId}&detailId=${res.data.saveRoutineDto[0].srId}`,
        );
        return res.data;
      })
      .catch(err => {
        dispatchToast({
          type: 'SHOW_TOAST',
          payload: '저장 중 에러가 발생했습니다. 다시 시도해주세요',
        });
      });
  };

  //세트 추가
  const addSet = () => {
    const addSet = routine.saveRoutineDto.map(sr => {
      if (sr.srId === parseInt(detailId)) {
        return {
          ...sr,
          set: [...sr.set, { srsId: sr.set.length + 1, weight: 0, many: 0 }],
        };
      }
      return sr;
    });
    const newRoutine = { ...routine, saveRoutineDto: addSet };
    dispatch({ type: 'SAVE', routine: newRoutine, originRoutine: originRoutine });
  };
  //세트 삭제
  const subSet = () => {
    const subSet = routine.saveRoutineDto.map(sr => {
      if (sr.srId === parseInt(detailId)) {
        return {
          ...sr,
          set: sr.set.filter(srs => {
            return srs.srsId !== sr.set.length;
          }),
        };
      }
      return sr;
    });
    const newRoutine = { ...routine, saveRoutineDto: subSet };
    dispatch({ type: 'SAVE', routine: newRoutine, originRoutine: originRoutine });
  };
  //세트 무게 변경
  const changeWeight = (srsId, value) => {
    const changeWeight = routine.saveRoutineDto.map(sr => {
      if (sr.srId === parseInt(detailId)) {
        return {
          ...sr,
          set: sr.set.map(srs => {
            if (srs.srsId === srsId) {
              return { ...srs, weight: parseInt(value) || 0 };
            }
            return srs;
          }),
        };
      }
      return sr;
    });
    const newRoutine = { ...routine, saveRoutineDto: changeWeight };
    dispatch({ type: 'SAVE', routine: newRoutine, originRoutine: originRoutine });
  };
  //세트 반복횟수 변경
  const changeMany = (srsId, value) => {
    const changeMany = routine.saveRoutineDto.map(sr => {
      if (sr.srId === parseInt(detailId)) {
        return {
          ...sr,
          set: sr.set.map(srs => {
            if (srs.srsId === srsId) {
              return { ...srs, many: parseInt(value) || 0 };
            }
            return srs;
          }),
        };
      }
      return sr;
    });
    const newRoutine = { ...routine, saveRoutineDto: changeMany };
    dispatch({ type: 'SAVE', routine: newRoutine, originRoutine: originRoutine });
  };

  return (
    <div className={styles['routine-detail']}>
      <div className={styles['routine-detail-wrapper']}>
        {routine.saveRoutineDto
          .filter(sr => sr.srId === parseInt(detailId))
          .map(item => {
            {
              return (
                <div className={styles['routine-detail-container']}>
                  <section className={styles['routine-detail-section']}>
                    <h2>{item.srName}</h2>
                    <div className={styles['routine-detail-head']}>
                      <img
                        className={styles['exercise-img']}
                        src={`https://raw.githubusercontent.com/kimbongkum/ict4e/master/exercises/${item.srName.replaceAll(' ', '_').replaceAll('/', '_')}/images/0.jpg`}
                      />
                      <div className={styles['routine-detail-timer']}>
                        <Timer />
                      </div>
                    </div>
                  </section>
                  <section className={styles['routine-detail-section']}>
                    <div className={styles['routine-detail-body']}>
                      <div className={styles['routine-detail-body-title']}>
                        <h2>세트</h2>
                        <div className={styles['routine-detail-set-addsub']}>
                          {originRoutine !== routine && (
                            <div
                              className={styles['routine-detail-set-save']}
                              onClick={() => {
                                saveRoutine();
                              }}
                            >
                              저장
                            </div>
                          )}
                          <div
                            className={styles['routine-detail-set-add']}
                            onClick={() => {
                              addSet();
                            }}
                          >
                            추가
                          </div>
                          <div
                            className={styles['routine-detail-set-sub']}
                            onClick={() => {
                              subSet();
                            }}
                          >
                            삭제
                          </div>
                        </div>
                      </div>
                      <div className={styles['routine-detail-set']}>
                        <div>세트</div>
                        <div>무게</div>
                        <div>반복횟수</div>
                        <div>완료</div>
                        {item.set.map((set, idx) => (
                          <React.Fragment key={idx}>
                            <div>{set.srsId}</div>
                            <div>
                              <input
                                value={set.weight}
                                onChange={e => {
                                  changeWeight(set.srsId, e.target.value);
                                }}
                              />
                            </div>
                            <div>
                              <input
                                value={set.many}
                                onChange={e => {
                                  changeMany(set.srsId, e.target.value);
                                }}
                              />
                            </div>
                            <div>
                              <div className={styles['set-complete-button']}></div>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              );
            }
          })}
      </div>
      {/* 버튼 리스트 */}
      <div className={styles['detail-button-container']}>
        <button
          className={styles['detail-button']}
          disabled={
            routine.saveRoutineDto.findIndex(item => item.srId === parseInt(detailId)) === 0
          }
          onClick={e => {
            const currSrIndex = routine.saveRoutineDto.findIndex(
              item => item.srId === parseInt(detailId),
            );
            const prevSrId = routine.saveRoutineDto[currSrIndex - 1].srId;
            e.stopPropagation();
            navigate(`/routine/detail?routineId=${routineId}&detailId=${prevSrId}`);
          }}
        >
          이전
        </button>
        <button
          className={styles['detail-button']}
          disabled={
            routine.saveRoutineDto.findIndex(item => item.srId === parseInt(detailId)) ===
            routine.saveRoutineDto.length - 1
          }
          onClick={e => {
            const currSrIndex = routine.saveRoutineDto.findIndex(
              item => item.srId === parseInt(detailId),
            );
            const nextSrId = routine.saveRoutineDto[currSrIndex + 1].srId;
            e.stopPropagation();
            navigate(`/routine/detail?routineId=${routineId}&detailId=${nextSrId}`);
          }}
        >
          다음
        </button>
      </div>
    </div>
  );
}
