import React, { useState, useEffect, useRef } from "react";
import defaultImage from "../../assets/defaultImage.jpg";
import dotsMenu from "../../assets/3-dots.svg";
import deleteIcon from "../../assets/delete.svg";
import { useUserActions } from "../../context/UserActionsContext";
import "./ArticleCards.css";

function ArticleAC({ article, category }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const { toggleLike, toggleDislike, toggleSave } = useUserActions();

  // Listen for outside clicks
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownVisible(false);
      }
    };

    // Close if another dropdown is opened
    const handleOtherDropdownOpened = () => {
      setDropdownVisible(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("dropdownOpened", handleOtherDropdownOpened);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("dropdownOpened", handleOtherDropdownOpened);
    };
  }, []);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (!dropdownVisible) {
      // Notify others to close their dropdowns
      document.dispatchEvent(new Event("dropdownOpened"));
    }
    setDropdownVisible((prev) => !prev);
  };

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  const handleRemove = () => {
    if (category === "liked") toggleLike(article);
    else if (category === "disliked") toggleDislike(article);
    else if (category === "saved") toggleSave(article);

    setTimeout(() => setDropdownVisible(false), 0);
  };

  return (
    <div className="card-AC" ref={dropdownRef}>
      {/* Article Image */}
      <a href={article.url} target="_blank" rel="noopener noreferrer">
        <img
          src={article.urlToImage || defaultImage}
          alt={article.title || "Article Image"}
          className="img-AC"
          onError={handleImageError}
        />
      </a>

      {/* Title Section */}
      <div className="content-AC">
        <h3 className="title-AC">{article.title || "Untitled Article"}</h3>
      </div>

      {/* Bottom Section */}
      <div className="AC-container">
        <p className="source-AC">{article.source?.name || "Unknown Source"}</p>

        <div className="AC-dropdown">
          <img
            src={dotsMenu}
            alt="More Options"
            className="more-options"
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <div className="AC-dropdown-menu">
              <button className="AC-dropdown-item" onClick={handleRemove}>
                <img src={deleteIcon} alt="Remove" className="AC-dropdown-icon" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArticleAC;
