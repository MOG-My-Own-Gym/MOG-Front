import { useContext, useEffect, useState } from 'react';
import './css/myroutine.css';
import { useModalAlert } from '../../context/ModalAlertContext';
import { AuthContext } from '../Login/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { URL } from '../../config/constants';

export default function MyRoutine() {
  //하트버튼 누르는 토글여부에 따라 꽉 찬 하트와 빈 하트를 보여주는 컴포넌트
  const HeartItem = () => {
    const [isLiked, setIsLiked] = useState(false);

    const toggleHeart = e => {
      e.preventDefault();
      setIsLiked(!isLiked);
    };

    return (
      <>
        <div>
          <button className="btn-routine" onClick={toggleHeart}>
            {isLiked ? (
              <img
                className="img-fluid img-routine"
                src="/img/like.png"
                alt="Filled Heart"
                style={{ height: '1.4em' }}
              />
            ) : (
              <img
                className="img-fluid img-routine"
                src="/img/empty-like.png"
                alt="Empty Heart"
                style={{ height: '1.4em' }}
              />
            )}
          </button>
        </div>
      </>
    );
  };

  const { showModal } = useModalAlert();
  const { user } = useContext(AuthContext);
  const [routineData, setRoutineData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutine = async () => {
      await axios
        .get(URL.ROUNTINE)
        .then(res => {
          setRoutineData(() => {
            const data = res.data.filter(data => String(data.userId) === String(user.usersId));
            return data;
          });
        })
        .catch(err => {
          //console.log(err);
          showModal('루틴 조회에 실패하였습니다');
        });
      /*
        .get('http:localhost:8080/api/v1/routine/list',
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        )
        .then(res=>{
          setRoutineData(res.data);
          const set = res.data[0];
          //console.log(set);
          const setDetail =set.saveRoutineDto;
          //console.log(setDetail[0]);
        })
        .catch(err=>{
          //console.log(err);
          showModal('루틴 조회에 실패하였습니다');
        })
      */
    };

    fetchRoutine();
  }, [user.usersId]);

  return (
    <>
      <div className="container">
        <div className="row d-flex justify-content-center mt-5 ">
          <div className="col-md-12 fs-4">
            <div className="card card-routine w-100 p-5 h-100">
              <div className="d-flex justify-content-between align-items-center">
                <span className="font-weight-bold">My Routine</span>

                <div className="d-flex flex-row">
                  <button
                    className="btn new"
                    style={{ backgroundColor: '#ffc800' }}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/data/select');
                    }}
                  >
                    <i className="fa fa-plus"></i> New
                  </button>
                </div>
              </div>

              <div className="mt-3 inputs-routine">
                <i className="fa fa-search"></i>
                <input
                  type="text"
                  className="form-control-routine w-100"
                  placeholder="Search Routines..."
                />
              </div>

              {routineData.length > 0 ? (
                routineData.map((routine, i) => {
                  return (
                    <div className="my-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <button
                          className="btn-routineName"
                          onClick={e => {
                            e.preventDefault();
                            navigate(`/data/routine?routineId=${routine.id}`);
                          }}
                        >
                          <div className="d-flex flex-row align-items-center routine-list">
                            <span className="star">
                              <i className="fa fa-star yellow"></i>
                            </span>

                            <div className="d-flex flex-column">
                              <span>{routine.name}</span>
                            </div>
                          </div>
                        </button>
                        <HeartItem />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>루틴이 없습니다</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
