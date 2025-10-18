import React, { useEffect, useState } from 'react'
import { search, findPost } from '../api';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function SearchBar({ onSearchStateChange, onSearchResult }) {
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [postId, setPostId] = useState(null);

  useEffect(() => {
    // Notify parent component about search state
    if (onSearchStateChange) {
      onSearchStateChange(searchValue.trim().length > 0);
    }

    if (!searchValue) {
      setResults([]);
      if (onSearchResult) {
        onSearchResult(null);
      }
      return;
    }

    const fetchContent = async () => {
      try {
        const res = await search(searchValue);
        setResults(res.data);

        if (res.data.length > 0) {
          setPostId(res.data[0]._id); // ✅ first match
        } else {
          if (onSearchResult) {
            onSearchResult(null);
          }
        }
      } catch (err) {
        console.error("Error occurred while searching:", err.message);
        if (onSearchResult) {
          onSearchResult(null);
        }
      }
    };

    const delayBounce = setTimeout(fetchContent, 300);
    return () => clearTimeout(delayBounce);
  }, [searchValue, onSearchStateChange, onSearchResult]);

  useEffect(() => {
    if (!postId) return;

    const findPostById = async () => {
      try {
        const res = await findPost(postId);
        // Pass the result back to parent instead of storing locally
        if (onSearchResult) {
          onSearchResult(res.data);
        }
      } catch (err) {
        console.error("Error while finding post:", err.message);
        if (onSearchResult) {
          onSearchResult(null);
        }
      }
    };

    findPostById();
  }, [postId, onSearchResult]);

  // Only render the search input
  return (
    <div className="relative mt-4 px-4 mr-5">
      <MagnifyingGlassIcon className="absolute left-8 top-1/2 -translate-y-1/2 h-7 w-7"/>
      <input
          className="placeholder:pl- ml-2 pl-15 p-2 border border-gray-300 rounded-full w-full focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none"
        placeholder="Search..."
        value={searchValue}
        type="text"
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;