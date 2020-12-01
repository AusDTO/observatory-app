import React from "react";
import { AuCard, AuCardInner, AuCardTitle } from "../../types/auds";

interface Props {
  level: "1" | "2" | "3" | "4";
  title: string;
  metric: string | React.ReactElement;
  metricAlignment?: boolean;
  className?: string;
  link?: string;
  linkText?: string;
  defLink?: string; //FIX the def link should probs be a type
  defLinkId?: string;
}
const MetricCard: React.FC<Props> = ({
  level,
  title,
  metric,
  link,
  linkText,
  defLink,
  defLinkId,
  metricAlignment = false,
  className,
}) => {
  const metricStyle = {
    alignItems: metricAlignment ? "flex-start" : "flex-end",
  };

  return (
    <AuCard className="metric-card">
      <AuCardInner>
        <AuCardTitle
          level={level}
          className="font-weight-500 metric-card__title"
        >
          {title}
          {defLink && (
            <a
              href={defLink}
              className="metric-card__title-link"
              id={defLinkId}
            >
              Learn<span className="visually-hidden"> more about {title}</span>
            </a>
          )}
        </AuCardTitle>
        <div className="metric-card__inner">
          {link && linkText && (
            <div className="metric-card__link">
              <a href={link} target="blank" rel="noopener noreferrer">
                {linkText}
              </a>
            </div>
          )}
          <div className="metric-card__desc" style={metricStyle}>
            <div className="metric">{metric}</div>
          </div>
        </div>
      </AuCardInner>
    </AuCard>
  );
};

export default MetricCard;
