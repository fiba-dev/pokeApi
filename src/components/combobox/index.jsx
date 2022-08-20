import React, { useState, useEffect } from "react";

import "./index.css";
import { getData, addData } from "../../lib/Api";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { getPokemonData } from "../../lib/Api";
import { InfiniteScrolls } from "../infinite-Scroll";
import swal from "sweetalert";

export function Dropdowns() {
	let filter = [
		{ value: "nombre", filter: "Nombre" },
		{ value: "razón social", filter: "Razón Social" },
		{ value: "nit", filter: "NIT" },
		{ value: "telefono", filter: "Telefono" },
		{ value: "codigo", filter: "Codigo" },
	];

	let [isLoading, setIsLoading] = useState(false);
	let [useFilter = filter[0].value, setFilter] = useState();
	let [results, setResults] = useState([]);
	let [useObject, setObject] = useState({
		nombre: "",
		razonSocial: "",
		nit: "",
		telefono: "",
		codigo: "",
	});
	let [useQuery, setQuery] = useState("");
	let [usepopUp, setPopUp] = useState(false);
	let [useButton, setUseButton] = useState(false);
	let [usePage, setUsePage] = useState(1);
	let [offset, setOffset] = useState(1);
	const { register, handleSubmit } = useForm();
	const variants = {
		open: (height = 1000) => ({
			clipPath: `circle(${height * 2 + 200}px at 40px  40px)`,
			transition: {
				delay: 0.1,
				type: "spring",
				stiffness: 20,
				restDelta: 2,
			},
		}),
		closed: {
			clipPath: "circle(30px at  40px  40px)",
			transition: {
				delay: 0.3,
				type: "spring",
				stiffness: 400,
				damping: 40,
			},
		},
	};
	let of = 1;
	const loadMorePokemons = () => {
		isLoading = true;
		getPokemonData(of).then((res) => {
			let newPokemons = res;

			if (results) {
				console.log("ENTRE A RESULTS ANTES QUE EL OTRO RESULTS");
				setResults((pokemons) => [...pokemons, ...newPokemons]);
				return true;
			}
			console.log("SOY RESULTS ", results, of);
			if (results === undefined) {
				console.log("SOY RESULTS sin nada", results, of);
				setResults(res);
			}
		});
		isLoading = false;
		of += 10;
	};

	const handleScroll = (e) => {
		if (
			window.innerHeight + e.target.documentElement.scrollTop + 1 >=
			e.target.documentElement.scrollHeight
		) {
			loadMorePokemons();
			// aumentarOffset();
		}
	};
	// function aumentarOffset() {
	// 	setOffset((offsets) => offsets + 10);
	// 	console.log("AUMENTANDO OFFSETS", offset);
	// }
	useEffect(() => {
		console.log("SOY USEEFECT", results);

		window.addEventListener("scroll", handleScroll);
	}, []);
	const onSubmit = async (data) => {
		setUsePage(1);
		setQuery(data.q);

		let lista = await getPokemonData(of);
		of += 10;
		console.log("SOYLISTA", lista);
		setResults(lista);
	};
	// async function fetchMorData(query) {
	// 	console.log("SOY USEPAGE Y DEMAS", results, usePage);
	// 	setIsLoading(true);
	// 	getData(query, useFilter, usePage).then((res) => {
	// 		if (results?.length === 0 || results === undefined) {
	// 			console.log("PRIMER IF", results);
	// 			setUseButton(true);
	// 			setResults(res.results);

	// 			return true;
	// 		}
	// 		console.log("Soy res", res);
	// 		if (res.total_pages > usePage) {
	// 			setResults((results) => results.concat(res.results));
	// 			setUsePage((page) => page + 1);
	// 		}

	// 		setIsLoading(false);
	// 	});
	// }
	// useEffect(() => {
	// 	async function fetchData() {
	// 		// You can await here
	// 		// const response = await getPokemonData(useLimit - 20, useLimit);
	// 		// console.log("Soy response", response);
	// 		// setResults((results) => results.concat(response.results));
	// 	}
	// 	fetchData();
	// }, [useLimit]);
	function openPopUp() {
		setObject({ [useFilter]: useQuery });
	}
	async function addObject(params) {
		params.preventDefault();

		let res = await addData({
			nombre: params.target.nombre.value,
			"razón social": params.target["razón social"].value,
			nit: params.target.nit.value,
			telefono: params.target.telefono.value,
			codigo: params.target.codigo.value,
		});
		if (res.status === 200) {
			swal("Datos Agregados Correctamente!!!", "", "success");
			setPopUp(false);
			return true;
		} else {
			swal("UPS!", "Algo paso", "error");
			setPopUp(false);
			return false;
		}
	}
	function handleChange(e) {
		setFilter(e.target.value);
	}

	return (
		<div className={"mainContainer"}>
			<div className="dropdownContainer">
				<form onSubmit={handleSubmit(onSubmit)}>
					<button className="searchButton">QUIERO VER LOS POKEMONES!</button>
				</form>
				{usepopUp && (
					<div className="backgroundForm">
						<motion.form
							animate={usepopUp === true ? "open" : "closed"}
							variants={variants}
							className="formContainer"
							onSubmit={addObject}
						>
							<h3>Crear Registro</h3>
							<input
								className="inputForm"
								placeholder="Nombre"
								id={"nombre"}
								defaultValue={useObject.nombre}
								type={"text"}
							></input>

							<input
								className="inputForm"
								id={"razón social"}
								placeholder="Razón Social"
								defaultValue={useObject.razonSocial}
								type={"text"}
							></input>

							<input
								className="inputForm"
								placeholder="NIT"
								id={"nit"}
								defaultValue={useObject.nit}
								type={"text"}
							></input>

							<input
								className="inputForm"
								placeholder="Telefono"
								id={"telefono"}
								defaultValue={useObject.telefono}
								type={"text"}
							></input>

							<input
								className="inputForm"
								placeholder="Codigo"
								id={"codigo"}
								defaultValue={useObject.codigo}
								type={"text"}
							></input>
							<div className="divFormButtons">
								<button className="botonAñadir"> Añadir</button>
								<button
									type="cerrar"
									className="buttonCerrar"
									onClick={() => {
										setPopUp(false);
									}}
								>
									cancelar
								</button>{" "}
							</div>
						</motion.form>
					</div>
				)}
			</div>
			<div>
				<InfiniteScrolls
					loader={isLoading === true ? "Cargando" : "FIN"}
					className={"resultsContenedor"}
				>
					{results?.map((i) => (
						<div key={i.id} className={"resultsInfo"}>
							{" "}
							<h2>
								<b>{i.name}</b>
							</h2>
							<img
								src={i.sprites.front_default}
								alt={i.name}
								className="pokeImage"
							/>
							<h3>
								<b>{i.types[0].type.name}</b>
							</h3>
						</div>
					))}
				</InfiniteScrolls>
				{/* <InfiniteScrolls
					loader={isLoading === true ? "Cargando" : "FIN"}
					className={"resultsContenedor"}
					next={() => {
						setUsePage((page) => page + 1);
					}}
				>
					{useButton && (
						<button
							className={"buttonAdd"}
							onClick={() => {
								setPopUp(true);
								openPopUp();
							}}
						>
							Add
						</button>
					)}
					{results?.map((i) => (
						<div key={i.nit} className={"resultsInfo"}>
							{" "}
							<p>
								<b>Nombre:</b> {i.nombre}
							</p>
							<p>
								<b>Razón Social:</b> {i["razón social"]}
							</p>
							<p>
								<b>NIT:</b> {i.nit}
							</p>
							<p>
								<b>Telefono: </b>
								{i.telefono}
							</p>
							<p>
								<b>Codigo: </b>
								{i.codigo}
							</p>
						</div>
					))}
				</InfiniteScrolls> */}
			</div>
		</div>
	);
}
