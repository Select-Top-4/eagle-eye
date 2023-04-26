import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import config from "../config.json";
import { formatDate, formatFullDate } from "../helpers/formatter";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "8px",
          border: "1px solid #7e57c2",
          borderRadius: "5px",
          outline: "none",
          "outline:hover": "none",
        }}
      >
        <p className="label">{`Date: ${formatFullDate(label)}`}</p>
        <p className="intro">{`Observation Count: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const TimelineChart = ({ speciesCode }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://${config.server_host}:${config.server_port}/species/${speciesCode}/last-30-daily-observation-count`
        );
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [speciesCode]);

  return (
    chartData.length > 0 && (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="observation_day" tickFormatter={formatDate} />
          <YAxis
            tickCount={
              Math.max(...chartData.map(item => item.observation_count)) + 1
            }
            domain={[0, "dataMax+3"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="observation_count"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  );
};

export default TimelineChart;
