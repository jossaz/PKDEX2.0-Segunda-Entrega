import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pokemons from '../data/pokemons';
import './PokemonDetail.css';

const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pokemon = pokemons.find(p => p.id === parseInt(id));

  const query = new URLSearchParams(window.location.search);
const [page, setPage] = useState(parseInt(query.get('page')) || 1);

  const handleBack = () => {
    navigate('/classic');
  };
  const handlePrev = () => {
  if (pokemon.id > 1) {
    navigate(`/pokemon/${pokemon.id - 1}?page=${page}`);
  }
};

const handleNext = () => {
  if (pokemon.id < pokemons.length) {
    navigate(`/pokemon/${pokemon.id + 1}?page=${page}`);
  }
};

  if (!pokemon) {
    return <div className="detail-container">Pokémon no encontrado.</div>;
  }

  return (
    <div className="detail-container">
      <div className="detail-header">Pokédex 2.0</div>
      <button className="detail-back" onClick={handleBack}>
        ← Volver
      </button>

      <div className="detail-content">
        <div className="detail-rotom-container">
          <img src="/assets/rotomdexclassic.png" alt="RotomDex" />
          <div className="detail-overlay">
            <div className="detail-sprite-side">
              <div className="detail-number">N.º {pokemon.dexNumber}</div>
              <div className="detail-name">{pokemon.name || '???'}</div>
              <img
                src={pokemon.sprite || '/assets/pokeball.png'}
                alt={pokemon.name || '???'}
              />
            </div>

            <div className="detail-overlay-info">
                {page === 1 && (
                    <>
                        <div className="detail-category">Pokémon {pokemon.category || '???'}</div>

                        <div className="detail-types">
                            {pokemon.type?.length ? (
                                 pokemon.type.map((t, i) => <span key={i}>{t}</span>)
                            ) : (
                              <span>???</span>
                            )}
                        </div>

                        <div className="detail-description">
                            <p>{pokemon.description || 'Sin descripción.'}</p>
                        </div>
                    </>
                )}

                {page === 2 && (
                    <div className="detail-extra">
                        <p><strong>Altura:</strong> {pokemon.height || '???'}</p>
                        <p><strong>Peso:</strong> {pokemon.weight || '???'}</p>
                        <p><strong>Habilidades:</strong> {pokemon.habilities?.join(', ') || '???'}</p>
                    </div>
                )}

                {page === 3 && (
                    <div className="detail-habitat">
                        <img
                            src="/assets/pokemonmap.png"
                            alt="Mapa de hábitat"
                            className={!pokemon.discovered ? 'map-faded' : ''}
                        />
                        <div className="habitat-label">Hábitat</div>
                    </div>
                )}
            </div>
          </div>

          <div className="detail-page-buttons">
              <button onClick={() => setPage(1)} disabled={page === 1}>1</button>
              <button onClick={() => setPage(2)} disabled={page === 2}>2</button>
              <button onClick={() => setPage(3)} disabled={page === 3}>3</button>
          </div>

          <div className="detail-nav-buttons">
              <button onClick={handlePrev} disabled={pokemon.id === 1}>← Anterior</button>
              <button onClick={handleNext} disabled={pokemon.id === pokemons.length}>Siguiente →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;