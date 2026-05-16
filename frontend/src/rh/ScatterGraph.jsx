import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const scatterData = [
  { x: 0.2, y: 0 }, { x: 0.5, y: 3 }, { x: 0.8, y: 2 }, { x: 1.0, y: 2 },
  { x: 1.5, y: 3 }, { x: 2.0, y: 2 }, { x: 2.0, y: 2 }, { x: 2.2, y: 2.5 },
  { x: 2.3, y: 4.2 }, { x: 2.5, y: 1 }, { x: 2.5, y: 2.5 }, { x: 2.5, y: 3.5 },
  { x: 2.7, y: 6 }, { x: 2.8, y: 2 }, { x: 2.8, y: 3 }, { x: 3.0, y: 2 },
  { x: 3.0, y: 4 }, { x: 3.0, y: 5 }, { x: 3.2, y: 4 }, { x: 3.3, y: 2.5 },
  { x: 3.5, y: 3 }, { x: 3.5, y: 3.5 }, { x: 3.5, y: 4.5 }, { x: 3.7, y: 3 },
  { x: 3.8, y: 4.2 }, { x: 4.0, y: 3 }, { x: 4.0, y: 4 }, { x: 4.2, y: 2 },
  { x: 4.5, y: 3 }, { x: 4.5, y: 4 }, { x: 4.5, y: 5 }, { x: 4.7, y: 3.5 },
  { x: 5.0, y: 1.5 }, { x: 5.0, y: 4 }, { x: 5.0, y: 5 }, { x: 5.0, y: 5.5 },
  { x: 5.0, y: 6 }, { x: 5.2, y: 4 }, { x: 5.2, y: 5 }, { x: 5.2, y: 5.5 },
  { x: 5.2, y: 6 }, { x: 5.5, y: 4 }, { x: 5.5, y: 5.5 }, { x: 5.5, y: 6 },
  { x: 5.5, y: 6.5 }, { x: 5.7, y: 5 }, { x: 5.8, y: 5.5 }, { x: 5.8, y: 6.2 },
  { x: 6.0, y: 4.5 }, { x: 6.0, y: 5 }, { x: 6.0, y: 6 }, { x: 6.0, y: 6.5 },
  { x: 6.2, y: 3.5 }, { x: 6.2, y: 6 }, { x: 6.5, y: 4 }, { x: 6.5, y: 5.5 },
  { x: 6.5, y: 6 }, { x: 6.7, y: 5 }, { x: 7.0, y: 4 }, { x: 7.0, y: 6 },
  { x: 7.0, y: 7 }, { x: 7.0, y: 7.5 }, { x: 7.0, y: 8 }, { x: 7.2, y: 5 },
  { x: 7.5, y: 6 }, { x: 7.5, y: 7.5 }, { x: 7.5, y: 8 }, { x: 7.7, y: 7.5 },
  { x: 8.0, y: 6.2 }, { x: 8.0, y: 7 }, { x: 8.0, y: 7.5 }, { x: 8.0, y: 8 },
  { x: 8.5, y: 6.5 }, { x: 8.5, y: 7 }, { x: 8.5, y: 8.5 }, { x: 9.0, y: 8.5 },
  { x: 9.5, y: 8 }, { x: 10.0, y: 10 },
];

export default function ScatterGraph() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const tickColor = isDark ? "#bbb" : "#555";
    const titleColor = isDark ? "#ccc" : "#444";

    chartRef.current = new Chart(canvasRef.current, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Predicted vs Ground Truth",
            data: scatterData,
            backgroundColor: "rgba(91,141,238,0.65)",
            borderColor: "rgba(91,141,238,0.9)",
            borderWidth: 1,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointStyle: "circle",
          },
          {
            label: "Ideal (y = x)",
            data: [{ x: 0, y: 0 }, { x: 10, y: 10 }],
            type: "line",
            borderColor: "#e05c5c",
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 0,
            fill: false,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                if (ctx.datasetIndex === 1) return null;
                return `Ground Truth: ${ctx.parsed.x.toFixed(1)}  |  Predicted: ${ctx.parsed.y.toFixed(1)}`;
              },
            },
          },
        },
        scales: {
          x: {
            min: 0,
            max: 10,
            title: {
              display: true,
              text: "Ground Truth Score (/10)",
              color: titleColor,
              font: { size: 12 },
            },
            grid: { color: gridColor },
            ticks: { color: tickColor, stepSize: 2 },
          },
          y: {
            min: 0,
            max: 10,
            title: {
              display: true,
              text: "Predicted Score (/10)",
              color: titleColor,
              font: { size: 12 },
            },
            grid: { color: gridColor },
            ticks: { color: tickColor, stepSize: 2 },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, []);

  return (
    <div className="dashboard-graph">
      <p className="graph-title">Ground Truth vs Predicted Scores</p>

      <div className="scatter-chart-wrapper">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Scatter plot comparing ground truth scores vs predicted scores out of 10"
        >
          Scatter plot montrant la corrélation entre les scores réels et prédits.
        </canvas>
      </div>

      <div className="graph-footer">
        <div className="graph-footer-item scatter-legend">
          <span className="legend-dot" style={{ background: "rgba(91,141,238,0.85)" }} />
          Predicted vs Ground Truth
        </div>
        <div className="graph-footer-item scatter-legend">
          <svg width="24" height="10" aria-hidden="true">
            <line
              x1="0" y1="5" x2="24" y2="5"
              stroke="#e05c5c"
              strokeWidth="2"
              strokeDasharray="5,3"
            />
          </svg>
          Ideal (y = x)
        </div>
        <div className="graph-footer-item scatter-stats">
          Pearson r = 0.63 &nbsp;|&nbsp; MAE = 1.898 (/10)
        </div>
      </div>
    </div>
  );
}
