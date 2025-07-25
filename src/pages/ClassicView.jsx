import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import pokemons from '../data/pokemons';
import PokemonCardClassic from '../components/PokemonCardClassic';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';
import MobileMenu from '../components/MobileMenu';
import ViewTypeBar from '../components/ViewTypeBar';
import TypeFilterModal from '../components/TypeFilterModal';
import SortModal from '../components/SortModal';
import user from '../data/users';
import './ClassicView.css';
import { useAuth } from '../context/AuthContext';


const PAGE_SIZE = 10;

const ClassicView = () => {
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Barras y mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [viewType, setViewType] = useState('clasica');

  // Filtros y búsqueda desde query params
  const params = new URLSearchParams(location.search);
  const typesFromQuery = params.get("types") ? params.get("types").split(",") : [];
  const sortType = params.get("sort") || "id-asc";
  const searchValue = params.get("search") || "";

  const [selectedTypes, setSelectedTypes] = useState(typesFromQuery);

  // Filtrado y ordenamiento
  const filteredPokemons = pokemons.filter(p => {
    const matchesType = selectedTypes.length === 0
      ? true
      : p.type.some(type => selectedTypes.includes(type));
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

  // Paginación (opcional, si quieres paginar los resultados)
  // const [page, setPage] = useState(0);
  // const start = page * PAGE_SIZE;
  // const end = start + PAGE_SIZE;
  // const pagePokemons = sortedPokemons.slice(start, end);

  useEffect(() => {
    setSelectedTypes(typesFromQuery);
    // setPage(0); // Si usas paginación
  }, [location.search]);

  // Funciones para las barras y modales (navegación a /clasica)
  const handleApplyFilter = () => {
    setShowTypeFilter(false);
    const params = [];
    if (selectedTypes.length > 0) params.push(`types=${selectedTypes.join(",")}`);
    if (sortType) params.push(`sort=${sortType}`);
    if (searchValue && searchValue.trim() !== "") params.push(`search=${encodeURIComponent(searchValue)}`);
    const query = params.length > 0 ? `?${params.join("&")}` : "";
    navigate(`/clasica${query}`);
  };

  const handleSortSelect = (value) => {
    setShowSortModal(false);
    const params = [];
    if (selectedTypes.length > 0) params.push(`types=${selectedTypes.join(",")}`);
    if (value) params.push(`sort=${value}`);
    if (searchValue && searchValue.trim() !== "") params.push(`search=${encodeURIComponent(searchValue)}`);
    const query = params.length > 0 ? `?${params.join("&")}` : "";
    navigate(`/clasica${query}`);
  };

  const handleSearch = (value) => {
    const params = [];
    if (selectedTypes.length > 0) params.push(`types=${selectedTypes.join(",")}`);
    if (sortType) params.push(`sort=${sortType}`);
    if (value && value.trim() !== "") params.push(`search=${encodeURIComponent(value)}`);
    const query = params.length > 0 ? `?${params.join("&")}` : "";
    navigate(`/clasica${query}`);
  };

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  // --- Tu código original ---
  const getEvolutionLine = (id) => {  
    if ([1, 2, 3].includes(id)) return [1, 2, 3];
    if ([4, 5, 6].includes(id)) return [4, 5, 6];
    if ([7, 8, 9].includes(id)) return [7, 8, 9];
    if ([10, 11, 12].includes(id)) return [10, 11, 12];
    if ([13, 14].includes(id)) return [13, 14];
    return [id];
  };

  const evolutionLine = selectedId ? getEvolutionLine(selectedId) : [];

  return (
    <div className="classic-container">
      {/* BARRAS Y MENÚ */}
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
      {/* FIN BARRAS Y MENÚ */}

      <div className="evolution-bar">
        {evolutionLine.length > 0 ? (
          evolutionLine.map((evoId) => {
            const evo = pokemons.find(p => p.id === evoId);
            return (
              <div key={evoId} className={`evolution-slot ${evo && evo.id === selectedId ? 'selected' : ''}`}>
                {evo && evo.discovered && evo.sprite ? (
                  <img src={evo.sprite} alt={evo.name} />
                ) : (
                  <img src="/assets/pokeball.png" alt="Unknown" />
                )}
              </div>
            );
          })
        ) : (
          [1, 2, 3].map((_, index) => (
            <div key={index} className="evolution-slot">
              <img src="/assets/pokeball.png" alt="Placeholder" />
            </div>
          ))
        )}
      </div>

      <div className="pokedex-layout">
        <div className="rotomdex-area">
          <div className="rotomdex-image">
            <img src="/assets/rotomdex.png" alt="RotomDex" />
          </div>
          <div className="rotomdex-text">¡Escoge uno para ver más información!</div>
        </div>

        <div className="pokemon-list">
          {sortedPokemons.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              onDoubleClick={() => navigate(`/clasica/detalles/${p.id}`)}
            >
              <PokemonCardClassic pokemon={p} />
            </div>
          ))}
        </div>
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

export default ClassicView;