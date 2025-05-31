import React, { useEffect, useRef } from "react";
import Tick from "@pqina/flip";

const FlipTimer = () => {
  const tickRef = useRef(null);

  useEffect(() => {
    if (tickRef.current) {
      Tick.DOM.create(tickRef.current, {
        didInit: handleTickInit,
      });
    }
  }, []);

  function handleTickInit(tick) {
    const locale = {
      HOUR_PLURAL: "Hours",
      HOUR_SINGULAR: "Hour",
      MINUTE_PLURAL: "Minutes",
      MINUTE_SINGULAR: "Minute",
    };

    Object.keys(locale).forEach((key) => tick.setConstant(key, locale[key]));
    const now = new Date();
    const todayMidnight = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}T00:00:00`;

    Tick.count.up(todayMidnight, {
      format: ["h", "m"],
    }).onupdate = (value) => {
      tick.value = value;
    };
  }

  return (
    <div ref={tickRef} className="tick w-full">
      <div className="flex gap-1" data-repeat="true" data-layout="horizontal fit" data-transform="preset(h, m, s) -> delay">
        <div className="tick-group">
          <div data-key="value" data-repeat="true" data-transform="pad(00) -> split -> delay">
            <span data-view="flip"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipTimer;
