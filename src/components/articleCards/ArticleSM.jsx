import React from "react";
import defaultImage from "../../assets/defaultImage.jpg";
import SaveButton from "../saveButton/SaveButton";
import "./ArticleCards.css";

/**
 * A small article card component that displays an article's image, title, description, source, 
 * and a save button. Provides a fallback image if the article image fails to load.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.article - The article data to display.
 * @param {string} [props.article.url] - The URL of the article.
 * @param {string} [props.article.urlToImage] - The URL of the article's image.
 * @param {string} [props.article.title] - The title of the article.
 * @param {string} [props.article.description] - The description of the article.
 * @param {Object} [props.article.source] - The source of the article.
 * @param {string} [props.article.source.name] - The name of the article's source.
 * @returns {JSX.Element} A small article card component.
 */
function ArticleSM({ article }) {
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };
  return (
    <div className="card-SM">
      {/* SMALL ARTICLE CARD */}
      <a href={article.url} target="_blank" rel="noopener noreferrer">
        <img
          src={article.urlToImage || defaultImage}
          alt={article.title || "Article Image"}
          className="img-SM"
          onError={handleImageError}
        />
      </a>
      <div className="content-SM">
        <h3 className="title-SM">{article.title || "Untitled Article"}</h3>
        <p className="description-SM">
          {article.description || "No description available."}
        </p>
      </div>
      <div className="actions-container">
        <p className="source-SM">{article.source?.name || "Unknown Source"}</p>
        <div className="save-button">
          <SaveButton article={article} />
        </div>
      </div>
    </div>
  );
}

export default ArticleSM;
