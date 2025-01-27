"use client";

import React, { useState } from "react";
import SearchManufacturer from "./SearchManufacturer";

export default function SearchBar() {
  const [manuFacturer, setManufacturer] = useState("");

  const handleSearch = () => {};

  return (
    <form className="searchbar" onSubmit={handleSearch}>
      <div className="searchbar__item">
        <SearchManufacturer
          manufacturer={manuFacturer}
          setManufacturer={setManufacturer}
        />
      </div>
    </form>
  );
}
