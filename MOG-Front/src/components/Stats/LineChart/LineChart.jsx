import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Chart, Line } from 'react-chartjs-2';

export default function LineChart({ lineData, lineState }) {
  if (!lineData) return null;
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    Filler,
  );
  const [selectDataSet, setSelectDataSet] = useState(null);
  const rowData = lineData.map(data => {
    return data.date.substring(0, 10);
  });
  const chartRow = rowData?.filter((data, index) => {
    return rowData.indexOf(data) === index;
  });
  let chartData = chartRow?.reduce((acc, date) => {
    acc[date] = [];
    return acc;
  }, {});
  console.log(lineState);
  let lineDataSets;
  let maxLength;

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  switch (lineState) {
    case 'muscle':
      chartRow?.forEach(row => {
        chartData[row] = [];
      });
      lineData?.forEach(data => {
        chartData[data.date.substring(0, 10)].push(data.muscle);
      });
      console.log(chartData);
      maxLength = chartData ? Math.max(...Object.values(chartData).map(arr => arr.length)) : null;
      lineDataSets = {
        type: 'line',
        label: '근육 사용량',
        data: chartRow?.map(label => {
          const values = Array.from({ length: maxLength }, (_, i) => chartData[label][i] ?? 0);
          const sum = values.reduce((a, b) => a + b, 0);
          return sum;
        }),
        borderColor: 'rgba(0, 0, 0, 1)',
        backgroundColor: '#ffc80086',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      };

      console.log(lineDataSets);
      break;
    case 'setTotal':
      chartRow?.forEach(row => {
        chartData[row] = [];
      });
      lineData?.forEach(data => {
        chartData[data.date.substring(0, 10)].push(data.setTotal);
      });
      maxLength = chartData ? Math.max(...Object.values(chartData).map(arr => arr.length)) : null;
      lineDataSets = {
        type: 'line',
        label: '총 세트수',
        data: chartRow?.map(label => {
          const values = Array.from({ length: maxLength }, (_, i) => chartData[label][i] ?? 0);
          const sum = values.reduce((a, b) => a + b, 0);
          return sum;
        }),
        borderColor: 'rgba(0, 0, 0, 1)',
        backgroundColor: '#ffc80086',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      };

      break;
    case 'volumeTotal':
      chartRow?.forEach(row => {
        chartData[row] = [];
      });
      lineData?.forEach(data => {
        chartData[data.date.substring(0, 10)].push(data.volumeTotal);
      });
      maxLength = chartData ? Math.max(...Object.values(chartData).map(arr => arr.length)) : null;
      lineDataSets = {
        type: 'line',
        label: '볼륨 총합',
        data: chartRow?.map(label => {
          const values = Array.from({ length: maxLength }, (_, i) => chartData[label][i] ?? 0);
          const sum = values.reduce((a, b) => a + b, 0);
          return sum;
        }),
        borderColor: 'rgba(0, 0, 0, 1)',
        backgroundColor: '#ffc80086',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      };
      break;
    case 'rouTime':
      chartRow?.forEach(row => {
        chartData[row] = [];
      });
      lineData?.forEach(data => {
        chartData[data.date.substring(0, 10)].push(data.rouTime);
      });
      maxLength = chartData ? Math.max(...Object.values(chartData).map(arr => arr.length)) : null;
      lineDataSets = {
        type: 'line',
        label: '총 운동시간',
        data: chartRow?.map(label => {
          const values = Array.from({ length: maxLength }, (_, i) => chartData[label][i] ?? 0);
          const sum = values.reduce((a, b) => a + b, 0);
          return sum;
        }),
        borderColor: 'rgba(0, 0, 0, 1)',
        backgroundColor: '#ffc80086',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      };
      break;
  }
  console.log(lineDataSets, lineState);
  const data = {
    labels: chartRow,
    datasets: [lineDataSets],
  };
  return (
    <Card
      style={{
        width: '90%',
        height: '100%',
        zIndex: '10',
        position: 'relative',
        overflow: 'hidden',
        zIndex: '0!important',
      }}
    >
      {lineDataSets && <Line data={data} options={options} style={{ minHeight: '300px' }} />}
    </Card>
  );
}
