import React, { useState } from "react";
import { connect } from "react-redux";
import { HeadersObject } from "../../Assets/constants";

const GetFilterBody = ({ activeId, data, apps, ...props }) => {
  const [query, setQuery] = useState("");

  const [arr, setArr] = useState(apps.map((el) => el["app_name"]));
  const handleChange = (e) => {
    let query = e.target.value;
    
    if (query === "") {
      var suggestedArray = apps.map((el) => el["app_name"]);
    } else {
      var suggestedArray = [...arr].filter(
        (el) => el.toLowerCase().indexOf(query.toLowerCase()) > -1
      );
    }

    setArr(suggestedArray);

    setQuery(query);
  };
  const setItem = (value) => {
    setQuery(value);
  };

  return (
    <div>
      <input
        name="query"
        type="text"
        className="query-input border rounded"
        placeholder="Type to search"
        value={query}
        onChange={handleChange}
      />
      <div clssName="suggestions-wrapper">
        {arr.map((el, index) => (
          <div
            key={index}
            className="dropdown-item pointer"
            onClick={() => setItem(el)}
          >
            {el}
          </div>
        ))}
      </div>
      <div className="filter-footer">
        <button
          className="primary-button"
          onClick={() =>
            props.applyFilter(
              apps.filter((el) => el["app_name"] === query).length > 0
                ? apps.filter((el) => el["app_name"] === query)[0]["app_id"]
                : "",
              activeId
            )
          }
        >
          Apply
        </button>
      </div>
    </div>
  );
};
const RangeSelector = ({ activeId, data, apps, ...props }) => {
  const [values] = useState({
    start: Math.floor(Math.min(...data.map((el) => el[activeId]))),
    end: Math.floor(Math.max(...data.map((el) => el[activeId]))),
  });
  const [endIndicator, setIndicator] = useState(values.end);
  const [filter, setFilter] = useState("");
  const handleRangeChange = (e) => {
    let diff = values.end - values.start;
    let currentValue = Math.floor((e.target.value * diff) / 100) + values.start;
    setIndicator(currentValue);
    setFilter({ ...values, end: currentValue });
  };
  let inputCurrentValue =
    ((endIndicator - values.start) * 100) / (values.end - values.start);
  return (
    <div>
      <input
        type="range"
        onChange={handleRangeChange}
        value={inputCurrentValue}
      ></input>
      <div className="range-indicators">
        <div>{values.start}</div>
        <div>{endIndicator}</div>
      </div>
      <div className="filter-footer">
        <button
          className="primary-button"
          onClick={() => props.applyFilter(filter, activeId)}
        >
          Apply
        </button>
      </div>
    </div>
  );
};
const Index = (props) => {
  switch (HeadersObject[props.activeId]["type"]) {
    case "string":
      return GetFilterBody(props);
    default:
      return RangeSelector(props);
  }
};

const mapStatesToProps = (state) => {
  return {
    data: state.responseData,
    headers: state.headers,
    ...state,
  };
};
export default connect(mapStatesToProps, null)(Index);
