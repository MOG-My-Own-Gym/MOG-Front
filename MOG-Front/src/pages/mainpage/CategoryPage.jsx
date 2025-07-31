import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../assets/bootstrap/css/mainpage.module.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { URL } from '../../config/constants';
import { Button } from 'react-bootstrap';

export default function CategoryPage({
  useDataRoutine,
  fetchData,
  detailData,
  useDetailExData,
  checkRoutineUser,
}) {
  const makeListNode = [];
  const id = [];
  const nameR = [];
  const category = [];
  const equipment = [];
  const force = [];
  const level = [];
  const mechanic = [];
  const primaryMuscles = [];
  const secondaryMuscles = [];
  let countSaveRoutineInt;
  let makeDetailList;
  let saveR;
  let addSetId;

  const [initcategory, setCategory] = useState([]);
  const [initequipment, setEquipment] = useState([]);
  const [initforce, setForce] = useState([]);
  const [initlevel, setLevel] = useState([]);
  const [initmechanic, setMechanic] = useState([]);
  const [initprimaryMuscles, setPrimaryMuscles] = useState([]);
  const [initsecondaryMuscles, setSecondaryMuscles] = useState([]);
  const [initmakeDetail, setMakeDetail] = useState([]);
  const [initDeduplicationDetail, setDeduplicationDetail] = useState([]);
  const [initSearch, setSearch] = useState('');
  const [initSaveExercise, setSaveExercise] = useState([]);
  const [initSaveExerciseSpan, setSaveExerciseSpan] = useState([]);
  const [isHidden, setIsHidden] = useState(true);
  const [showMaxCategory, setShowMaxCategory] = useState(5);

  const { state } = useLocation();
  const navigate = useNavigate();
  const makeRoutineContainer = useRef(null);

  function makedetil(e, nameStr) {
    e.preventDefault();
    makeRoutineContainer.innerHTML = '';
    makeDetailList = e.currentTarget.textContent;
    const filterMakeListNode = initmakeDetail.filter(res => {
      if (nameStr == 'names') return res.names.includes(makeDetailList);
      if (nameStr == 'category') return res.category.includes(makeDetailList);
      if (nameStr == 'equipment' && res.equipment != null)
        return res.equipment.includes(makeDetailList);
      if (nameStr == 'force' && res.force != null) return res.force.includes(makeDetailList);
      if (nameStr == 'level') return res.level.includes(makeDetailList);
      if (nameStr == 'mechanic' && res.mechanic != null)
        return res.mechanic.includes(makeDetailList);
      if (nameStr == 'instructions' && res.instructions != null)
        return res.instructions.includes(makeDetailList);
      if (nameStr == 'primaryMuscles' && res.primaryMuscles != null)
        return res.primaryMuscles.includes(makeDetailList);
      if (nameStr == 'secondaryMuscles' && res.secondaryMuscles != null)
        return res.secondaryMuscles.includes(makeDetailList);
    });
    setDeduplicationDetail(filterMakeListNode);
  }

  const makeRoutineButton = async () => {
    //e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('user'));
    console.log(userInfo);
    if (state === null) {
      alert('루틴 생성 실패');
      return;
    }
    const makeDetailNode = [];
    if (state === true) {
      addSetId = initSaveExercise.map((item, index) => ({ ...item, set_id: String(index + 1) }));
      const routineName =
        'routine' + String(checkRoutineUser.length <= 0 ? 1 : checkRoutineUser.length + 1);
      await axios.post(URL.ROUNTINE, {
        id: String(
          useDataRoutine.length <= 0
            ? 1
            : parseInt(useDataRoutine[useDataRoutine.length - 1].id) + 1,
        ),
        name: routineName,
        userId: String(userInfo.usersId),
        state: [...addSetId],
      });
      for (let i = 0; i <= addSetId.length - 1; i++) {
        makeDetailNode.push({
          id: addSetId[i].set_id,
          names: addSetId[i].names,
          img: addSetId[i].imgfile,
          lest: '30',
          set: [
            {
              id: '1',
              weight: '10',
              many: '1',
            },
          ],
        });
      }
      await axios.post(URL.ROUTINEDETAIL, {
        id: String(
          useDataRoutine.length <= 0
            ? 1
            : parseInt(useDataRoutine[useDataRoutine.length - 1].id) + 1,
        ),
        state: [...makeDetailNode],
      });
      await axios.post(
        `${URL.REALDATA}/create`,
        {
          routineName: String(
            useDataRoutine.length <= 0
              ? 1
              : parseInt(useDataRoutine[useDataRoutine.length - 1].id) + 1,
          ),
          saveRoutineDto: [],
        },
        {
          headers: { Authorization: `Bearer ${userInfo.accessToken}` },
        },
      );
      navigate(`/data/routine?routineId=${useDataRoutine.length + 1}`);
    } else {
      const makeRoutineId =
        useDataRoutine[state - 1].state.length === 0
          ? 0
          : Math.max(...useDataRoutine[state - 1].state.map(item => parseInt(item.set_id)));
      addSetId = initSaveExercise.map((item, index) => ({
        ...item,
        set_id: String(makeRoutineId + index + 1),
      }));
      await axios.put(`${URL.ROUNTINE}/${state}`, {
        id: String(useDataRoutine[state - 1].id),
        name: useDataRoutine[state - 1].name,
        userId: String(userInfo.usersId),
        state: [...useDataRoutine[state - 1].state, ...addSetId],
      });
      for (let i = 0; i <= addSetId.length - 1; i++) {
        makeDetailNode.push({
          id: addSetId[i].set_id,
          names: addSetId[i].names,
          img: addSetId[i].imgfile,
          lest: '30',
          set: [
            {
              id: '1',
              weight: '10',
              many: '1',
            },
          ],
        });
      }
      await axios.put(`${URL.ROUTINEDETAIL}/${state}`, {
        id: String(useDataRoutine[state - 1].id),
        state: [...useDetailExData[state - 1].state, ...makeDetailNode],
      });
      navigate(`/data/routine?routineId=${state}`);
    }
  };

  const saveRoutineButton = e => {
    e.preventDefault();
    saveR = initmakeDetail.filter(item => item.names.includes(e.currentTarget.id));
    setSaveExercise(prev => [...prev, ...saveR]);
    countSaveRoutineInt =
      initSaveExercise.filter(item => item.names === e.currentTarget.id).length + 1;
    e.target.children[1].textContent = countSaveRoutineInt;
    setSaveExerciseSpan(prev => {
      const inputExSpan = [...prev, e.target.children[1].id];
      setIsHidden(inputExSpan.length === 0 ? true : false);
      return inputExSpan;
    });
  };
  const deleteRoutineButten = e => {
    e.preventDefault();
    const deleteSaveData = initSaveExercise.slice(0, -1);
    setSaveExercise(deleteSaveData);
    setSaveExerciseSpan(res => {
      const delExDate = res.slice(0, -1) !== null ? res.slice(0, -1) : [];
      const spanNode = document.getElementById(res[res.length - 1]);
      setIsHidden(delExDate.length === 0 ? true : false);
      const compreToDeleteEx = spanNode.id.slice(0, -4);
      countSaveRoutineInt =
        initSaveExercise.filter(item => item.names === compreToDeleteEx).length - 1;
      spanNode.textContent = countSaveRoutineInt === 0 ? '' : countSaveRoutineInt;
      return delExDate;
    });
  };

  useEffect(() => {
    const filteredItems = initmakeDetail.filter(item =>
      item.names.toLowerCase().includes(initSearch.toLowerCase()),
    );
    setDeduplicationDetail(filteredItems);
  }, [initSearch]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/kimbongkum/ict4e/master/exercises.json')
      .then(res => res.json())
      .then(exercise => {
        const arr = Object.values(exercise)[0];
        const makeDetailNode = [];
        for (let i = 0; i < arr.length; i++) {
          const name1 = arr[i].name.replaceAll(' ', '_');
          const name2 = name1.replaceAll('/', '_');

          id.push(arr[i].id);
          nameR.push(arr[i].name);
          category.push(arr[i].category);
          equipment.push(arr[i].equipment);
          force.push(arr[i].force);
          level.push(arr[i].level);
          mechanic.push(arr[i].mechanic);
          primaryMuscles.push(arr[i].primaryMuscles[0]);
          secondaryMuscles.push(arr[i].secondaryMuscles[0]);

          makeDetailNode.push({
            id: String(i + 1),
            names: arr[i].name,
            category: arr[i].category,
            equipment: arr[i].equipment,
            force: arr[i].force,
            level: arr[i].level,
            mechanic: arr[i].mechanic,
            instructions: arr[i].instructions,
            primaryMuscles: arr[i].primaryMuscles[0],
            secondaryMuscles: arr[i].secondaryMuscles[0],
            imgfile: `https://raw.githubusercontent.com/kimbongkum/ict4e/master/exercises/${name2}/images/0.jpg`,
          });
        }
        makeListNode.push({
          names: nameR,
          category: [...new Set(category)],
          equipment: [...new Set(equipment)],
          force: [...new Set(force)],
          level: [...new Set(level)],
          mechanic: [...new Set(mechanic)],
          //instructions: instructions,
          primaryMuscles: [...new Set(primaryMuscles)],
          secondaryMuscles: [...new Set(primaryMuscles)],
        });
        setDeduplicationDetail(makeDetailNode);
        setMakeDetail(makeDetailNode);
        setCategory(Object.values(makeListNode[0].category));
        setEquipment(Object.values(makeListNode[0].equipment));
        setForce(Object.values(makeListNode[0].force));
        setLevel(Object.values(makeListNode[0].level));
        setMechanic(Object.values(makeListNode[0].mechanic));
        setPrimaryMuscles(Object.values(makeListNode[0].primaryMuscles));
        setSecondaryMuscles(Object.values(makeListNode[0].secondaryMuscles));
      });
    fetchData();
    detailData();

    const handleScroll = () => {
      const scrollTop = window.scrollY; // 현재 스크롤 위치
      const windowHeight = window.innerHeight; // 창의 높이
      const documentHeight = document.documentElement.scrollHeight; // 문서 전체 높이

      // 바닥 도달 여부 확인
      if (scrollTop + windowHeight >= documentHeight - 10) {
        // 여기에 추가 로직 (데이터 더 불러오기 등)
        setShowMaxCategory(prev => prev + 5);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // 컴포넌트 언마운트 시 제거
  }, []);

  return (
    <>
      <div className={styles.mainContainer}>
        <Button
          className={`m-2 btn btn-lg btn-danger`}
          type="button"
          onClick={() => navigate('/data/')}
        >
          뒤로가기
        </Button>
        <form className={'d-flex'}>
          <input
            className={styles.inputForm}
            type="search"
            placeholder="운동 이름을 입력하세요."
            onChange={e => setSearch(e.target.value)}
          />
        </form>
        <div style={{ overflowX: 'scroll', whiteSpace: 'nowrap' }} className={'container'}>
          <div className="container m-2">
            운동 종류
            {initcategory.map((item, index) => (
              <span key={index}>
                <a
                  style={{ textDecoration: 'none', marginLeft: '20px', color: 'blue' }}
                  href="#"
                  onClick={e => {
                    makedetil(e, 'category');
                  }}
                >
                  {item}
                </a>
              </span>
            ))}
          </div>
          <div className="container m-2">
            사용 기구
            {initequipment.map((item, index) => (
              <span key={index}>
                <a
                  style={{ textDecoration: 'none', marginLeft: '20px', color: 'green' }}
                  href="#"
                  onClick={e => {
                    makedetil(e, 'equipment');
                  }}
                >
                  {item}
                </a>
              </span>
            ))}
          </div>
          <div className="container m-2">
            난이도
            {initlevel.map((item, index) => (
              <span key={index}>
                <a
                  style={{ textDecoration: 'none', marginLeft: '20px' }}
                  href="#"
                  onClick={e => {
                    makedetil(e, 'level');
                  }}
                >
                  {item}
                </a>
              </span>
            ))}
          </div>
          <div className="container m-2">
            고립, 복합
            {initmechanic.map((item, index) => (
              <span key={index}>
                <a
                  style={{ textDecoration: 'none', marginLeft: '20px', color: 'red' }}
                  href="#"
                  onClick={e => {
                    makedetil(e, 'mechanic');
                  }}
                >
                  {item}
                </a>
              </span>
            ))}
          </div>
        </div>
        <ul ref={makeRoutineContainer} className={styles.secondContainer}>
          {initDeduplicationDetail.length === 0 ? (
            <h1>값이 없습니다.</h1>
          ) : (
            initDeduplicationDetail.slice(0, showMaxCategory).map(item => (
              <li
                className={styles.prettyli}
                id={item.names}
                key={item.id}
                type="button"
                style={{ display: 'flex' }}
                onClick={e => saveRoutineButton(e)}
              >
                <img alt={item.imgfile} style={{ width: '100px' }} src={item.imgfile} />
                {item.names}
                <span
                  id={item.names + 'Span'}
                  style={{ marginLeft: 'auto', color: '#FFD600' }}
                ></span>
              </li>
            ))
          )}
        </ul>
        <div className={`${styles.dummyContainers} p-5 mt-4`}></div>
        <footer className={styles.flexButton}>
          <Button
            className={`${styles.prettyButton} me-5`}
            type="button"
            onClick={makeRoutineButton}
            hidden={isHidden}
          >
            운동 추가
          </Button>
          <Button
            className={styles.prettyButton}
            type="button"
            onClick={e => deleteRoutineButten(e)}
            hidden={isHidden}
          >
            되돌리기
          </Button>
        </footer>
      </div>
    </>
  );
}
