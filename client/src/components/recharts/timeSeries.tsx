import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatDate, formatHour } from "./formatters/dateTickFormatter";
import { PageViewsTooltip } from "./formatters/tooltipFormatters";

interface Props {
  data?: any;
  xKey: string;
  yKey: string;
}

export const LineChartVis: React.FC<Props> = ({ data, xKey, yKey }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 20, right: 10, bottom: 40, left: -0 }}
      >
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis
          dataKey={xKey}
          tick={xKey === "date" ? <CustomizedAxisTick /> : <HourlyTick />}
          interval={1}
        />
        <YAxis
          domain={[
            (dataMin) => {
              return Math.floor(dataMin / 1000) * 1000;
            },
            (dataMax) => {
              return Math.ceil(dataMax / 1000) * 1000;
            },
          ]}
        />
        <Tooltip content={<PageViewsTooltip />} />

        <Line type="linear" dataKey={yKey} stroke="#008568" strokeWidth="3" />
      </LineChart>
    </ResponsiveContainer>
  );
};

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props as any;
    if (payload.index === 0) {
      return null;
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          transform="rotate(-20)"
        >
          {formatDate(payload.value)}
        </text>
      </g>
    );
  }
}

class HourlyTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props as any;
    if (payload.index === 0) {
      return null;
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          transform="rotate(-20)"
        >
          {formatHour(payload.value)}
        </text>
      </g>
    );
  }
}
