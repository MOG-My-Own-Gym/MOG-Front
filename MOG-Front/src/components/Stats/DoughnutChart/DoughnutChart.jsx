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
  PolarAreaController,
  DoughnutController,
  RadialLinearScale,
  ArcElement,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Bar, Chart, Line, PolarArea } from 'react-chartjs-2';
import RadialGradientSpinner from '../../Loader/RadialGradientSpinner';

export default function DoughnutChart({ doughnutData, isMobile, isPolar }) {
  ChartJS.register(
    PolarAreaController,
    DoughnutController,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
    Title,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Legend,
    Tooltip,
  );
  const [sortedDoughnutData, setSortedDoughnutData] = useState([]);
  const [sortedRowData, setSortedRowData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const totalSum = sortedDoughnutData
    ? sortedDoughnutData.reduce((acc, [_, value]) => acc + value, 0)
    : null;

  function getLogScaledData(entries) {
    return entries.map(([label, value]) => [label, Math.log(value + 1)]);
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    zIndex: 0,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          generateLabels(chart) {
            const original = ChartJS.overrides.doughnut.plugins.legend.labels.generateLabels;
            const labels = original(chart);
            return labels.slice(0, 10).reverse();
          },
          font: {
            size: isMobile ? 8 : 14,
          },
          boxWidth: 10, // 색상 박스 너비 (기본 40px 정도)
          boxHeight: 10, // 색상 박스 높이 (기본 없음, boxWidth와 같음)
          padding: 8,
        },
      },
    },
  };

  useEffect(() => {
    if (doughnutData) {
      setSortedDoughnutData(
        isPolar
          ? getLogScaledData(
              Object.entries(doughnutData)
                .sort((a, b) => a[1] - b[1])
                .slice(Object.entries(doughnutData).length - 5),
            )
          : Object.entries(doughnutData).sort((a, b) => a[1] - b[1]),
      );
    }
  }, [doughnutData]);
  useEffect(() => {
    setSortedRowData(
      sortedDoughnutData?.map(entries => {
        return entries[0];
      }),
    );
  }, [sortedDoughnutData]);
  useEffect(() => {
    if (!sortedRowData.length !== 0)
      setChartData({
        labels: sortedRowData,
        datasets: [
          {
            type: isPolar ? 'polarArea' : 'doughnut',
            data: sortedDoughnutData
              ? sortedDoughnutData.map(entries => {
                  return entries[1];
                })
              : [],
            borderColor: 'rgba(0, 0, 0, 1)',

            backgroundColor: sortedDoughnutData
              ? sortedDoughnutData.map(entries => {
                  const minLightness = 50;
                  const maxLightness = 100;
                  const ratio = entries[1] / totalSum;

                  const lightness = isPolar
                    ? 60 +
                      (minLightness +
                        (maxLightness - minLightness) * (1 - Math.min(ratio * 10, 2))) *
                        3
                    : minLightness + (maxLightness - minLightness) * (1 - Math.min(ratio * 10, 1)); // 값이 클수록 더 진하게 (50%~100% 밝기)
                  return `hsl(45, 100%, ${lightness}%,${isPolar ? 0.65 : 1})`; // 노란색(hue 45) 계열
                })
              : [],
            fill: false,
            tension: 0,
            yAxisID: 'y',
          },
        ],
      });
  }, [sortedDoughnutData, sortedRowData]);
  console.log(chartData);
  return (
    <Card
      style={{
        width: '90%',
        height: '100%',
        zIndex: '10',
        position: 'relative',
        overflow: 'hidden',
        zIndex: '0!important',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {doughnutData && chartData ? (
        isPolar ? (
          <Chart
            type="polarArea"
            data={chartData}
            options={options}
            style={{ minHeight: '300px', background: 'transparent' }}
          />
        ) : (
          <Chart
            type="doughnut"
            data={chartData}
            options={options}
            style={{ minHeight: '300px', background: 'transparent' }}
          />
        )
      ) : (
        <div
          style={{
            minHeight: '300px',
            background: 'transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <RadialGradientSpinner />
        </div>
      )}
    </Card>
  );
}
