import React from "react";
import { AuCard, AuCardInner, AuCardTitle } from "../../types/auds";

interface Props {
  level: "1" | "2" | "3" | "4";
  title: string;
  className?: string;
  metric: string;
  link?: string;
  linkText?: string;
}
const MetricCard: React.FC<Props> = ({
  level,
  title,
  metric,
  link,
  linkText,
  className,
}) => {
  return (
    <AuCard>
      <AuCardInner>
        <AuCardTitle level={level} className="font-weight-500">
          {title}
        </AuCardTitle>
        <div className="metric-card__inner">
          {link && linkText && (
            <div className="metric-card__link">
              <a href={link}>{linkText}</a>
            </div>
          )}
          <div className="metric-card__desc">
            <span className="metric">{metric}</span>
            <span className="percentage">
              {Math.floor(Math.random() * 2) === 1 ? (
                <span aria-label="Up">&#8599;</span>
              ) : (
                <span aria-label="Down">&#8600;</span>
              )}
              {Math.floor(Math.random() * 50)}%
            </span>
          </div>
        </div>
      </AuCardInner>
    </AuCard>
  );
};

export default MetricCard;
