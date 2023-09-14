import { createContext, useCallback, useContext, useEffect, useReducer } from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:7000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
};

const reducer = function (state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: action.payload };
    case "cities/loaded":
      return { ...state, cities: action.payload };

    case "addCity":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "setCurrentCity":
      return { ...state, currentCity: action.payload };
    case "deleteCity":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    default:
      break;
  }
};

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loading", payload: true });

        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        alert("There was an error loading data...");
      } finally {
        dispatch({ type: "loading", payload: false });
      }
    }
    fetchCities();
  }, []);

  const getCity =  useCallback(async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    try {
      dispatch({ type: "loading", payload: true });
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "setCurrentCity", payload: data });
    } catch (error) {
      alert("There was an error loading data...");
    } finally {
      dispatch({ type: "loading", payload: false });
    }
  }, [currentCity.id])

  async function addCity(newCity) {
    try {
      dispatch({ type: "loading", payload: true });
      const res = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      dispatch({ type: "addCity", payload: data });
    } catch (error) {
      alert("There was an error creating city...");
    } finally {
      dispatch({ type: "loading", payload: false });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading", payload: true });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "deleteCity", payload: id });
    } catch (error) {
      alert("There was an error creating city...");
    } finally {
      dispatch({ type: "loading", payload: false });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        addCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside of the CitiesProvider ");

  return context;
}

export { CitiesProvider, useCities };
