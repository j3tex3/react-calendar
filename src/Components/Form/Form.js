import React from "react";
import "./Form.scss";

const Form = props => {
  return (
    <form onSubmit={e => props.submit(e)}>
      <div className="input-group">
        <input
          className="input-main"
          onChange={e => props.updatePerson(e.target.value)}
          type="text"
          placeholder="Имена участников"
          value = {props.valuePerson}
        />
        <input
          className="input-main"
          onChange={e => props.updateDesc(e.target.value)}
          type="text"
          placeholder="Событие"
          value = {props.valueDesc}
        />
        <button type="submit" className="btn-main">
          +
        </button>
      </div>
    </form>
  );
};

export default Form;
