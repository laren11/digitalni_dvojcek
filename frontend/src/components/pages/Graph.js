import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-moment";

Chart.register(...registerables);

function Graph(props) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const value = params.get("value");
  const exchange = params.get("exchange");
  const [graphData, setGraphData] = useState([]);
  const chartRef = useRef(null);

  const fetchGraphData = () => {
    fetch("http://localhost:3001/prices/graphdata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: value, exchange: exchange }),
    })
      .then((response) => response.json())
      .then((data) => {
        setGraphData(data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  useEffect(() => {
    const dates = graphData.map((data) => new Date(data.date));
    const prices = graphData.map((data) => data.price);
    const ctx = chartRef.current.getContext("2d");
    const minPrice = Math.min(...prices) - 10;
    const maxPrice = Math.max(...prices) + 10;

    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    chartRef.current.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Price",
            data: prices,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false, // Hide legend if not needed
          },
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day", // Adjust the time unit based on your data density
            },
            ticks: {
              source: "auto",
            },
          },
          y: {
            min: minPrice,
            max: maxPrice,
          },
        },
      },
    });
  }, [graphData]);

  return (
    <div style={{ color: "white" }}>
      <h1 className="title" style={{ paddingBottom: "2%" }}>
        {exchange} - {value}
      </h1>
      <div>
        <canvas
          ref={chartRef}
          style={{
            marginLeft: "5%",
            marginRight: "5%",
            marginBottom: "5%",
            paddingBottom: "5%",
            height: "11vh",
            backgroundColor: "white",
          }}
        ></canvas>
      </div>
    </div>
  );
}

export default Graph;
