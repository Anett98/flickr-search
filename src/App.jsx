import { useState, createContext } from "react";
import Basket from "./Components/Baskets/baskets";
import Gallary from "./Components/Gallery/gallery";

import "./App.css";

export const DataContext = createContext();

export default function App() {
  const [keyWordsArray, setKeywordsArray] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [keywords, setKeywords] = useState("");
  const [data, setData] = useState([]);

  const handleSearchPhoto = async (e) => {
    e.preventDefault();
    const splitedKeywords = keywords.trim().split(" ");
    setKeywordsArray(splitedKeywords.filter((word,index) => splitedKeywords.indexOf(word) === index));
    const updatedSearchResults = [];
    Promise.all(
      splitedKeywords?.map((keyword) =>
        fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=f620c0943c6d0dd798a333e25cf497a8&tags=${keyword}&license=0&per_page=5&page=1&format=json&nojsoncallback=1`)
      )
    )
      .then((results) => Promise.all(results.map((result) => result.json())))
      .then((searchedDataArr) => {
        let currentKeywordIndex = 0;
        searchedDataArr.forEach((keywordData) => {
          const dataPerKeyword = keywordData.photos.photo
            .slice(0, 5)
            .map((photo) => {
              return {
                id: photo.id + Math.random(),
                imageTitle: photo.title,
                keywordName: splitedKeywords[currentKeywordIndex],
                imageUrl: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
              };
            });
          updatedSearchResults.push(...dataPerKeyword);
          currentKeywordIndex = (currentKeywordIndex + 1) % keywords.length;
        });
        setData(updatedSearchResults);
      });
  };

  return (
    <div className="App">
      <form onSubmit={handleSearchPhoto}>
        <label className="searchText">Search Photo</label>
        <div className="searchContainer">
          <input
            placeholder="Search..."
            className="searchInput"
            type="text"
            value={keywords}
            onChange={(e) => {
              setKeywords(e.target.value);
            }}
          />
          <button disabled={keywords.length === 0}>Search</button>
        </div>
      </form>
      <DataContext.Provider value={{ data, setData, currentImage, setCurrentImage }}>
        <Gallary />
        <div className="basketContainer">
          {keyWordsArray?.length && keyWordsArray?.map((basket) => <Basket basketName={basket} key={basket} />)}
        </div>
      </DataContext.Provider>
    </div>
  );
}