import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import { useCities } from "../Contexts/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useCities()

  if (isLoading) return <Spinner />;
  const countries = cities.reduce((arr, city) => {
    // if (!arr.map((el) => el.country).includes(city.country)) {
    //   arr.push({ country: city.country, emoji: city.emoji});
    // }
    // return arr;
    if (!arr.map((el) => el.country).includes(city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji }];
    } else {
      return arr;
    }
   
  }, []);


  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key = {country.country}/>
      ))}
    </ul>
  );
}

export default CountryList;
