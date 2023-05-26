import { useState, createContext } from "react";
import Basket from "./Components/Baskets/baskets";
import "./App.css";

export const DataContext = createContext();

function App() {
  const [keywords, setKeywords] = useState("");
  const keyWordsArray = keywords.split(" ");
  const [data, setData] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);

  const handleSearchPhoto = async (e) => {
    e.preventDefault();
    const updatedSearchResults = [];
    Promise.all(
      keyWordsArray.map((keyword) =>
        fetch(
          `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=f620c0943c6d0dd798a333e25cf497a8&tags=${keyword}&license=0&per_page=5&page=1&format=json&nojsoncallback=1`
        )
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
                id: photo.id,
                imageTitle: photo.title,
                keywordName: keyWordsArray[currentKeywordIndex],
                imageUrl: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
              };
            });
          updatedSearchResults.push(...dataPerKeyword);
          currentKeywordIndex = (currentKeywordIndex + 1) % keywords.length;
        });
        setData(updatedSearchResults);
      });
  };

  const handleDragStart = (e, draggedImage) => {
    e.target.style.opacity = 0.5;
    setCurrentImage(draggedImage);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = 1;
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
            onChange={(e) => setKeywords(e.target.value)}
          />
          <button disabled={keywords.length === 0}>Search</button>
        </div>
      </form>
      <DataContext.Provider value={{ data, currentImage, setData }}>
        <div className="imageContainer">
          {data.map((image) => {
            return (
              <img
                key={image.id}
                onDragStart={(e) => handleDragStart(e, image)}
                onDragEnd={(e) => handleDragEnd(e)}
                draggable={true}
                className="image"
                src={image.imageUrl}
                alt={image.imageTitle}
              />
            );
          })}
        </div>
        <div className="basketContainer">
          {keyWordsArray.map((basket) => (
            <Basket basketName={basket} key={basket} />
          ))}
        </div>
      </DataContext.Provider>
    </div>
  );
}

export default App;
