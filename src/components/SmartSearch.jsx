import { useEffect, useMemo, useRef, useState } from "react";

export default function SmartSearch({
  search,
  setSearch,
  sortType,
  setSortType,
  expenses = [],
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [history, setHistory] = useState([]);

  const [isTyping, setIsTyping] = useState(false);

  // AUTO PLACEHOLDER 
  const [placeholderIndex, setPlaceholderIndex] =
    useState(0);

  const [animatedPlaceholder, setAnimatedPlaceholder] =
    useState("Search expenses...");

  const wrapperRef = useRef(null);

  //SEARCH ICON 
  const searchIcon =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Im0yMSAyMS00LjM0LTQuMzQiLz48Y2lyY2xlIGN4PSIxMSIgY3k9IjExIiByPSI4Ii8+PC9zdmc+";

  //LOAD HISTORY 
  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("searchHistory")) ||
      [];

    setHistory(saved);
  }, []);

  // SAVE HISTORY 
  const saveToHistory = (value) => {
    if (!value.trim()) return;

    const updated = [
      value,
      ...history.filter((h) => h !== value),
    ].slice(0, 8);

    setHistory(updated);

    localStorage.setItem(
      "searchHistory",
      JSON.stringify(updated)
    );
  };

  // REMOVE HISTORY 
  const removeHistoryItem = (item) => {
    const updated = history.filter(
      (h) => h !== item
    );

    setHistory(updated);

    localStorage.setItem(
      "searchHistory",
      JSON.stringify(updated)
    );
  };

  // EXPENSE TITLES 
  const expenseTitles = useMemo(() => {
    return [
      ...new Set(
        expenses
          .map((e) => e.title)
          .filter(Boolean)
      ),
    ];
  }, [expenses]);

  // AUTO PLACEHOLDER 
  useEffect(() => {
    if (
      expenseTitles.length === 0 ||
      isTyping ||
      search.trim()
    ) {
      return;
    }

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => {
        return prev === expenseTitles.length - 1
          ? 0
          : prev + 1;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [
    expenseTitles,
    isTyping,
    search,
  ]);

  // UPDATE PLACEHOLDER 
  useEffect(() => {
    if (expenseTitles.length > 0) {
      setAnimatedPlaceholder(
        `Search "${expenseTitles[placeholderIndex]}"`
      );
    } else {
      setAnimatedPlaceholder("Search expenses...");
    }
  }, [placeholderIndex, expenseTitles]);

  // SUGGESTIONS 
  const suggestions = useMemo(() => {
    if (!search.trim()) {
      return expenseTitles.slice(0, 6);
    }

    return expenseTitles
      .filter((title) =>
        title
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .slice(0, 6);
  }, [search, expenseTitles]);

  // CLICK OUTSIDE 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setShowDropdown(false);

        if (!search.trim()) {
          setIsTyping(false);
        }
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [search]);

  //SEARCH CHANGE 
  const handleSearchChange = (value) => {
    setSearch(value);
    setShowDropdown(true);
    setIsTyping(true);

    if (!value.trim()) {
      setIsTyping(false);
    }
  };

  // SEARCH ACTION 
  const handleSearch = () => {
    if (!search.trim()) return;

    saveToHistory(search);

    
      //CLOSE DROPDOWN AFTER SEARCH

    setShowDropdown(false);

    
     // STOP AUTOSCROLL
    

    setIsTyping(true);
  };

  // SELECT ITEM 
  const handleSelect = (value) => {
    setSearch(value);
    saveToHistory(value);
    setShowDropdown(false);
    setIsTyping(true);
  };

  // CLEAR SEARCH 
  const clearSearch = () => {
    setSearch("");
    setIsTyping(false);
  };

  // ENTER 
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative flex items-center gap-3 w-full"
    >
      {/* SEARCH */}
      <div className="relative flex-1">

        {/* SEARCH BUTTON */}
        <button
          onClick={handleSearch}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
        >
          <img
            src={searchIcon}
            alt="search"
            className="w-[18px] h-[18px] opacity-60 hover:opacity-100 transition cursor-pointer"
          />
        </button>

        {/* INPUT */}
        <input
          type="text"
          value={search}
          onChange={(e) =>
            handleSearchChange(e.target.value)
          }
          onFocus={() => {
            setShowDropdown(true);
            setIsTyping(true);
          }}
          onBlur={() => {
            if (!search.trim()) {
              setIsTyping(false);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={animatedPlaceholder}
          className="w-full border border-gray-300 rounded-full pl-12 pr-12 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-300"
        />

        {/* CLEAR BUTTON */}
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-lg"
          >
            ×
          </button>
        )}

        {/* DROPDOWN */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-2xl shadow-lg z-50 max-h-72 overflow-y-auto">

            {/* SUGGESTIONS */}
            {suggestions.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 px-4 pt-3 pb-1">
                  Suggestions
                </p>

                {suggestions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(item)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm transition"
                  >
                    <img
                      src={searchIcon}
                      alt="search"
                      className="w-[16px] h-[16px] opacity-60"
                    />

                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* HISTORY */}
            {history.length > 0 && (
              <div className="border-t">
                <p className="text-xs text-gray-500 px-4 pt-3 pb-1">
                  Recent Searches
                </p>

                {history.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-100"
                  >
                    <div
                      onClick={() => handleSelect(item)}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <img
                        src={searchIcon}
                        alt="search"
                        className="w-[16px] h-[16px] opacity-60"
                      />

                      <span className="text-sm">
                        {item}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        removeHistoryItem(item)
                      }
                      className="text-gray-500 hover:text-red-500 font-bold ml-3 text-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* EMPTY */}
            {suggestions.length === 0 &&
              history.length === 0 && (
                <p className="p-4 text-sm text-gray-500">
                  No searches found
                </p>
              )}
          </div>
        )}
      </div>

      {/* SORT */}
      <select
        value={sortType}
        onChange={(e) =>
          setSortType(e.target.value)
        }
        className="border border-gray-300 rounded-full px-4 py-3 bg-white"
      >
        <option value="">Sort</option>
        <option value="amount">Amount</option>
        <option value="date">Date</option>
        <option value="category">Category</option>
      </select>
    </div>
  );
}