import React from "react";
import { AuCard, AuCardInner, AuCardTitle } from "../../types/auds";

interface Props {
  level: "1" | "2" | "3" | "4";
  title: string;
  className?: string;
  metric: string;
}
const MetricCard: React.FC<Props> = ({ level, title, metric, className }) => {
  return (
    <AuCard>
      <AuCardInner>
        <AuCardTitle level={level}>{title}</AuCardTitle>
        <div className="metric-card__inner">
          <span className="metric-card__desc">{metric}</span>
        </div>
      </AuCardInner>
    </AuCard>
  );
};

export default MetricCard;
