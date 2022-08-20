const BASE_URL = "https://dwf-m9.vercel.app/api";

export async function getData(query, filter, page) {
	let datos = await fetch(
		BASE_URL + "/personas?q=" + query + "&filter=" + filter + "&page=" + page,
		{
			method: "GET",
		}
	);
	let array = datos.json();

	return array;
}

export async function addData(persona) {
	let newBody = JSON.stringify(persona);

	let datos = await fetch(BASE_URL + "/personas", {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: newBody,
	});
	return datos;
}
var apiUrl = "https://pokeapi.co/api/v2/";
var input = document.querySelector(".pokemon-input");

export async function getPokemonData(e) {
	console.log("SOY OFFSET", e);
	let lista = [];
	for (let index = e; index < e + 10; index++) {
		let data = await fetch(apiUrl + "pokemon/" + index).then((res) => {
			return res;
		});
		console.log(data);
		let pokemon = await data.json();
		lista.push(pokemon);
	}

	console.log("SOY OFFSET", e);

	console.log("SOY LISTA", lista);
	// let dato = await res.json();
	// console.log("SOY RES", dato);
	return lista;
	// .catch(function (error) {
	// 	pokemonName.innerHTML = "(An error has occurred.)";
	// 	pokemonImage.src = "";
	// });
}
