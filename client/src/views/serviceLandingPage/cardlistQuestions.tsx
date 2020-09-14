import React from "react";

import { AuCard, AuCardInner } from "../../types/auds";

interface Props {} // key

export const ServiceQuestions: React.FC<Props> = () => {
  return (
    <section className="mt-2">
      <h2>
        Which questions are going to help you achieve your business objectives
        today?
      </h2>
      <div className="row">
        <ul className="au-card-list au-card-list--matchheight">
          <li className="col-sm-3 col-xs-6">
            <AuCard>
              <AuCardInner>
                <h3 className="mt-0 font-weight-500">Accessibility</h3>
                <ul className="au-link-list">
                  <li>
                    <a href="#">Lorem, ipsum dolor?</a>
                  </li>
                  <li>
                    <a href="#">Lorem ipsum dolor sit?</a>
                  </li>
                  <li>
                    <a href="#">Lorem, ipsum?</a>
                  </li>
                  <li>
                    <a href="#">Lorem, ipsum?</a>
                  </li>
                </ul>
              </AuCardInner>
            </AuCard>
          </li>
          <li className="col-sm-3 col-xs-6">
            <AuCard>
              <AuCardInner>
                <h3 className="mt-0 font-weight-500">Audience</h3>
                <ul className="au-link-list">
                  <li>
                    <a href="#">Lorem, ipsum dolor?</a>
                  </li>
                  <li>
                    <a href="#">Lorem ipsum dolor sit?</a>
                  </li>
                  <li>
                    <a href="#">Lorem, ipsum?</a>
                  </li>
                </ul>
              </AuCardInner>
            </AuCard>
          </li>
          <li className="col-sm-3 col-xs-6">
            <AuCard>
              <AuCardInner>
                <h3 className="mt-0 font-weight-500">Content</h3>
                <ul className="au-link-list">
                  <li>
                    <a href="#">Lorem, ipsum dolor?</a>
                  </li>
                  <li>
                    <a href="#">Lorem ipsum dolor sit?</a>
                  </li>
                  <li>
                    <a href="#">Lorem, ipsum?</a>
                  </li>
                </ul>
              </AuCardInner>
            </AuCard>
          </li>
          <li className="col-sm-3 col-xs-6">
            <AuCard>
              <AuCardInner>
                <h3 className="mt-0 font-weight-500">Engagement</h3>
                <ul className="au-link-list">
                  <li>
                    <a href="#">Lorem, ipsum dolor?</a>
                  </li>
                  <li>
                    <a href="#">Lorem ipsum dolor sit?</a>
                  </li>
                  <li>
                    <a href="#">Lorem, ipsum?</a>
                  </li>
                </ul>
              </AuCardInner>
            </AuCard>
          </li>

          <li className="col-sm-3 col-xs-6">
            <AuCard>
              <AuCardInner>
                <h3 className="mt-0 font-weight-500">Searching and finding</h3>
                <ul className="au-link-list">
                  <li>
                    <a href="#">Lorem, ipsum dolor?</a>
                  </li>
                  <li>
                    <a href="#">Lorem ipsum dolor sit?</a>
                  </li>
                  <li>
                    <a href="#">Lorem, ipsum?</a>
                  </li>
                </ul>
              </AuCardInner>
            </AuCard>
          </li>
          <li className="col-sm-3 col-xs-6">
            <AuCard>
              <AuCardInner>
                <h3 className="mt-0 font-weight-500">Traffic</h3>
                <ul className="au-link-list">
                  <li>
                    <a href="#">Lorem, ipsum dolor?</a>
                  </li>
                  <li>
                    <a href="#">Lorem ipsum dolor sit?</a>
                  </li>
                  <li>
                    <a href="#">Lorem, ipsum?</a>
                  </li>
                </ul>
              </AuCardInner>
            </AuCard>
          </li>
        </ul>
      </div>
    </section>
  );
};
