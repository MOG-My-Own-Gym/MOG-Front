import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card } from 'react-bootstrap';
import { Bar, Chart, Line } from 'react-chartjs-2';

export default function BarChart({ barData }) {
  ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Legend,
    Tooltip,
  );
  console.log(barData);
  //한달 예시 샘플 데이터
  
  barData = [
    { date: '2025-07-01T08:23:00.0000000', kcal: 479 },
    { date: '2025-07-01T09:15:00.0000000', kcal: 210 },
    { date: '2025-07-02T09:41:00.0000000', kcal: 177 },
    { date: '2025-07-02T10:05:00.0000000', kcal: 130 },
    { date: '2025-07-03T08:57:00.0000000', kcal: 433 },
    { date: '2025-07-03T09:30:00.0000000', kcal: 290 },
    { date: '2025-07-04T08:05:00.0000000', kcal: 366 },
    { date: '2025-07-04T08:40:00.0000000', kcal: 120 },
    { date: '2025-07-05T08:14:00.0000000', kcal: 277 },
    { date: '2025-07-06T09:30:00.0000000', kcal: 156 },
    { date: '2025-07-06T10:00:00.0000000', kcal: 200 },
    { date: '2025-07-07T09:05:00.0000000', kcal: 390 },
    { date: '2025-07-08T08:50:00.0000000', kcal: 499 },
    { date: '2025-07-08T09:10:00.0000000', kcal: 180 },
    { date: '2025-07-09T08:20:00.0000000', kcal: 261 },
    { date: '2025-07-10T09:12:00.0000000', kcal: 189 },
    { date: '2025-07-10T09:50:00.0000000', kcal: 210 },
    { date: '2025-07-11T08:45:00.0000000', kcal: 316 },
    { date: '2025-07-12T09:00:00.0000000', kcal: 451 },
    { date: '2025-07-12T09:30:00.0000000', kcal: 150 },
    { date: '2025-07-13T08:33:00.0000000', kcal: 147 },
    { date: '2025-07-14T08:22:00.0000000', kcal: 322 },
    { date: '2025-07-15T09:44:00.0000000', kcal: 270 },
    { date: '2025-07-15T10:10:00.0000000', kcal: 190 },
    { date: '2025-07-16T08:00:00.0000000', kcal: 230 },
    { date: '2025-07-17T09:28:00.0000000', kcal: 184 },
    { date: '2025-07-17T10:05:00.0000000', kcal: 210 },
    { date: '2025-07-18T08:05:00.0000000', kcal: 499 },
    { date: '2025-07-19T08:40:00.0000000', kcal: 393 },
    { date: '2025-07-20T09:15:00.0000000', kcal: 228 },
    { date: '2025-07-20T09:50:00.0000000', kcal: 150 },
    { date: '2025-07-21T08:52:00.0000000', kcal: 467 },
    { date: '2025-07-22T08:31:00.0000000', kcal: 254 },
    { date: '2025-07-23T08:08:00.0000000', kcal: 172 },
    { date: '2025-07-24T09:03:00.0000000', kcal: 415 },
    { date: '2025-07-25T08:25:00.0000000', kcal: 497 },
    { date: '2025-07-25T09:10:00.0000000', kcal: 180 },
    { date: '2025-07-26T09:20:00.0000000', kcal: 350 },
    { date: '2025-07-27T08:07:00.0000000', kcal: 193 },
    { date: '2025-07-28T08:39:00.0000000', kcal: 438 },
    { date: '2025-07-29T08:11:00.0000000', kcal: 285 },
    { date: '2025-07-30T09:18:00.0000000', kcal: 314 },
    { date: '2025-07-31T08:27:00.0000000', kcal: 367 },
    { date: '2025-07-31T09:00:00.0000000', kcal: 220 },
  ];
  
  const rowData = barData?.map(data => {
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
  barData?.forEach(data => {
    chartData[data.date.substring(0, 10)].push(data.kcal);
  });

  const maxLength = chartData ? Math.max(...Object.values(chartData).map(arr => arr.length)) : null;

  //색상용 (노랑)
  const baseHue = 45;
  const baseSaturation = 100;
  const maxLightness = 80;
  const minLightness = 50;

  const stackedBarDatasets = Array.from({ length: maxLength }, (_, i) => {
    const ratio = 1 - i / (maxLength - 1 || 1);
    const lightness = minLightness + (maxLightness - minLightness) * ratio;
    return {
      type: 'bar',
      label: `루틴 ${i + 1}`,
      data: chartRow.map(label => chartData[label][i] ?? null),
      backgroundColor: `hsl(${baseHue}, ${baseSaturation}%, ${lightness}%)`,
      barThickness: chartRow.length>7?20:50,
    };
  });

  const lineDataset = {
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
  const datasets = [lineDataset, ...stackedBarDatasets];
  console.log(stackedBarDatasets);
  console.log(lineDataset.data);
  console.log(datasets);
  const data = barData
    ? {
        labels: chartRow,
        datasets: datasets,
      }
    : null;
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    zIndex: 0,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        beginAtZero: true,
        stacked: true,
      },
    },
  };

  return (
    <Card
      style={{
        width: '100%',
        height: '100%',
        zIndex: '10',
        position: 'relative',
        overflow: 'hidden',
        zIndex: '0!important',
      }}
    >
      {barData ? (
        <Chart
          data={data}
          options={options}
          style={{ minHeight: '300px', background: 'transparent' }}
        />
      ) : (
        <>'데이터 요청에 실패했습니다 다시 시도해주세요'</>
      )}
    </Card>
  );
}
