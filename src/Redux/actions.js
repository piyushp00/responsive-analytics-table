import axios from "axios";
import { BASE_URL } from "../Assets/constants";

export const applyHeaderFilters = (arr) => {
  return {
    type: "APPLY_HEADER_FILTERS",
    payload: arr,
  };
};
export const getCallFailed = (value) => {
  return {
    type: "GET_CALL_FAILED",
    payload: value,
  };
};

export const getData = (query) => {
  return async (dispatch) => {
    dispatch(getCallFailed(false));
    let url = `${BASE_URL}report?startDate=${query.from}&endDate=${query.to}`;
    try {
      let result = await getCall(url);
      dispatch({
        type: "GET_DATA_SUCCESS",
        payload: await formatData(result),
      });
    } catch {
      dispatch(getCallFailed(true));
    }
  };
};
export const getApps = (query) => {
  return async (dispatch) => {
    let url = `${BASE_URL}apps`;

    let result = await getCall(url);

    dispatch({
      type: "GET_APPS_SUCCESS",
      payload: result,
    });
  };
};

const getCall = async (url) => {
  let item = localStorage.getItem(url);
  let itemJson = JSON.parse(item);

  if (item && itemJson.timestamp - new Date().getTime() < 2000) {
    return itemJson.value;
  } else {
    let result = await axios.get(url);
    localStorage.setItem(
      url,
      JSON.stringify({
        value: result.data.data,
        timestamp: new Date().getTime(),
      })
    );
    return result.data.data;
  }
};
const formatData = (data) => {
  return data.map((el) => {
    el["fillRate"] = parseInt(((el.requests / el.responses) * 100).toFixed(2));
    el["Ctr"] = parseInt(((el.clicks / el.impressions) * 100).toFixed(2));
    return el;
  });
};
