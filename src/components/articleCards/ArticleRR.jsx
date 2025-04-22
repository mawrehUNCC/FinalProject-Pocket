import React from "react";
import defaultImage from "../../assets/defaultImage.jpg";
import ArticleButtons from "../articleButtons/articleButtons";
import SaveButton from "../saveButton/SaveButton";
import RRBadge from "../../assets/recommended-badge.svg";
import "./ArticleCards.css";

function ArticleRR({ article }) {
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  return (
    <div className="card-RR">
      {/* ARTICLE CARD WITH RECOMMENDED BADGES */}
      <img
        src={RRBadge}
        alt="Recommended Badge"
        className="badge-RR"
      />
      <a href={article.url} target="_blank" rel="noopener noreferrer">
        <img
          src={article.urlToImage || defaultImage}
          alt={article.title || "Article Image"}
          className="img-RR"
          onError={handleImageError}
        />
      </a>
      <div className="content-RR">
        <p className="source-RR">{article.source?.name || "Unknown Source"}</p>
        <h3 className="title-RR">{article.title || "Untitled Article"}</h3>
        <p className="description-RR">
          {article.description || "No description available."}
        </p>
      </div>
      <div className="actions-container">
        <div className="article-buttons">
          <ArticleButtons article={article} />
        </div>
        <div className="save-button">
          <SaveButton article={article} />
        </div>
      </div>
    </div>
  );
}

export default ArticleRR;
