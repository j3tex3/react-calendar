import React from "react";
import "./Day.scss";

const Day = props => {
  let cls = props.selected ? " day-active" : "";
  if (props.hasEvents) cls += " has-events";

  let day = props.day;
  return day > 0 ? (
    <div className={"day" + cls} onClick={e => props.setDay(props.day, e)}>
      {props.day}
    </div>
  ) : (
    <div className="day day-empty" />
  );
};

export default Day;
