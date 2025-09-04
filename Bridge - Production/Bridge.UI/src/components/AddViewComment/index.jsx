import React, { useEffect, useState } from "react";
import loaderImage from "../../resources/Loader.svg";
import "../home/home.scss";
import "./AddViewComment.scss";
import {
  ADD_COMMENT,
  COMMENT_FOR_RR,
  COMMENT_ON_RR,
  PLACEHOLDER,
  VIEW_COMMENT,
} from "./const";
import {
  formatDateTime,
  getAging,
  getFormattedDate,
} from "../../common/commonMethods";
import {
  getCommonMethod,
  postCommonMethod,
} from "../../redux/actions/jobActions";
import { ADD_COMMENT_ON_RR, VIEW_COMMENT_OF_RR } from "../../config";

const AddViewComment = ({ rrDetails, onClose, view = false }) => {
  const [isLoading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [viewCommentData, setViewComment] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (view) {
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const fetchComments = async () => {
    try {
      setLoadingData(true);
      const response = await getCommonMethod(`${VIEW_COMMENT_OF_RR}`, {
        rrId: rrDetails?.rrId,
      });
      setViewComment(response?.data);
    } catch (error) {
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (event) => {
    const newText = event.target.value;
    setText(newText);
  };

  const handleAdd = async () => {
    try {
      setLoading(true);
      const user = localStorage.getItem("userFullname");
      const postOption = {
        rrId: rrDetails?.rrId,
        rrNumber: rrDetails?.rrNumber,
        rrComment: text,
        wfmCreatedBy: user,
        wfmCreatedDate: new Date()?.toISOString(),
      };
      const res = await postCommonMethod(ADD_COMMENT_ON_RR, postOption);
      if (res) {
        setLoading(false);
        onClose();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay modal-interview-add-view-comment">
      <div className="modal-content modal-content-add-view-comment">
        <div className="modal-header modal-header-add-view-comment">
          <h2>{view ? VIEW_COMMENT : ADD_COMMENT}</h2>
        </div>

        <div className="modal-cont-add-view-comment">
          <div className="rr-heading">{rrDetails?.rrNumber}</div>
          <div className="rr-container">
            <div className="auto-width rr-detail-wrap">
              <span className="rr-detail">{rrDetails?.projectName}</span>
              <span className="seprator"></span>
              <span className="rr-detail">{`${
                rrDetails?.designation || "N/A"
              }`}</span>
              <span className="seprator"></span>
              <span className="rr-detail">{`Skills: ${
                rrDetails?.primarySkill || "N/A"
              }`}</span>
            </div>
            <div className="auto-width rr-detail-wrap">
              <span className="rr-detail">{`Posted On: ${
                getFormattedDate(rrDetails) || "N/A"
              }`}</span>
              <span className="seprator"></span>
              <span className="rr-detail">{`Aging: ${
                `${getAging(rrDetails)} Days` || "N/A"
              }`}</span>
            </div>
          </div>
        </div>

        {!view && (
          <div className="comment-container">
            <div className="comment-header">{COMMENT_FOR_RR}</div>
            <div className="input-field">
              <textarea
                className="textarea-add-comment"
                value={text}
                onChange={handleChange}
                placeholder={PLACEHOLDER}
                rows={5}
                cols={50}
                maxLength={200}
                disabled={view}
              />
            </div>
          </div>
        )}

        {view && (
          <div className="view-comment-container">
            <div className="comment-header">{COMMENT_ON_RR}</div>
            {!loadingData && viewCommentData?.length > 0 && (
              <div className="view-comment-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Date/Time</th>
                      <th>Comments</th>
                      <th>Commented By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewCommentData?.map((item, index) => {
                      return (
                        <tr key={item?.rrNumber}>
                          <td>{formatDateTime(item?.wfmCreatedDate)}</td>
                          <td style={{ wordBreak: "break-word" }}>
                            {item?.rrComment}
                          </td>
                          <td>{item?.wfmCreatedBy}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {!loadingData && viewCommentData?.length === 0 && (
              <div className="comment-placeholder">No Comments available</div>
            )}
          </div>
        )}

        <div className="modal-buttons">
          {isLoading && (
            <span className="loader">
              <img src={loaderImage} alt="Loading" />
            </span>
          )}
          {!isLoading && (
            <button
              className={`cancel modal-button ${view ? "mr-5" : ""}`}
              onClick={onClose}
            >
              Cancel
            </button>
          )}
          {!isLoading && !view && (
            <button
              className={`modal-button ${text?.length > 0 ? "" : "disabled"}`}
              onClick={handleAdd}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddViewComment;
