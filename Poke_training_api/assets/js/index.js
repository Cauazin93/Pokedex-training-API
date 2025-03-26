let currentPage = 1;
const container = document.getElementById("character-container");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const generationFilter = document.getElementById("generationFilter");


const generations = {
    "1": { start: 1, end: 151 },
    "2": { start: 152, end: 251 },
    "3": { start: 252, end: 386 },
    "4": { start: 387, end: 493 },
    "5": { start: 494, end: 649 },
    "6": { start: 650, end: 721 },
    "7": { start: 722, end: 809 },
    "8": { start: 810, end: 905 },
};

async function getCharacters(page, generation = "all") {
    try {
        container.innerHTML = "Carregando...";

        let offset = (page - 1) * 20;
        let limit = 20;
        let url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

        if (generation !== "all") {
            const gen = generations[generation];
            if (gen) {
                url = `https://pokeapi.co/api/v2/pokemon?offset=${gen.start - 1}&limit=${gen.end - gen.start + 1}`;
            }
        }

        const response = await fetch(url);
        const data = await response.json();
        container.innerHTML = "";

        const pokemonPromises = data.results.map(async (pokemon) => {
            const pokemonResponse = await fetch(pokemon.url);
            return pokemonResponse.json();
        });

        const pokemonData = await Promise.all(pokemonPromises);

        pokemonData.forEach(pokemon => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <p>${pokemon.name}</p>
            `;

            card.addEventListener("click", () => {
                window.location.href = `pokedex.html?id=${pokemon.id}`;
            });

            container.appendChild(card);
        });

        prevButton.disabled = currentPage === 1;
        nextButton.disabled = data.next === null;
    } catch (error) {
        console.log("Erro ao carregar Pokémons", error);
        container.innerHTML = "Erro ao carregar Pokémons";
    }
}


generationFilter.addEventListener("change", () => {
    currentPage = 1;
    getCharacters(currentPage, generationFilter.value);
});


prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage -= 1;
        getCharacters(currentPage, generationFilter.value);
    }
});

nextButton.addEventListener("click", () => {
    currentPage++;
    getCharacters(currentPage, generationFilter.value);
});

document.addEventListener("DOMContentLoaded", () => getCharacters(currentPage));
