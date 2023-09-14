import { useCities } from "../Contexts/CitiesContext";
import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";

const flagemojiToPNG = (flag) => {
  var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
    .map((char) => String.fromCharCode(char - 127397).toLowerCase())
    .join("");
  return (
    <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
  );
};

const dateFormat = (date) =>
  new Intl.DateTimeFormat(navigator.language, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
function CityItem({ city }) {
  const {
    cityName,
    emoji,
    date,
    id,
    position: { lat, lng },
  } = city;
  const { currentCity, deleteCity } = useCities();

  function handleDeleteCity(e) {
    e.preventDefault()
    deleteCity(id)
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${lat}&lng=${lng}`}
      >
        <span className={styles.emoji}>{flagemojiToPNG(emoji)}</span>
        <h3 className={styles.name}>{cityName} </h3>
        <time className={styles.date}> {dateFormat(date)} </time>
        <button className={styles.deleteBtn} onClick={handleDeleteCity}>&times;</button>
        </Link>
   
    </li>
  );
}

export default CityItem;
// 
