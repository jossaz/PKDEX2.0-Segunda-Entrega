import React from "react";
import "./PokemonCardGeneral.css";

const PokemonCardGeneral = ({ pokemon }) => {
  const types = pokemon.type || [];

  return (
    <div className="pokemon-card-regular">
      <div className="poke-number">#{pokemon.id}</div>
      <img className="poke-img" src={pokemon.sprite} alt={pokemon.name} />
      <div className="poke-name">{pokemon.name}</div>
      <div className="poke-types">
        {types.map((type) => (
          <div key={type} className={`poke-type ${type}`}>
            {type}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonCardGeneral;