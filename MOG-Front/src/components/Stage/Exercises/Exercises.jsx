import { useEffect, useState } from 'react';

export default function Exercises({ categories, getExerciseCategories }) {
  const makeListNode = [];
  const category = [];
  const equipment = [];
  const force = [];
  const level = [];
  const primaryMuscles = [];

  const [initmakeDetail, setMakeDetail] = useState([]);
  const [initcategory, setCategory] = useState([]);
  const [initequipment, setEquipment] = useState([]);
  const [initforce, setForce] = useState([]);
  const [initlevel, setLevel] = useState([]);
  const [initprimaryMuscles, setPrimaryMuscles] = useState([]);

  const [initDeduplicationDetail, setDeduplicationDetail] = useState([]);

  useEffect(() => {
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
  }, []);
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/kimbongkum/ict4e/master/exercises.json')
      .then(res => res.json())
      .then(exercise => {
        const arr = Object.values(exercise)[0];
        const makeDetailNode = [];
        const imgfile = [];
        //console.log(...arr)
        for (let i = 0; i < arr.length; i++) {
          const name1 = arr[i].name.replaceAll(' ', '_');
          const name2 = name1.replaceAll('/', '_');

          category.push(arr[i].category);
          equipment.push(arr[i].equipment ? arr[i].equipment : 'null');
          force.push(arr[i].force);
          level.push(arr[i].level);
          primaryMuscles.push(arr[i].primaryMuscles[0]);

          makeDetailNode.push({
            category: arr[i].category,
            equipment: arr[i].equipment,
            force: arr[i].force,
            level: arr[i].level,
          });
        }
        //const addListImg ={...makeDetailNode,imgfile:imgfile};
        makeListNode.push({
          category: [...new Set(category)],
          equipment: [...new Set(equipment)],
          force: [...new Set(force)],
          level: [...new Set(level)],
          primaryMuscles: [...new Set(primaryMuscles)],
        });
        setDeduplicationDetail(makeDetailNode);
        setMakeDetail(makeDetailNode);
        setCategory(Object.values(makeListNode[0].category));
        setEquipment(Object.values(makeListNode[0].equipment));
        setPrimaryMuscles(Object.values(makeListNode[0].primaryMuscles));
        setForce(Object.values(makeListNode[0].force));
        setLevel(Object.values(makeListNode[0].level));
      });
  }, []);
  useEffect(() => {
    switch (categories) {
      case 'Type':
        getExerciseCategories(initcategory);
        console.log(categories, initcategory);
        break;
      case 'Level':
        getExerciseCategories(initlevel);
        console.log(categories, initlevel);
        break;
      case 'BodyPart':
        getExerciseCategories(initprimaryMuscles);
        console.log(categories, initprimaryMuscles);
        break;
      case 'Equipment':
        let sortEquipment = initequipment;
        getExerciseCategories(sortEquipment);

        break;
      default:
        break;
    }
  }, [categories, initcategory, initequipment, initforce, initlevel, primaryMuscles]);
  const swap = (a, b, arr) => {
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
  };
  return <></>;
}
