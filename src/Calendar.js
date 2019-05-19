import React from "react";
import "./Calendar.scss";
import Day from "./Components/Day/Day";
import Form from "./Components/Form/Form";

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      day: this.props.day,
      month: this.props.month - 1,
      year: this.props.year,
      cursor: "",
      findings: [],
      event: { person: "", desc: "" },
      events: {}
    };
    this.setDay = this.setDay.bind(this);
    this.setDate = this.setDate.bind(this);
    this.resetDate = this.resetDate.bind(this);
    this.prevMonth = this.prevMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);

    this.addEvent = this.addEvent.bind(this);
    this.updatePerson = this.updatePerson.bind(this);
    this.updateDesc = this.updateDesc.bind(this);
    this.saveEvents = this.saveEvents.bind(this);
    this.loadEvents = this.loadEvents.bind(this);
  }

  componentWillMount() {
    window.addEventListener("unload", this.saveEvents);
    this.setDate(this.props.day, this.props.month - 1, this.state.year);
    this.loadEvents();
  }
  componentWillUnmount() {
    window.removeEventListener("unload", this.saveEvents);
    this.saveEvents();
  }

  getMonthName(idx) {
    return [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь"
    ][idx];
  }

  formatDate(day, month, year) {
    day = day.toString().length < 2 ? "0" + day : day;
    month += 1;
    month = month.toString().length < 2 ? "0" + month : month;
    return `${day}.${month}.${year}`;
  }

  setDate(day, month, year, e) {
    if (e) e.preventDefault();
    let date = this.formatDate(day, month, year);
    this.setState({ cursor: date });
  }
  setDay(day, e) {
    this.setDate(day, this.state.month, this.state.year, e);
  }
  resetDate(e) {
    e.preventDefault();
    this.setState({
      year: this.props.year,
      month: this.props.month - 1,
      day: this.props.day
    });
    this.setDate(this.props.day, this.props.month - 1, this.props.year);
  }
  prevMonth(e) {
    e.preventDefault();
    let m = this.state.month - 1 === -1 ? 11 : this.state.month - 1;
    let y = m === 11 ? this.state.year - 1 : this.state.year;
    this.setState({ year: y, month: m });
  }
  nextMonth(e) {
    e.preventDefault();
    let m = this.state.month + 1 === 12 ? 0 : this.state.month + 1;
    let y = m === 0 ? this.state.year + 1 : this.state.year;
    this.setState({ year: y, month: m });
  }

  saveEvents() {
    localStorage.setItem("events", JSON.stringify(this.state.events));
  }
  loadEvents() {
    let events = localStorage.getItem("events");
    if (events) this.setState({ events: JSON.parse(events) });
  }
  getEvents(key) {
    if (this.state.events[key]) {
      return this.state.events[key];
    }
    return [];
  }
  updatePerson(e) {
    this.setState(prevState => ({ event: { ...prevState.event, person: e } }));
  }
  updateDesc(e) {
    this.setState(prevState => ({ event: { ...prevState.event, desc: e } }));
  }
  addEvent(e) {
    if (e) e.preventDefault();
    let event = {
      person: this.state.event.person.trim(),
      desc: this.state.event.desc.trim(),
      isEditable: false
    };
    if (!event) return;
    let events = this.state.events;
    let date = this.state.cursor;
    if (!events[date]) events[date] = [];
    events[date].push(event);
    this.setState({ event: { person: "", desc: "" }, events: events });
    this.saveEvents();
  }
  removeEvents(date) {
    let events = this.state.events;
    delete events[date];
    this.setState({ events: events });
  }
  removeEvent(date, idx) {
    if (this.state.events[date]) {
      let events = this.state.events;
      events[date].splice(idx, 1);

      if (!events[date].length) {
        this.removeEvents(date);
      } else {
        this.setState({ events: events });
      }
    }
  }
  searchEvent(value) {
    if (value) {
      let eventsDates = Object.getOwnPropertyNames(this.state.events);
      value = value.toLowerCase();
      let findings = [];

      for (let i = 0; i < Object.keys(this.state.events).length; i++) {
        this.state.events[eventsDates[i]].map(item => {
          if (
            value.includes(item.person.toLowerCase()) ||
            value.includes(item.desc.toLowerCase()) ||
            value.includes(eventsDates[i].toLowerCase())
          ) {
            findings.push({
              date: eventsDates[i],
              person: item.person,
              desc: item.desc
            });
          }
        });
        this.setState({ findings });
      }
    }
  }

  goToDate(date) {
    let dateSplitted = date.split(".");
    this.setState({
      day: dateSplitted[0],
      month: dateSplitted[1] - 1,
      year: dateSplitted[2]
    });
    console.log(dateSplitted);
    this.setDate(dateSplitted[0], dateSplitted[1] - 1, dateSplitted[2]);
  }

  render() {
    console.log(this.state.cursor);
    let date = new Date(this.state.year, this.state.month, 1);
    let weekDay = date.getDay() !== 0 ? date.getDay() : 7;

    date.setMonth(date.getMonth() + 1);
    date.setDate(1);
    date.setDate(date.getDate() - 1);
    let lastDay = date.getDate();

    let calendar = [];
    let start = weekDay - 1,
      end = weekDay + lastDay - 1;
    for (let i = 0; i < 42; ++i) {
      if (i >= start && i < end) {
        calendar[i] = i - weekDay + 2;
      } else {
        calendar[i] = "";
      }
    }

    let dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((item, i) => {
      return (
        <div className="day" key={i}>
          {item}
        </div>
      );
    });
    let cursorDate = this.state.cursor.split(".");
    cursorDate[0] = cursorDate[0]
      .substr(0, cursorDate[0].length - 1)
      .includes("0")
      ? cursorDate[0].slice(1)
      : cursorDate[0];
    let days = calendar.map((item, i) => {
      if (item) {
        let date = this.formatDate(item, this.state.month, this.state.year);

        let thisMonth =
          this.state.month === cursorDate[1] - 1 &&
          this.state.year.toString() === cursorDate[2];

        let selected = item.toString() === cursorDate[0] && thisMonth;

        return (
          <Day
            key={i}
            day={item}
            selected={selected}
            hasEvents={Array.isArray(this.state.events[date])}
            setDay={this.setDay}
          />
        );
      } else {
        return <Day key={i} day={-1} />;
      }
    });

    let events = this.getEvents(this.state.cursor).map((item, i) => {
      return (
        <li key={i}>
          <i className="fas fa-user" /> {item.person}
          <br />
          <i className="fab fa-elementor" /> {item.desc}
          {item.isEditable ? (
            <a href="#" onClick={() => (item.isEditable = false)}>
              <i className="fas fa-check" />
            </a>
          ) : (
            <a href="#" onClick={() => (item.isEditable = true)}>
              <i className="fas fa-edit" />
            </a>
          )}
          <a href="#" onClick={() => this.removeEvent(this.state.cursor, i)}>
            <i className="fas fa-trash" />
          </a>
        </li>
      );
    });

    return (
      <>
        {/* Search */}
        <div className="search">
          <input
            onChange={e => this.searchEvent(e.target.value)}
            type="text"
            placeholder="Поиск"
          />
        </div>

        {this.state.findings.length !== 0 ? (
          <div className="results">
            <ul>
              {this.state.findings.map((item, i) => (
                <li key={i}>
                  <i className="fas fa-user" /> {item.person}
                  <br />
                  <i className="fab fa-elementor" /> {item.desc}
                  <br />
                  <i className="fas fa-clock" /> {item.date}
                  <a href="#" onClick={() => this.goToDate(item.date)}>
                    <i className="fas fa-arrow-right" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="calendar">
          {/* Month selector */}
          <div className="month">
            <span className="month-active">
              <b>{this.getMonthName(this.state.month)}</b>
              {" " + this.state.year}
            </span>
            <span className="month-selector">
              <a className="prev" href="#" onClick={this.prevMonth}>
                ⟵
              </a>
              <a className="reset" href="#" onClick={this.resetDate}>
                ○
              </a>
              <a className="next" href="#" onClick={this.nextMonth}>
                ⟶
              </a>
            </span>
          </div>
          {/* Days grid */}
          <div className="weekdays">{dayNames}</div>
          <div className="days">{days}</div>
        </div>
        {/* Event list */}
        <div className="events">
          <h2 className="date-active">{this.state.cursor}</h2>
          {events.length > 0 && <ul>{events}</ul>}
        </div>
        {/* New event */}
        <div className="event-add">
          <h2>Добавить событие</h2>
          <Form
            value={this.state.event}
            submit={this.addEvent}
            updatePerson={this.updatePerson}
            updateDesc={this.updateDesc}
            valuePerson={this.state.event.person}
            valueDesc={this.state.event.desc}
          />
        </div>
      </>
    );
  }
}
