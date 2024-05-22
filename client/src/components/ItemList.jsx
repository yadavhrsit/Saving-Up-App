import React from "react";
import ItemCard from "./ItemCard";

const ItemList = ({ items, onDelete, onContribute }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
      {items.map((item) => (
        <ItemCard
          key={item._id}
          item={item}
          onDelete={onDelete}
          onContribute={onContribute}
        />
      ))}
    </div>
  );
};

export default ItemList;
