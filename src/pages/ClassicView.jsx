import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pokemons from '../data/pokemons';
import PokemonCardClassic from '../components/PokemonCardClassic';
import './ClassicView.css';

const ClassicView = () => {
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const getEvolutionLine = (id) => {  
    if ([1, 2, 3].includes(id)) return [1, 2, 3]; //Esto se deja así, ya que no tenemos un backend que nos diga las evoluciones, en la tercera entrega se corregirá.
    if ([4, 5, 6].includes(id)) return [4, 5, 6];
    if ([7, 8, 9].includes(id)) return [7, 8, 9];
    if ([10, 11, 12].includes(id)) return [10, 11, 12];
    if ([13, 14].includes(id)) return [13, 14];
    return [id];
  };

  const evolutionLine = selectedId ? getEvolutionLine(selectedId) : [];

  return (
    <div className="classic-container">
      <h1 className="classic-title">Pokédex 2.0</h1>

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
          {pokemons.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              onDoubleClick={() => navigate(`/pokemon/${p.id}`)}
            >
              <PokemonCardClassic pokemon={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassicView;