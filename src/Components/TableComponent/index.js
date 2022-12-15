import React from "react";
import { connect } from "react-redux";
import { Months, HeadersObject } from "../../Assets/constants";
import { FaFilter } from "react-icons/fa";

function Index({ source, ...props }) {
  const formatData = (key, paramData, index) => {
    switch (key) {
      case "app_id":
        return props.apps.filter((el) => el.app_id === paramData)[0].app_name;
      case "date":
        let date = new Date(paramData);
        return `${date.getDate()} ${
          Months[date.getMonth()]
        } ${date.getFullYear()}`;
      case "revenue":
        return `$${paramData.toFixed(2)}`;
      case "fillRate": {
        return paramData + "%";
      }
      case "Ctr": {
        return paramData + "%";
      }
      default:
        return formatNumberUs(paramData);
    }
  };
  const formatNumberUs = (paramData) => {
    return paramData
      .toLocaleString("en-US")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  let getTotalValue = (key) => {
    switch (key) {
      case "date":
        return "";
      case "app_id":
        return source.length;
      case "fillRate": {
        return (
          (
            source.reduce((acc, row) => {
              return acc + (row.requests / row.responses) * 100;
            }, 0) / source.length
          ).toFixed(2) + "%"
        );
      }
      case "Ctr": {
        return (
          (
            source.reduce((acc, row) => {
              return acc + (row.clicks / row.impressions) * 100;
            }, 0) / source.length
          ).toFixed(2) + "%"
        );
      }
      case "revenue": {
        return (
          "$" +
          formatNumberUs(
            source.reduce((acc, row) => {
              return acc + parseInt(row[key]);
            }, 0)
          )
        );
      }
      default:
        return formatNumberUs(
          source.reduce((acc, row) => {
            return acc + parseInt(row[key]);
          }, 0)
        );
    }
  };

  return (
    <table>
      <thead>
        <tr>
          {props.headers.map((key, index) => (
            <th>
              <div
                key={index}
                className="header-cell"
                style={{
                  justifyContent: HeadersObject[key].headAlign,
                }}
              >
                {HeadersObject[key].filter && (
                  <div
                    className="pointer filter-font"
                    onClick={(e) => {
                      props.setFilterPosition({
                        left: e.clientX - 70,
                        top: e.clientY + 20,
                        active_id: key,
                      });
                      props.setShowFilter(true);
                    }}
                  >
                    <FaFilter />
                  </div>
                )}

                <div>{HeadersObject[key].displayName}</div>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {props.headers.map((key, index) => (
            <td
              key={index}
              className="header-total"
              style={{ textAlign: HeadersObject[key].textAlign }}
            >
              {getTotalValue(key, index)}
            </td>
          ))}
        </tr>
        {source.map((row, k) => (
          <tr>
            {props.headers.map((key, index) => (
              <td
                key={index}
                style={{ textAlign: HeadersObject[key].textAlign }}
              >
                {formatData(key, row[key], k)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const mapStatesToProps = (state) => {
  return {
    ...state,
    data: state.responseData,
    headers: state.headers,
    apps: state.apps,
  };
};
export default connect(mapStatesToProps, null)(Index);
