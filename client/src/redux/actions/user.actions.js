import * as types from "../constants/user.constants";
import api from "../../apiService";

const usersRequest = (
  pageNum = 1,
  limit = 10,
  query = null,
  sortBy = null
) => async (dispatch) => {
  dispatch({ type: types.GET_USERS_REQUEST, payload: null });
  try {
    let queryString = "";
    if (query) {
      queryString = `&name[$regex]=${query}&name[$options]=i`;
    }
    let sortByString = "";
    if (sortBy?.key) {
      sortByString = `&sortBy[${sortBy.key}]=${sortBy.ascending}`;
    }
    const res = await api.get(
      `/users?page=${pageNum}&limit=${limit}${queryString}${sortByString}`
    );
    dispatch({
      type: types.GET_USERS_SUCCESS,
      payload: res.data.data,
    });
  } catch (error) {
    dispatch({ type: types.GET_USERS_FAILURE, payload: error });
  }
};

const conversationsRequest = (pageNum = 1, limit = 10, query = null) => async (
  dispatch
) => {
  dispatch({ type: types.GET_CONVERSATIONS_REQUEST, payload: null });
  try {
    let queryString = "";
    if (query) {
      queryString = `&name=${query}`;
    }
    const res = await api.get(
      `/conversations?page=${pageNum}&limit=${limit}${queryString}`
    );
    dispatch({
      type: types.GET_CONVERSATIONS_SUCCESS,
      payload: res.data.data,
    });
  } catch (error) {
    dispatch({ type: types.GET_CONVERSATIONS_FAILURE, payload: error });
  }
};

const userActions = {
  usersRequest,
  conversationsRequest,
};
export default userActions;
