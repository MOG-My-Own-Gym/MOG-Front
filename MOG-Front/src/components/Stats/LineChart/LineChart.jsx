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
} from 'chart.js';
import { useState } from 'react';
import { Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';

export default function LineChart({ lineData }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
  );
  const [lineState, setLineState] = useState(null);
  const rowData = lineData?.map(data => {
    return data.date.substring(0, 10);
  });
  const chartRow = rowData?.filter((data, index) => {
    return rowData.indexOf(data) === index;
  });
  const chartData = chartRow?.reduce((acc, date) => {
    acc[date] = [];
    return acc;
  }, {});
  console.log(chartData);
  lineData?.forEach(data => {
    chartData[data.date.substring(0, 10)].push(data.kcal);
  });

  console.log(lineData);
  let lineDataSets;
  switch (lineState) {
    case 'muscle':
      lineDataSets = {
        type: 'line',
        label: '칼로리 소모 추이',
        data: chartRow?.map(label => {
          const values = Array.from({ length: maxLength }, (_, i) => chartData[label][i] ?? 0);
          const sum = values.reduce((a, b) => a + b, 0);
          console.log(sum / values.length);
          return values.length ? sum / values.length : 0;
        }),
        borderColor: 'rgba(0, 0, 0, 1)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        fill: false,
        tension: 0,
        yAxisID: 'y',
      };
      break;
    case 'setTotal':
      break;
    case 'volumeTotal':
      break;
    case 'rouTime':
      break;
  }
  console.log(lineDataSets);
  const data = {
    labels: ['월', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '운동 데이터 샘플 꺾은선그래프',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
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

  return (
    <Card className="w-100 h-100">
      <Line data={data} options={options} style={{ minHeight: '300px' }} />
    </Card>
  );
}
