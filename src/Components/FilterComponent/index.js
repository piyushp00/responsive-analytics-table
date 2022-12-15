import React from "react";
import GetFilterBody from "../SearchInput";

function index({ filterPosition, ...props }) {
  return (
    <div className="overlay" onClick={() => props.setShowFilter(false)}>
      <div
        className="filter border rounded"
        style={{
          left: filterPosition.left,
          top: filterPosition.top,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="filter-header">Filter</div>
        <GetFilterBody
          activeId={filterPosition.active_id}
          applyFilter={props.applyFilter}
        />
      </div>
    </div>
  );
}

export default index;
