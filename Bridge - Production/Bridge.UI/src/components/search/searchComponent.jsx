/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalSearch } from "../../redux/actions/managerActions";
import searchIcon from "../../resources/search.png";
import { useNavigate, useLocation } from "react-router-dom";
import loaderImage from "../../resources/Loader.svg";
import * as GLOBAL_CONST from "../../common/constants";

const SearchComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user) || [];
  const employeeId = useSelector((state) => state.user.employeeId);

  useEffect(() => {
    if (location?.pathname === "/search-results") {
      const searchText = localStorage?.getItem("searchInputText");
      setSearchInput(searchText);
    }
  }, [location]);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (searchInput?.trim()?.length > 0) {
      setIsLoading(true);
      try {
        if (user.role === GLOBAL_CONST.EMPLOYEE) {
          const response = await dispatch(
            globalSearch({
              searchElement: searchInput?.trim(),
              isManager: false,
              employeeId,
            })
          );
        } else {
          const response = await dispatch(
            globalSearch({
              searchElement: searchInput?.trim(),
              isManager: true,
              employeeId,
            })
          );
        }
        setIsLoading(false);
        localStorage.setItem("searchInputText", searchInput);
        navigate("/search-results");
      } catch (error) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <form className="searchbox" onSubmit={handleSearch}>
        <input
          type="text"
          className="searchfield"
          placeholder="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="searchbutton">
          {isLoading ? (
            <img className="search loader" src={loaderImage} alt="Loading..." />
          ) : (
            <img src={searchIcon} alt="Search" />
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchComponent;
