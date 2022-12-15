import React, { useEffect, useState } from "react";
import { HeadersObject } from "../../Assets/constants";

import FilterComponent from "../FilterComponent";
import TableComponent from "../TableComponent";
import QueryInput from "../QueryInput";
import { connect } from "react-redux";

import OptionsContainer from "../OptionsContainer";
import NoDataSVG from "../../Assets/undraw_no_data_qbuo.svg";
import { FaCalendarAlt } from "react-icons/fa";
import { GoSettings } from "react-icons/go";

import { getData, getApps } from "../../Redux/actions";

function Index(props) {
  const [data, setData] = useState(props.data);
  const [showOptions, setShowOptions] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });
  const [filterPosition, setFilterPosition] = useState({
    left: 0,
    top: 0,
    active_id: "",
  });

  const applyFilter = (filter, activeId) => {
    if (HeadersObject[activeId].type === "string") {
      setData([...props.data.filter((el) => el["app_id"] === filter)]);
    } else {
      setData([
        ...props.data.filter(
          (el) => el[activeId] >= filter.start && el[activeId] <= filter.end
        ),
      ]);
    }
    setShowFilter(false);
  };

  const setShowFilterCb = (value) => {
    setShowFilter(value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    props.getData(dateRange);
    setShowDatePicker(false);
  };
  useEffect(() => {
    props.getApps();
    setData(props.data);
  }, [props.data]);

  return (
    <>
      <div className="content-layout analytics-layout">
        <h2>Analytics</h2>
        <div className="analytics-header-bar">
          <button
            className="date-picker options-button border rounded "
            onClick={() => setShowDatePicker(true)}
          >
            <span className="option-icon">
              <FaCalendarAlt />
            </span>
            Date Picker
          </button>

          {showDatePicker && (
            <QueryInput
              setStartDateRange={(value) =>
                setDateRange({ ...dateRange, from: value })
              }
              setEndDateRange={(value) =>
                setDateRange({ ...dateRange, to: value })
              }
              setShowDatePicker={(value) => setShowDatePicker(value)}
              handleSubmit={handleSubmit}
            />
          )}
          <button
            className="settings-button  options-button border rounded"
            onClick={() => setShowOptions(true)}
          >
            <span className="option-icon">
              <GoSettings handleSubmit={handleSubmit} />
            </span>
            Setting button
          </button>
        </div>
        {showOptions && (
          <OptionsContainer onCancel={() => setShowOptions(false)} />
        )}
        <div className="analytics-main-content">
          <div className="table-wrapper">
            {data.length > 0 && !props.getCallFailed ? (
              <TableComponent
                setFilterPosition={setFilterPosition}
                setShowFilter={setShowFilter}
                source={data}
              />
            ) : (
              <div className="no-results-container rounded">
                <img alt="No data to display" src={NoDataSVG}></img>
                <div>
                  {props.getCallFailed ? (
                    <>
                      <h3>Hey! Something's off!</h3>
                      <h3>We couldn't display the given data try</h3>
                    </>
                  ) : (
                    <h3>No Data to display</h3>
                  )}
                  <br />
                  <span className="suggestion-span">
                    try changing your filters or selecting a different date
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showFilter && (
        <FilterComponent
          filterPosition={filterPosition}
          applyFilter={applyFilter}
          setShowFilter={setShowFilterCb}
        />
      )}
    </>
  );
}
const mapStatesToProps = (state) => {
  return {
    ...state,
    data: state.responseData,
    headers: state.headers,
    apps: state.apps,
    getCallFailed: state.fetchFailed,
  };
};
export default connect(mapStatesToProps, { getData, getApps })(Index);
