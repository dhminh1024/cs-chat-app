import * as types from "../constants/user.constants";
import { conversationTypes } from "../../config/constants";

const globalConversation = {
  _id: conversationTypes.GLOBAL,
  type: conversationTypes.GLOBAL,
};

const initialState = {
  users: [],
  conversations: [globalConversation],
  totalPageNum: 1,
  selectedUser: {},
  loading: false,
};

const userReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_USERS_REQUEST:
    case types.GET_CONVERSATIONS_REQUEST:
      return { ...state, loading: true };

    case types.GET_USERS_SUCCESS:
      return {
        ...state,
        users: payload.users,
        totalPageNum: payload.totalPages,
        loading: false,
      };

    case types.GET_CONVERSATIONS_SUCCESS:
      return {
        ...state,
        conversations: [globalConversation, ...payload.conversations],
        totalPageNum: payload.totalPages,
        loading: false,
      };

    case types.GET_USERS_FAILURE:
    case types.GET_CONVERSATIONS_FAILURE:
      return { ...state, loading: false };

    default:
      return state;
  }
};

export default userReducer;
