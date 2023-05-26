import { useContext, useState } from "react";
import { DataContext } from "../../App";
import "./baskets.css";

export default function Basket({ basketName }) {
  const [openBasket, setOpenBasket] = useState(false);
  const { currentImage, data, setData } = useContext(DataContext);
  const [sortedImages, setSortedImages] = useState([]);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (e.target.className === "basketTitle") {
      e.target.style.boxShadow = "0px -4px 3px #350332";
    }
  };

  function dragEndHandler(e) {
    // e.target.style.boxShadow = 'none'
    e.target.style.opacity = 1;
  }

  const handleDragDrop = (e) => {
    e.preventDefault();
    e.target.style.boxShadow = "none";
    if (currentImage?.keywordName === basketName) {
      setSortedImages([...sortedImages, currentImage]);
      setData(data.filter((photo) => photo.id !== currentImage?.id));
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.target.style.boxShadow = "none";
  };

  return (
    <div
      className="basket"
      key={basketName}
      onDragOver={(e) => handleDragOver(e, basketName)}
      onDragLeave={(e) => handleDragLeave(e)}
      onDragEnd={(e) => dragEndHandler(e)}
      onDrop={(e) => handleDragDrop(e)}
    >
      <div
        className="basketTitle"
        onClick={() => {
          setOpenBasket(!openBasket);
        }}
      >
        {basketName.toUpperCase()}
      </div>
      {openBasket && (
        <div className="sortedImagesContainer">
          {sortedImages.map((image) => {
            return (
              <div key={image.id}>
                <img
                  className="sortedImages"
                  src={image.imageUrl}
                  alt={image.keywordName}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
