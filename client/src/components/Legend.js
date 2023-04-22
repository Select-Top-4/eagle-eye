import React from "react";
import "./css/Legend.css";

const Legend = ({ quantiles, legendLarge }) => {
  if (!quantiles) return null;

  const colorScale = ["#fff9c4", "#fff176", "#ffeb3b", "#fdd835", "#fbc02d"];

  const quantileLabels = quantiles.map((q, i, arr) => {
    if (i === 0) {
      return `<= ${parseInt(q)}`;
    } else if (i === arr.length - 1 && arr.length !== 4) {
      return `${parseInt(arr[i - 1]) + 1} - ${parseInt(q)}`;
    } else {
      return `${parseInt(arr[i - 1]) + 1} - ${parseInt(q)}`;
    }
  });

  if (quantiles.length === 4 && legendLarge) {
    quantileLabels.push(`> ${parseInt(quantiles[quantiles.length - 1])}`);
  }

  return (
    <div className="legend">
      <div className="legend-title">Observation Count: </div>
      {quantileLabels.map((label, index) => (
        <div className="legend-item" key={index}>
          <div
            className="legend-color"
            style={{ backgroundColor: colorScale[index] }}
          ></div>
          <div className="legend-label">{label}</div>
        </div>
      ))}
    </div>
  );
};

export default Legend;
