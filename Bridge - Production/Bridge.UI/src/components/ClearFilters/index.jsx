import React from "react";
import { CLEAR_FILTER } from "../../common/constants";
import "../home/home.scss";
import { useDispatch } from "react-redux";

const ClearFilters = ({ clearAction, fetchAction, params = null }) => {
  const dispatch = useDispatch();

  const handleClearFilter = () => {
    dispatch(clearAction());
    setTimeout(() => {
      if (params) {
        dispatch(fetchAction(params));
      } else {
        dispatch(fetchAction());
      }
    }, 500);
  };

  return (
    <button
      class="text-blue filter tooltip"
      data-tooltip="Clear filters applied on table"
      onClick={handleClearFilter}
    >
      {CLEAR_FILTER}
    </button>
  );
};

export default ClearFilters;
