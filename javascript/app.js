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
  }, 2000);
  setTimeout(() => {
    body.classList.toggle("theme-dark");
    body.classList.toggle("theme-light");
  }, 500);
  buttonToogleThemeCircle.classList.toggle("mouv-button");
});
// gestion de l'API pokeAPI :

let allPokemon = [];
let finalyArray = [];
const urlPokeIdSpecies = "https://pokeapi.co/api/v2/pokemon-species/";
const urlPokeIdPicture = "https://pokeapi.co/api/v2/pokemon/";

const fetchData = async () => {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=500";
  const result = await fetch(url);
  const data = await result.json();
  data.results.forEach((pokemon) => {
    fetchPokemon(pokemon);
  });
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
  if (allPokemon.length === 496) {
    finalyArray = allPokemon.sort((a, b) => {
      return a.id - b.id;
    });
    await addContent(finalyArray);
  }
};

// gestion du scroll infini :

const container = document.querySelector(".container");
const intersection = document.querySelector(".div-intersection");
const loader = document.querySelector(".loader");

const addContent = async (arr) => {
  for (let i = 0; i < 30; i++) {
    const content = document.createElement("div");
    content.className = "content";
    content.innerHTML += `<img src="${arr[i].pic}" alt="image-pokemon">`;
    content.innerHTML += `<h2>${arr[i].name}</h2>`;
    content.dataset.pokeId = arr[i].id;
    const handleClickInfoPoke = async (e) => {
      displayInfoPoke();
      const contentPoke = e.currentTarget;
      let pokeId = contentPoke.dataset.pokeId;
      console.log(pokeId);
      const resultInfoPoke = await fetchDataSpeciesPokemonHandleCLick(
        urlPokeIdSpecies,
        pokeId
      );
      const resultPicturePoke = await fetchDataPicturePokemonHandleClick(
        urlPokeIdPicture,
        pokeId
      );
      pokeId = 0;
      let urlPicturePoke = resultPicturePoke.sprites.front_default;
      console.log(urlPicturePoke);
      const modalImg = document.querySelector(".imgInfoPoke");
      modalImg.src = urlPicturePoke;
    };

    content.addEventListener("click", handleClickInfoPoke);
    container.appendChild(content);
  }
  finalyArray.splice(0, 30);
  loader.style.transform = "translateY(-100vh)";
};

const handleIntersect = (entries) => {
  if (entries[0].isIntersecting) {
    addContent(finalyArray);
  }
};

new IntersectionObserver(handleIntersect).observe(intersection);

// gestion du click sur content pour afficher les infos du pokemon dans une pop-up :
const fetchDataSpeciesPokemonHandleCLick = async (urlPokeIdSpecies, pokeId) => {
  const result = fetch(urlPokeIdSpecies + pokeId);
  return (await result).json();
};
const fetchDataPicturePokemonHandleClick = async (urlPokeIdPicture, pokeId) => {
  const result = fetch(urlPokeIdPicture + pokeId);
  return (await result).json();
};

const displayInfoPoke = () => {
  const modalAndOverlay = document.querySelector(".div-modal-and-overlay");
  const overlay = document.querySelector(".overlay-modal");
  const close = document.querySelector(".close");
  const body = document.body;
  const blocTransitionInfoPoke = document.getElementById(
    "bloc-transition-info-poke"
  );
  setTimeout(() => {
    modalAndOverlay.style.display = "block";
  }, 500);
  body.style.overflowY = "hidden";
  blocTransitionInfoPoke.classList.add("bloc-transition-theme-animation");
  close.addEventListener("click", () => {
    setTimeout(() => {
      modalAndOverlay.style.display = "none";
    }, 500);
    body.style.overflowY = "visible";
    blocTransitionInfoPoke.classList.remove("bloc-transition-theme-animation");
  });
  overlay.addEventListener("click", () => {
    setTimeout(() => {
      modalAndOverlay.style.display = "none";
    }, 500);
    body.style.overflowY = "visible";
    blocTransitionInfoPoke.classList.remove("bloc-transition-theme-animation");
  });
};

// gestion de l'animation bloc info pokemon :
