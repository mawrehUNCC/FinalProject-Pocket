import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

// Cache configuration
const CACHE_CONFIG = {
  EXPIRY_TIME: 5 * 60 * 1000, // 5 minutes in milliseconds
  MAX_CACHE_SIZE: 50, // Maximum number of cached responses
};

// Cache utility functions
const cacheUtils = {
  getCacheKey: (params) => {
    return `news_${JSON.stringify(params)}`;
  },

  getCachedData: (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_CONFIG.EXPIRY_TIME) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  },

  setCachedData: (key, data) => {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));

    // Clean up old cache entries if we exceed the size limit
    const cacheKeys = Object.keys(localStorage).filter(key => key.startsWith('news_'));
    if (cacheKeys.length > CACHE_CONFIG.MAX_CACHE_SIZE) {
      const oldestKey = cacheKeys.reduce((oldest, current) => {
        const oldestEntry = JSON.parse(localStorage.getItem(oldest));
        const currentEntry = JSON.parse(localStorage.getItem(current));
        return oldestEntry.timestamp < currentEntry.timestamp ? oldest : current;
      });
      localStorage.removeItem(oldestKey);
    }
  },

  clearCache: () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith('news_'))
      .forEach(key => localStorage.removeItem(key));
  }
};

// Create the context
const NewsContext = createContext(null);

// Create the provider component
const NewsProvider = ({ children }) => {
  const API_KEY = "bcf3e0b3f13a43d996b2820f30ffc098";
  const BASE_URL = "https://newsapi.org/v2";

  const [articles, setArticles] = useState([]);
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [worthyArticles, setWorthyArticles] = useState([]);
  const [pocketHits, setPocketHits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [query, setQuery] = useState("");
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const RATE_LIMIT_DELAY = 1000; // 1 second between requests

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchNews = async () => {
    console.log('Starting fetchNews...');
    setLoading(true);
    setError(null);

    try {
      // Check if we need to wait due to rate limiting
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchTime;
      if (timeSinceLastFetch < RATE_LIMIT_DELAY) {
        await wait(RATE_LIMIT_DELAY - timeSinceLastFetch);
      }

      // Create cache key from request parameters
      const params = {
        apiKey: API_KEY,
        country: "us",
        page: currentPage,
        pageSize: 20,
        totalResults: 20,
        q: query,
      };
      console.log('Fetching with params:', params);
      const cacheKey = cacheUtils.getCacheKey(params);

      // Check cache first
      const cachedData = cacheUtils.getCachedData(cacheKey);
      if (cachedData) {
        console.log('Using cached data');
        setArticles(cachedData.articles);
        setRecommendedArticles(cachedData.articles.slice(0, 3));
        setPopularArticles(cachedData.articles.slice(3, 6));
        setWorthyArticles(cachedData.articles.slice(8, Math.min(14, cachedData.articles.length)));
        setPocketHits(cachedData.articles.slice(0, 12));
        setTotalResults(cachedData.totalResults);
        setLoading(false);
        return;
      }

      console.log('Making API call...');
      const response = await axios.get(`${BASE_URL}/top-headlines`, {
        params: {
          ...params,
          id: `${Date.now()}-${Math.random()}`,
        },
        headers: {
          'X-Api-Key': API_KEY
        }
      });
      console.log('API response:', response.data);

      if (!response.data || !response.data.articles) {
        throw new Error('Invalid API response format');
      }

      setLastFetchTime(Date.now());

      const allArticles = response.data.articles || [];

      if (allArticles.length === 0) {
        console.log('No articles found');
        setError("No articles found.");
        return;
      }

      // Cache the successful response
      cacheUtils.setCachedData(cacheKey, {
        articles: allArticles,
        totalResults: response.data.totalResults,
      });

      setArticles(allArticles);
      setTotalResults(response.data.totalResults);

      // Categorize articles
      setRecommendedArticles(allArticles.slice(0, 3));
      setPopularArticles(allArticles.slice(3, 6));
      setWorthyArticles(allArticles.slice(8, Math.min(14, allArticles.length)));
      setPocketHits(allArticles.slice(0, 12)); // Get first 12 articles for pocket hits
      console.log('Articles set successfully');
    } catch (error) {
      console.error('Error fetching news:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });

      let errorMessage = "Could not fetch articles, please try again later.";

      if (error.response) {
        switch (error.response.status) {
          case 429:
            errorMessage = "You've reached the rate limit. Please wait a moment before trying again.";
            await wait(RATE_LIMIT_DELAY * 2);
            break;
          case 401:
            errorMessage = "API key is invalid or expired.";
            break;
          case 404:
            errorMessage = "No articles found.";
            break;
          default:
            errorMessage = `Error: ${error.response.status} - ${error.message}`;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    console.log('NewsProvider mounted, fetching initial data...');
    fetchNews();
  }, []);

  const value = {
    articles,
    recommendedArticles,
    popularArticles,
    worthyArticles,
    pocketHits,
    loading,
    error,
    fetchNews,
    currentPage,
    setCurrentPage,
    totalResults,
    setQuery,
    clearCache: cacheUtils.clearCache,
  };

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  );
};

// Create the hook
function useNewsContext() {
  const context = useContext(NewsContext);
  if (context === null) {
    throw new Error('useNewsContext must be used within a NewsProvider');
  }
  return context;
}

export { NewsProvider, useNewsContext };