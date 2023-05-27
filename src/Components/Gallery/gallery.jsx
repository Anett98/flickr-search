import { useContext } from "react";
import { DataContext } from "../../App";

import "./gallery.css";

export default function Gallary() {
  const { setCurrentImage, data } = useContext(DataContext);

  const dragStartHandler = (e, draggedImage) => {
    e.target.style.opacity = 0.5;
    setCurrentImage(draggedImage);
  };

  const dragEndHandler = (e) => {
    e.target.style.opacity = 1;
  };

  return (
    <div className="imageContainer">
      {data?.length ? (
        data.map((image) => {
          return (
            <img
              key={image.id}
              onDragStart={(e) => dragStartHandler(e, image)}
              onDragEnd={(e) => dragEndHandler(e)}
              draggable={true}
              className="image"
              src={image.imageUrl}
              alt={image.imageTitle}
            />
          );
        })
      ) : (
        <h2>THE GALLERY IS EMPTY</h2>
      )}
    </div>
  );
}
