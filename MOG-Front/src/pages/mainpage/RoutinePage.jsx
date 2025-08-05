import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../assets/bootstrap/css/mainpage.module.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { URL } from '../../config/constants';
import { Button, Card, ListGroup, Modal } from 'react-bootstrap';

export default function RoutinePage({
  useDataRoutine,
  fetchData,
  detailData,
  startRrcodResultData,
  setIsOpen,
  setMakeRoutine,
  initMakeRoutine,
  setCheckPageWhenRunningPage,
  setRoutineId,
  currentRrcodingRoutineId,
}) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = search.slice(-1);
  const [initDetailDEx, setDetailEx] = useState();
  const [settingModel, setSettingModel] = useState(false);
  const [isShowDelete, setIsShowDelete] = useState(true);
  const [getSelectRoutine, setGetSelectRoutine] = useState();
  const [infoModel, setInfoModel] = useState(false);
  const routineDetailButton = e => {
    e.stopPropagation();
    const checkId = e.target.children[1] === undefined ? e.target.id : e.target.children[1].id;
    setCheckPageWhenRunningPage(true);
    navigate(`/data/runningroutine?routineId=${params}&DetailId=${checkId}`, {
      state: initMakeRoutine,
    });
  };
  const startRoutine = () => {
    if (!startRrcodResultData) {
      setCheckPageWhenRunningPage(false);
      setIsOpen(true);
    }
  };
  const loadRoutineDetail = async () => {
    await axios.get(URL.ROUNTINE).then(res => setMakeRoutine(res.data[params - 1].state));
    await axios.get(URL.ROUTINEDETAIL).then(res => setDetailEx(res.data[params - 1].state));
  };

  const routineSetting = async (e) => {
    e.stopPropagation();
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (e.target.id === 'delete') {
      const deleteSaveData = initMakeRoutine.filter(item => item.set_id !== getSelectRoutine);
      const deleteDetailData = initDetailDEx.filter(item => item.id !== getSelectRoutine);
      await axios.put(`${URL.ROUNTINE}/${params}/`, {
        id: String(useDataRoutine[params - 1].id),
        name: useDataRoutine[params - 1].name,
        userId: String(userInfo.usersId),
        state: [...deleteSaveData],
      });
      await axios.put(`${URL.ROUTINEDETAIL}/${params}`, {
        id: String(useDataRoutine[params - 1].id),
        state: [...deleteDetailData],
      });
      setMakeRoutine(deleteSaveData);
      setDetailEx(deleteDetailData);
    } else {
      setSettingModel(true);
      setGetSelectRoutine(e.target.id);
    }
  };
  const switchExButton = async () => {
    setSettingModel(false);
  };

  useEffect(() => {
    loadRoutineDetail();
    setRoutineId(params);
    fetchData();
    detailData();
  }, []);
  return (
    <>
      <div className={styles.mainContainer}>
        <Button className={styles.backButton} type="button" onClick={() => navigate('/data/')}>
          뒤로가기
        </Button>
        <ul className={styles.secondContainer}>
          {initMakeRoutine.map((item, index) => (
            <li
              key={index}
              className={styles.prettyli}
              id={item.names}
              style={{ display: 'flex' }}
              type="button"
              onClick={e => routineDetailButton(e)}
            >
              <img
                className="me-2"
                alt={item.imgfile}
                style={{ width: '100px' }}
                src={item.imgfile}
              />
              {item.names}
              {!startRrcodResultData || currentRrcodingRoutineId === params ? (
                <a
                  style={{ marginLeft: 'auto', fontSize: '20px' }}
                  href="#"
                  id={item.set_id}
                  onClick={e => routineSetting(e)}
                >
                  ...
                </a>
              ) : (
                <a id={item.set_id}></a>
              )}
            </li>
          ))}
        </ul>
        {startRrcodResultData === false || currentRrcodingRoutineId === params ? (
          <footer className={styles.flexButton}>
            <Button
              className={`${styles.prettyButton} me-5`}
              style={{
                color: 'black',
                backgroundColor: `${startRrcodResultData ? '#1eff00ff' : '#FFD600'}`,
              }}
              type="button"
              id="1"
              onClick={e => (startRrcodResultData ? setIsOpen(true) : startRoutine())}
            >
              {startRrcodResultData ? '완료' : '시작'}
            </Button>
            <Button
              className={styles.prettyButton}
              type="button"
              onClick={() => navigate('/data/select', { state: params })}
            >
              추가
            </Button>
          </footer>
        ) : (
          <footer></footer>
        )}
      </div>
      <Modal className={styles.ModelContainer} show={settingModel} onHide={() =>{setSettingModel(false);setIsShowDelete(true)}}>
        <Modal.Header>설정</Modal.Header>
        <Modal.Body>
            <ListGroup>
              <ListGroup.Item action onClick={() => {setInfoModel(true);setIsShowDelete(true)}}>
                운동 정보
              </ListGroup.Item>
              <ListGroup.Item action onClick={() => {switchExButton();setIsShowDelete(true)}}>
                순서 변경
              </ListGroup.Item>
              <ListGroup.Item action onClick={() => setIsShowDelete(false)}>
                삭제
              </ListGroup.Item>
              <ListGroup.Item hidden={isShowDelete}>
                <p>정말 삭제 하시겠습니까?</p>
                <Button
                  id="delete"
                  onClick={e => {
                    routineSetting(e);
                    setSettingModel(false);
                  }}
                >
                  확인
                </Button>
                <Button onClick={() => setIsShowDelete(true)}>취소</Button>
              </ListGroup.Item>
            </ListGroup>
        </Modal.Body>
      </Modal>
      <Modal className={styles.ModelContainer} show={infoModel} onHide={() => setInfoModel(false)}>
        <Modal.Header>운동 정보</Modal.Header>
        <Modal.Body>{JSON.stringify(initMakeRoutine[getSelectRoutine])}</Modal.Body>
      </Modal>
    </>
  );
}
