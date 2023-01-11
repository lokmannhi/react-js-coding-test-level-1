import "./App.css";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import Modal from "react-modal";
import { NavLink } from "react-router-dom";

function PokeDex() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPageUrl, setCurrentPageUrl] = useState(
    `https://pokeapi.co/api/v2/pokemon`
  );
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();
  const [sortType, setSortType] = useState([]);

  useEffect(() => {
    axios
      .get(currentPageUrl)
      .then((response) => {
        if (sortType === "name") {
          const sorted = response.data.results.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setPokemons(sorted);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setPokemons(response.data.results);
          setNextPageUrl(response.data.next);
          setPrevPageUrl(response.data.previous);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentPageUrl, sortType]);

  const handleSearch = (event) => {
    let { value } = event.target;
    setSearch(value);
  };

  function goToNextPage() {
    setCurrentPageUrl(nextPageUrl);
  }

  function goToPrevPage() {
    setCurrentPageUrl(prevPageUrl);
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "black",
      color: "white",
    },
    overlay: { backgroundColor: "grey" },
  };

  if (!isLoading && pokemons.length === 0) {
    return (
      <div>
        <header className="App-header">
          <h1>Welcome to pokedex !</h1>
          <h2>Requirement:</h2>
          <ul>
            <li>
              Call this api:https://pokeapi.co/api/v2/pokemon to get pokedex,
              and show a list of pokemon name.
            </li>
            <li>Implement React Loading and show it during API call</li>
            <li>
              when hover on the list item , change the item color to yellow.
            </li>
            <li>when clicked the list item, show the modal below</li>
            <li>
              Add a search bar on top of the bar for searching, search will run
              on keyup event
            </li>
            <li>Implement sorting and pagingation</li>
            <li>Commit your codes after done</li>
            <li>
              If you do more than expected (E.g redesign the page / create a
              chat feature at the bottom right). it would be good.
            </li>
          </ul>
        </header>
      </div>
    );
  }

  return (
    <div>
      <header className="App-header">
        {isLoading ? (
          <>
            <div className="App">
              <header className="App-header">
                <b>
                  <ReactLoading />
                </b>
              </header>
            </div>
          </>
        ) : (
          <>
            <div className="container">
              <h1>Welcome to pokedex !</h1>
              <div className="search_filter">
                <input
                  type="text"
                  value={search}
                  placeholder="search...."
                  onChange={handleSearch}
                  className="search_bar"
                />
                <select
                  value={pokemons.name}
                  onChange={(e) => setSortType(e.target.value)}
                >
                  <option value="default">default</option>
                  <option value="name">By Name (A-Z)</option>
                </select>
              </div>
              {pokemons.length > 0 && (
                <div>
                  {pokemons
                    .filter((item) =>
                      item.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="card"
                          onClick={() => setPokemonDetail(item)}
                        >
                          <NavLink
                            to={`/pokedex/${item.name}`}
                            style={{ textDecoration: "none" }}
                          >
                            <h6>{item.name}</h6>
                          </NavLink>
                        </div>
                      );
                    })}
                </div>
              )}
              <div className="pagination_button">
                <button type="btn" onClick={goToPrevPage}>
                  Previous
                </button>
                <button type="btn" onClick={goToNextPage}>
                  next
                </button>
              </div>
            </div>
          </>
        )}
      </header>
      {pokemonDetail && (
        <Modal
          isOpen={pokemonDetail}
          contentLabel={pokemonDetail?.name || ""}
          onRequestClose={() => {
            setPokemonDetail(null);
          }}
          style={customStyles}
        >
          <div>
            Requirement:
            <ul>
              <li>show the sprites front_default as the pokemon image</li>
              <li>
                Show the stats details - only stat.name and base_stat is
                required in tabular format
              </li>
              <li>Create a bar chart based on the stats above</li>
              <li>
                Create a buttton to download the information generated in this
                modal as pdf. (images and chart must be included)
              </li>
            </ul>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PokeDex;
