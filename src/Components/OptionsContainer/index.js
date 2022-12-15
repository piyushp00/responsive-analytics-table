import React, { useState } from "react";
import { connect } from "react-redux";
import { HeadersObject } from "../../Assets/constants";
import { applyHeaderFilters } from "../../Redux/actions";

function Index(props) {
  const [headers, setHeaders] = useState(props.headers);
  const handleDragStart = (e, id) => {
    e.target.classList.add("dragging");

    e.dataTransfer.setData("id", id);
  };
  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging");
  };
  const handleDrop = (e) => {
    let id = e.dataTransfer.getData("id");

    let insertBefore = e.target.getAttribute("data-index");
    let item = headers[id];
    let arr = [...headers];
    arr.splice(id, 1);

    arr.splice(insertBefore, 0, item);
    setHeaders(arr);
  };

  return (
    <div className="analytics-options-bar">
      <div className="columns-selector-wrapper border rounded">
        <div className="columns-selector-header">
          <h3>Dimensions and Metrics</h3>
        </div>
        <div
          className="columns-selector-body"
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          {headers.map((key, index) => (
            <div
              key={index}
              className="header-option pointer border rounded "
              onClick={() =>
                HeadersObject[key].moveable &&
                (headers.includes(key)
                  ? setHeaders(headers.filter((el) => el !== key))
                  : setHeaders([...headers, key]))
              }
              onDragStart={(e) => handleDragStart(e, index)}
              data-index={index}
              onDragEnd={handleDragEnd}
              draggable
            >
              {headers.includes(key) && (
                <div className="header-option-indicator"></div>
              )}

              <div className="header-option-title  " data-index={index}>
                {HeadersObject[key].displayName}
              </div>
            </div>
          ))}
          {Object.keys(HeadersObject)
            .filter((el) => !headers.includes(el))
            .map((el, index) => (
              <div
                key={index}
                className="header-option pointer border rounded"
                draggable={false}
                onClick={() =>
                  HeadersObject[el].moveable &&
                  (headers.includes(el)
                    ? setHeaders(headers.filter((item) => el !== item))
                    : setHeaders([...headers, el]))
                }
              >
                <div className="header-option-title">
                  {HeadersObject[el].displayName}
                </div>
              </div>
            ))}
        </div>
        <div className="filter-footer">
          <button className="secondary-button" onClick={props.onCancel}>
            Cancel
          </button>
          <button
            className="primary-button"
            onClick={() => {
              props.applyHeaderFilters(headers);
              props.onCancel();
            }}
          >
            Apply changes
          </button>
        </div>
      </div>
    </div>
  );
}

const mapStatesToProps = (state) => {
  return {
    data: state.responseData,
    headers: state.headers,
    ...state,
  };
};
export default connect(mapStatesToProps, { applyHeaderFilters })(Index);
