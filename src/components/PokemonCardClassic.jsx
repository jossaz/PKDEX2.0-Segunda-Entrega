import React from 'react';
import './PokemonCardClassic.css';

const PokemonCardClassic = ({ pokemon }) => {
  return (
    <div className={`pokemon-card ${!pokemon.discovered ? 'unknown' : ''}`}>
      <div className="card-left">
        <span className="poke-id">#{pokemon.id.toString().padStart(3, '0')}</span>
        {pokemon.discovered && pokemon.sprite ? (
          <img src={pokemon.sprite} alt={pokemon.name} className="poke-img" />
        ) : (
          <img src="/assets/pokeball.png" alt="pokeball" className="poke-img" />
        )}
      </div>
      <div className="card-right">
        <span className="poke-name">
          {pokemon.discovered && pokemon.name ? pokemon.name : '???'}
        </span>
      </div>
    </div>
  );
};

export default PokemonCardClassic;