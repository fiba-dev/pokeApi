import React, { useState, useEffect } from "react";
import { Zoom } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import "./index.css";
import { getData, addData, getOnePokemon } from "../../lib/Api";
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
		name: "",
		img: [],
		tipi: "",
	});
	let [useQuery, setQuery] = useState("");
	let [usepopUp, setPopUp] = useState(false);
	let pokemon = {};

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
		setQuery(data.q);

		let lista = await getPokemonData(of);
		of += 10;
		console.log("SOYLISTA", lista);
		setResults(lista);
	};

	function openPopUp() {
		setObject({ [useFilter]: useQuery });
	}

	function handleChange(e) {
		setFilter(e.target.value);
	}
	async function mostrarCard(e) {
		console.log("ESTOY POR MOSTRAR", e);
		let dato = await getOnePokemon(e);
		setPopUp(true);
		console.log("SOY EL POKEMON", dato);
		setObject({
			name: dato.name,
			tipo: dato.types[0].type.name,
			img: [dato.sprites.front_default, dato.sprites.back_default],
		});
	}
	return (
		<div className={"mainContainer"}>
			<div className="dropdownContainer">
				<form onSubmit={handleSubmit(onSubmit)}>
					<button className="searchButton">QUIERO VER LOS POKEMONES!</button>
				</form>
				{usepopUp && (
					<div className="backgroundForm">
						<motion.div
							animate={usepopUp === true ? "open" : "closed"}
							variants={variants}
							className="formContainer"
						>
							<h2>{useObject.name}</h2>
							<Zoom
								indicators
								onChange={function noRefCheck() {}}
								className="imagenes"
								scale={1.4}
							>
								<img
									src={useObject.img[0]}
									alt={"pokeimage"}
									className="each-slide imagenes"
								/>
								<img
									src={useObject.img[1]}
									alt={"pokeimage"}
									className="each-slide imagenes"
								/>
							</Zoom>
							<h3> {useObject.tipo} </h3>

							<div className="divFormButtons">
								<button
									type="cerrar"
									className="buttonCerrar"
									onClick={() => {
										setPopUp(false);
									}}
								>
									Cerrar
								</button>{" "}
							</div>
						</motion.div>
					</div>
				)}
			</div>
			<div>
				<InfiniteScrolls
					loader={isLoading === true ? "Cargando" : "FIN"}
					className={"resultsContenedor"}
				>
					{results?.map((i) => (
						<div
							key={i.id}
							className={"resultsInfo"}
							onClick={() => mostrarCard(i.id)}
						>
							{" "}
							<h2>
								<b>{i.name}</b>
							</h2>
							<img
								src={i.sprites.front_default}
								alt={i.name}
								className="imagenes"
							/>
							{/* <img
								src={i.sprites.front_default}
								alt={i.name}
								className="pokeImage"
							/> */}
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
