// gestion du dark mode :

const buttonToggle = document.getElementById("toogle-button");
const buttonToogleThemeCircle = document.getElementById(
  "toogle-button__circle"
);
const body = document.body;
const blocTransition = document.querySelector("#bloc-transition-theme");
const middleBlocTransition = document.querySelector(".div-transition-theme");
const middleBlocTransitionBefore = document.querySelector(".before-div");
const svgDivTransitionThemeBottom = document.querySelector(
  "#svg-div-transition-theme-bottom path"
);
const svgDivTransitionThemeTop = document.querySelector(
  "#svg-div-transition-theme-top path"
);
let isColor1 = true;

buttonToggle.addEventListener("click", () => {
  blocTransition.classList.toggle("bloc-transition-theme-animation");
  body.style.overflowY = "hidden";
  setTimeout(() => {
    body.style.overflowY = "visible";
  }, 1700);
  setTimeout(() => {
    blocTransition.style.display = "block";
    if (isColor1) {
      svgDivTransitionThemeBottom.style.fill = "#f6f8fc";
      svgDivTransitionThemeTop.style.fill = "#f6f8fc";
    } else {
      svgDivTransitionThemeBottom.style.fill = "#242b48";
      svgDivTransitionThemeTop.style.fill = "#242b48";
    }
    isColor1 = !isColor1;
    middleBlocTransitionBefore.classList.toggle("toggleColor");
    middleBlocTransition.classList.toggle("toggleColor");
  }, 2500);
  setTimeout(() => {
    body.classList.toggle("theme-dark");
    body.classList.toggle("theme-light");
  }, 600);
  buttonToogleThemeCircle.classList.toggle("mouv-button");
});
// gestion de l'API pokeAPI :

let allPokemon = [];
let finalyArray = [];
const urlPokeIdSpecies = "https://pokeapi.co/api/v2/pokemon-species/";
const urlPokeIdInfo = "https://pokeapi.co/api/v2/pokemon/";
const loader = document.querySelector(".loader");

const fetchData = async () => {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=1000";
  const result = await fetch(url);
  const data = await result.json();
  const fetchPromises = data.results.map((pokemon) => fetchPokemon(pokemon));
  allPokemon = await Promise.all(fetchPromises);
  finalyArray = allPokemon
    .sort((a, b) => {
      return a.id - b.id;
    })
    .slice(0, 30);
  await addContent(finalyArray);
  loader.style.transform = "translateY(-100vh)";
};
fetchData();

const fetchPokemon = async (pokemon) => {
  let objPokemon = {};
  let namePokemon = pokemon.name;
  let url = pokemon.url;
  const resultFetchPokemon = await fetch(url);
  const data = await resultFetchPokemon.json();
  objPokemon.pic = data.sprites.front_default;
  objPokemon.id = data.id;
  objPokemon.type = data.types[0].type.name;

  const fetchSpeciesPokemon = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${namePokemon}/`
  );
  const dataSpeciesPokemon = await fetchSpeciesPokemon.json();
  objPokemon.name = dataSpeciesPokemon.names[4].name;
  allPokemon.push(objPokemon);
  if (allPokemon.length === 972) {
    finalyArray = allPokemon
      .sort((a, b) => {
        return a.id - b.id;
      })
      .slice(0, 30);
    await addContent(finalyArray);
    loader.style.transform = "translateY(-100vh)";
  }
};

// creation des cartes pokemon :
const typeColors = {
  normal: "#BCBCAC",
  fighting: "#BC5442",
  flying: "#669AFF",
  poison: "#AB549A",
  ground: "#DEBC54",
  rock: "#BCAC66",
  bug: "#ABBC1C",
  ghost: "#6666BC",
  steel: "#ABACBC",
  fire: "#FF421C",
  water: "#2F9AFF",
  grass: "#78CD54",
  electric: "#FFCD30",
  psychic: "#FF549A",
  ice: "#78DEFF",
  dragon: "#7866EF",
  dark: "#785442",
  fairy: "#FFACFF",
  shadow: "#0E2E4C",
};

const container = document.querySelector(".container");
const addContent = async (arr) => {
  for (let i = 0; i < arr.length; i++) {
    const content = document.createElement("div");
    content.className = "content";
    content.innerHTML += `<img src="${arr[i].pic}" alt="image-pokemon">`;
    content.innerHTML += `<span class="id-poke">Nº${arr[i].id}</span>`;
    content.innerHTML += `<h2>${arr[i].name}</h2>`;
    const pokeTypeColor = typeColors[arr[i].type];
    content.innerHTML += `<span style="background:${pokeTypeColor}; color: #ffffff; border-radius: 5px; padding: 3px 5px">${arr[i].type}</span>`;
    content.dataset.pokeId = arr[i].id;
    const handleClickInfoPoke = async (e) => {
      displayInfoPoke();
      const contentPoke = e.currentTarget;
      let pokeId = contentPoke.dataset.pokeId;
      const resultInfoSpeciesPoke = await fetchDataSpeciesPokemonHandleCLick(
        urlPokeIdSpecies,
        pokeId
      );
      const resultInfoPoke = await fetchDataInfoPokemonHandleClick(
        urlPokeIdInfo,
        pokeId
      );
      let urlPictureGifPoke =
        resultInfoPoke.sprites.versions["generation-v"]["black-white"].animated
          .front_default;
      let urlPicturePoke = resultInfoPoke.sprites.front_default;
      const modalImg = document.querySelector(".imgInfoPoke");
      if (resultInfoPoke.id >= 650) {
        modalImg.src = urlPicturePoke;
      } else {
        modalImg.src = urlPictureGifPoke;
      }
      document.getElementById(
        "id-pokemon"
      ).innerHTML = `N°${resultInfoPoke.id}`;
      document.getElementById("name-pokemon").innerHTML =
        resultInfoSpeciesPoke.names[4].name;
      let typePoke = document.getElementById("type-pokemon");
      typePoke.innerHTML = resultInfoPoke.types[0].type.name;
      typePoke.style.background = pokeTypeColor;
      document.getElementById("height-pokemon").innerHTML = `${
        resultInfoPoke.height / 10
      }m`;
      document.getElementById("weight-pokemon").innerHTML = `${
        resultInfoPoke.weight / 10
      }kg`;
      let flavor_text =
        resultInfoSpeciesPoke.flavor_text_entries[0].flavor_text;
      flavor_text = flavor_text.replace(/\f/g, " ").toLowerCase();
      document.getElementById("info-pokemon").innerHTML = flavor_text;
      document.getElementById("abilities-1").innerHTML =
        resultInfoPoke.abilities[0].ability.name;
      document.getElementById("abilities-2").innerHTML =
        resultInfoPoke.abilities[1].ability.name;
      // gestion de chart.js graphique :

      const data = {
        labels: ["CV", "CTA", "DEF", "SPA", "Spd", "SPD"],
        datasets: [
          {
            label: "Stats",
            data: [
              resultInfoPoke.stats[0].base_stat,
              resultInfoPoke.stats[1].base_stat,
              resultInfoPoke.stats[2].base_stat,
              resultInfoPoke.stats[3].base_stat,
              resultInfoPoke.stats[4].base_stat,
              resultInfoPoke.stats[5].base_stat,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 205, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(201, 203, 207, 0.2)",
            ],
            borderColor: [
              "rgb(255, 99, 132)",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
              "rgb(153, 102, 255)",
              "rgb(201, 203, 207)",
            ],
            borderWidth: 1,
          },
        ],
      };

      const options = {
        maintainAspectRatio: false,
        scales: {
          y: {
            stacked: true,
            grid: {
              display: true,
              color: "rgba(255,99,132,0.2)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      };

      new Chart("chart", {
        type: "bar",
        options: options,
        data: data,
      });
    };

    content.addEventListener("click", handleClickInfoPoke);
    container.appendChild(content);
  }
};

// gestion du scroll infini :
function handleScroll() {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= documentHeight) {
    const nextBatch = allPokemon.slice(
      finalyArray.length,
      finalyArray.length + 30
    );
    finalyArray = [...finalyArray, ...nextBatch];
    addContent(nextBatch);
  }
}
window.addEventListener("scroll", handleScroll);

// gestion du click sur content pour afficher les infos du pokemon dans une pop-up :
const fetchDataSpeciesPokemonHandleCLick = async (urlPokeIdSpecies, pokeId) => {
  const result = fetch(urlPokeIdSpecies + pokeId);
  return (await result).json();
};
const fetchDataInfoPokemonHandleClick = async (urlPokeIdPicture, pokeId) => {
  const result = fetch(urlPokeIdPicture + pokeId);
  return (await result).json();
};

const displayInfoPoke = () => {
  const modalAndOverlay = document.querySelector(".div-modal-and-overlay");
  const overlay = document.querySelector(".overlay-modal");
  const close = document.querySelector(".close");
  const body = document.body;
  const button = document.querySelector(".button-scroll-to-top");
  const blocTransitionInfoPoke = document.getElementById(
    "bloc-transition-info-poke"
  );
  setTimeout(() => {
    modalAndOverlay.style.display = "block";
  }, 700);
  body.style.overflowY = "hidden";
  blocTransitionInfoPoke.classList.add("bloc-transition-theme-animation");
  button.style.display = "none";
  close.addEventListener("click", () => {
    setTimeout(() => {
      modalAndOverlay.style.display = "none";
    }, 800);
    setTimeout(() => {
      button.style.display = "flex";
    }, 2500);
    body.style.overflowY = "visible";
    blocTransitionInfoPoke.classList.remove("bloc-transition-theme-animation");
  });
  overlay.addEventListener("click", () => {
    setTimeout(() => {
      modalAndOverlay.style.display = "none";
    }, 800);
    setTimeout(() => {
      button.style.display = "flex";
    }, 2500);
    body.style.overflowY = "visible";
    blocTransitionInfoPoke.classList.remove("bloc-transition-theme-animation");
  });
};

// system de recherche de pokemon :
const searchBar = document.getElementById("search-bar-pokemon");
const resetBouton = document.querySelector(".button-search-pokedex");

function research() {
  const valueInput = searchBar.value.toLowerCase();
  const filteredPokemon = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(valueInput)
  );
  if (filteredPokemon.length === 0) {
    container.innerHTML = `<h2>Aucun pokémon n'a été trouvé</h2>`;
  } else {
    container.innerHTML = "";
  }

  addContent(filteredPokemon);
}
searchBar.addEventListener("keyup", research);

resetBouton.addEventListener("click", (e) => {
  e.preventDefault();
  research();
});
