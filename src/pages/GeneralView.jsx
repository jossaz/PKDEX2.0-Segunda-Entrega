import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PokemonCardGeneral from "../components/PokemonCardGeneral";
import pokemons from '../data/pokemons';
import TypeFilterModal from "../components/TypeFilterModal";
import SortModal from "../components/SortModal";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import MobileMenu from "../components/MobileMenu";
import ViewTypeBar from "../components/ViewTypeBar";
import user from '../data/users';
import "./GeneralView.css";
import { useAuth } from '../context/AuthContext';

const PAGE_SIZE = 10;

const GeneralView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const typesFromQuery = params.get("types") ? params.get("types").split(",") : [];
  const sortType = params.get("sort") || "id-asc";
  const searchValue = params.get("search") || "";

  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState(typesFromQuery);

  // Barras y mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [viewType, setViewType] = useState('general');

  // Filtros y ordenamiento
  const filteredPokemons = pokemons.filter(p => {
    const matchesType = typesFromQuery.length === 0
      ? true
      : p.type.some(type => typesFromQuery.includes(type));
    const matchesSearch = searchValue.trim() === ""
      ? true
      : (p.name && p.name.toLowerCase().includes(searchValue.trim().toLowerCase()));
    return matchesType && matchesSearch;
  });
  const sortedPokemons = [...filteredPokemons].sort((a, b) => {
    const aInvalid = !a.name || a.name.trim() === "" || a.dexNumber === "000" || a.id === "000";
    const bInvalid = !b.name || b.name.trim() === "" || b.dexNumber === "000" || b.id === "000";
    if (aInvalid && bInvalid) return 0;
    if (aInvalid) return 1;
    if (bInvalid) return -1;

    switch (sortType) {
      case "id-asc":
        return a.id - b.id;
      case "id-desc":
        return b.id - a.id;
      case "name-asc":
        return (a.name || "").localeCompare(b.name || "");
      case "name-desc":
        return (b.name || "").localeCompare(a.name || "");
      default:
        return 0;
    }
  });

  // Paginación
  const [page, setPage] = useState(0);
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pagePokemons = sortedPokemons.slice(start, end);

  const hasNext = end < sortedPokemons.length;
  const hasPrev = page > 0;

  const typesFromQueryKey = typesFromQuery.join(",");

  useEffect(() => {
    setPage(0);
  }, [typesFromQueryKey, sortType]);

  // Funciones para las barras y modales
  const handleApplyFilter = () => {
    setShowTypeFilter(false);
    const params = [];
    if (selectedTypes.length > 0) params.push(`types=${selectedTypes.join(",")}`);
    if (sortType) params.push(`sort=${sortType}`);
    const query = params.length > 0 ? `?${params.join("&")}` : "";
    navigate(`/general${query}`);
  };

  const handleSortSelect = (value) => {
    setShowSortModal(false);
    const params = [];
    if (typesFromQuery.length > 0) params.push(`types=${typesFromQuery.join(",")}`);
    if (value) params.push(`sort=${value}`);
    if (searchValue && searchValue.trim() !== "") params.push(`search=${encodeURIComponent(searchValue)}`);
    const query = params.length > 0 ? `?${params.join("&")}` : "";
    navigate(`/general${query}`);
  };

  const handleSearch = (value) => {
    const params = [];
    if (selectedTypes.length > 0) params.push(`types=${selectedTypes.join(",")}`);
    if (sortType) params.push(`sort=${sortType}`);
    if (value && value.trim() !== "") params.push(`search=${encodeURIComponent(value)}`);
    const query = params.length > 0 ? `?${params.join("&")}` : "";
    navigate(`/general${query}`);
  };

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <div className="regular-view-container">
      <Header
        onMenuClick={() => setMobileMenuOpen(true)}
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLogin}
        onLogoutClick={handleLogout}
        username={user.username}
        pokedexCount={user.pokemons.length}
        onFilter={() => setShowTypeFilter(true)}
      />
      <SearchBar
        onFilter={() => setShowTypeFilter(true)}
        onSortClick={() => setShowSortModal(true)}
        onSearch={handleSearch}
      />
      <ViewTypeBar viewType={viewType} onChange={setViewType} />
      {mobileMenuOpen && (
        <MobileMenu
          isLoggedIn={isLoggedIn}
          userName={user.username}
          pokedexCount={user.pokemons.length}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onSearch={handleSearch}
          onFilter={() => setShowTypeFilter(true)}
          onSort={() => setShowSortModal(true)}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
      <div className="regular-view-cards-area">
        <div className="regular-view-cards-grid">
          {pagePokemons.map((p) => (
            <div
              key={p.id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/general/detalles/${p.id}`)}
            >
              <PokemonCardGeneral pokemon={p} />
            </div>
          ))}
        </div>
        {(hasPrev || hasNext) && (
          <div className="arrows-container">
            {hasPrev && (
              <button
                className="arrow-btn prev-arrow"
                onClick={() => setPage(page - 1)}
              >
              </button>
            )}
            {hasNext && (
              <button
                className="arrow-btn next-arrow"
                onClick={() => setPage(page + 1)}
              >
              </button>
            )}
          </div>
        )}
      </div>
      {showTypeFilter && (
        <TypeFilterModal
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          onApply={handleApplyFilter}
          onClose={() => setShowTypeFilter(false)}
        />
      )}
      {showSortModal && (
        <SortModal
          show={showSortModal}
          sortType={sortType}
          onSelect={handleSortSelect}
          onClose={() => setShowSortModal(false)}
        />
      )}
    </div>
  );
};

export default GeneralView;