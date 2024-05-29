import React, { useState } from "react";
import ItemCard from "./ItemCard";

const ItemList = ({
  items,
  onDelete,
  onContribute,
  onToggleFavorite,
  setUpdateId,
  setShowModalEdit,
}) => {
  const [itemList, setItemList] = useState(items);

  const moveCard = (fromId, toId) => {
    const fromIndex = itemList.findIndex((item) => item._id === fromId);
    const toIndex = itemList.findIndex((item) => item._id === toId);
    const updatedList = [...itemList];
    const [movedItem] = updatedList.splice(fromIndex, 1);
    updatedList.splice(toIndex, 0, movedItem);
    setItemList(updatedList);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
      {itemList.map((item) => (
        <ItemCard
          key={item._id}
          item={item}
          moveCard={moveCard}
          onDelete={onDelete}
          onContribute={onContribute}
          onToggleFavorite={onToggleFavorite}
          setUpdateId={setUpdateId}
          setShowModalEdit={setShowModalEdit}
        />
      ))}
    </div>
  );
};

export default ItemList;
