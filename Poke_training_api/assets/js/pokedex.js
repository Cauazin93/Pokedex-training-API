let currentPokeId = 1;

async function fetchdata(pokemonId = null) {
    try {
        let pokeName = document.getElementById("pokeName").value.toLowerCase();
        if (pokemonId) {
            pokeName = pokemonId;
        }
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
        if (!response.ok) {
            throw new Error("Pokémon não encontrado");
        }
        const data = await response.json();
        const pokePngNormal = data.sprites.front_default;
        const pokePng = data.sprites.front_shiny;
        const pokeImgNormal = document.getElementById("pokePngNormal");
        const pokeImg = document.getElementById("pokePng");
        const pokeInfo = document.getElementById("pokemonInfo");

        pokeImgNormal.src = pokePngNormal;
        pokeImgNormal.style.display = "block";
        pokeImg.src = pokePng;
        pokeImg.style.display = "block";

        currentPokeId = data.id;

        pokeInfo.innerHTML = `
        <p><strong>Nome:</strong> ${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</p>
        <p><strong>ID:</strong> ${data.id}</p>
        <p><strong>Tipo:</strong> ${data.types.map(type => type.type.name).join(", ")}</p>
        <p><strong>Peso:</strong> ${data.weight / 10} kg</p>
        <p><strong>Altura:</strong> ${data.height / 10} m</p>
    `;

    } catch (error) {
        console.log("Erro ao carregar Pokémon", error);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get("id");

    if (pokemonId) {
        fetchdata(pokemonId);
    }
});


document.getElementById("backButton").addEventListener("click", () => {
    window.location.href = "index.html"; 
});

function nextPokemon() {
    currentPokeId++;
    fetchdata(currentPokeId);
}

function prevPokemon() {
    if (currentPokeId > 1) {
        currentPokeId--;
        fetchdata(currentPokeId);
    }
}
