import { useReducer } from "react";

const initialState = {
  isGeoLoading: false,
  error: null,
  position: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "error":
      return { ...state, error: action.payload };
    case "loading":
      return { ...state, isGeoLoading: action.payload };
    case "position":
      return {
        ...state,
        position: { lat: action.payload.lat, lng: action.payload.lng },
      };
    default:
      break;
  }
}

export function useGeolocation(defaultPosition = null) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isGeoLoading, error, position = defaultPosition } = state;

  function getPosition() {
    if (!navigator.geolocation)
      return dispatch({
        type: "error",
        payload: "Your browser doesn't support geolocation",
      });

    dispatch({ type: "loading", payload: true });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        dispatch({
          type: "position",
          payload: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        });
        dispatch({ type: "loading", payload: false });
      },
      (error) => {
        dispatch({
          type: "error",
          payload: error.message,
        });
        dispatch({ type: "loading", payload: false });
      }
    );
  }

  return {isGeoLoading, error, position, getPosition}
}
