import React from 'react'
import { db, auth, storage } from '../firebase'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Plants = () => {
    //listado de plantas y lugares
    const [list, setList] = React.useState([]);
    const [items, setItems] = React.useState([]);
    const [plants, setPlants] = React.useState([]);
    const [places, setPlaces] = React.useState([]);

    //estados de control
    const [loading, setLoading] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [marcadorVisible,setMarcadorVisible] = React.useState(true);

    //estados para inputs
    const [radioTodos, setRadioTodos] = React.useState(true);
    const [radioPlantas, setRadioPlantas] = React.useState(false);
    const [radioLugares, setRadioLugares] = React.useState(false);
    const [busqueda, setBusqueda] = React.useState("");
    const [lat, setLat] = React.useState();
    const [long, setLong] = React.useState();
    const [LatLng, setLatLng] = React.useState();

    const [id, setID] = React.useState("");
    const [name, setName] = React.useState("");
    const [type, setType] = React.useState("");
    const [scientificName, setScientificName] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [terrace, setTerrace] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [position, setPosition] = React.useState([]);
    const [images, setImages] = React.useState([]);
    const [audio, setAudio] = React.useState(null);



    const obtenerPlantas = async () => {

        try {
            const data = await db.collection('plants').get();
            const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setList(arrayData);
            setItems(arrayData);
            setPlants(arrayData.filter(pl => pl.type === "plant"));
            setPlaces(arrayData.filter(pl => pl.type === "place"));

        } catch (error) {
            console.log(error);
        }

    }

    React.useEffect(() => {
        obtenerPlantas()
        document.getElementById("inlineRadio1").checked = true;
    }, []);

    //Funciones asincronas => Consulta a Firebase

    const nuevoItem = async (e) => {
        // {
        //     location: new db.GeoPoint(latitude, longitude)
        // }
    }

    const eliminarItem = async (id) => {
    }

    const modificarItem = async (e) => {
    }

    //Funciones auxiliares => Formateo y Frontend
    const loadModalModificarItem = (id) => {
        setEdit(true);
        const eventoInfo = list.find(i => i.id === id);
    }

    const cancelarEdit = () => {
        setEdit(false);
        setName('');
        setDescription('');
        setImages(null);
        setError(null);
        setLong(0);
        setLat(0);
        const ll = new window.google.maps.LatLng(lat, long)
        setLatLng(ll)
        setMarcadorVisible(false)

        document.getElementById("formularioitems").reset();
    }

    const buscarItem = (e) => {
        setBusqueda(e.target.value);
        if (busqueda === "") {
            if (radioTodos) { setList(items) }
            if (radioPlantas) { setList(plants) }
            if (radioLugares) { setList(places) }

        } else {
            setList(list.filter(ev => ev.name.includes(busqueda)));
        }
    }

    const actualizarRadios = (e) => {
        if (e.target.id === "inlineRadio1") {
            setRadioTodos(true);
            setRadioPlantas(false);
            setRadioLugares(false);
            setList(items);
        }
        else if (e.target.id === "inlineRadio2") {
            setRadioTodos(false);
            setRadioPlantas(true);
            setRadioLugares(false);
            setList(plants);
        }
        else {
            setRadioTodos(false);
            setRadioPlantas(false);
            setRadioLugares(true);
            setList(places);
        }
    }

    const containerStyle = {
        width: '400px',
        height: '400px'
    };

    const center = {
        lat: 40.41111072322462,
        lng: -3.691127300262451
    };

    const obtenerLatLong = (e) => {
        setLat(e.latLng.lat())
        setLong(e.latLng.lng())
        setLatLng(e.latLng)
        document.getElementById("lat").value = e.latLng.lat();
        document.getElementById("long").value = e.latLng.lng();
        setMarcadorVisible(true)
    }


    return (
        <div className="background">
            <div className="d-flex justify-content-center mt-5">
                <h1 className="me-5">Plantas y Lugares</h1>
            </div>
            <div className="d-flex mt-5 elems">
                <button className="btn btn-success ms-auto" data-bs-toggle="modal" data-bs-target="#nuevoitemmodal">Nuevo Elemento</button>
                <div className="d-flex ms-auto me-auto bg-success rounded p-2">
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" onChange={e => actualizarRadios(e)} value="todos"></input>
                        <label className="form-check-label" htmlFor="inlineRadio1">Todo</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" onChange={e => actualizarRadios(e)} value="plantas"></input>
                        <label className="form-check-label" htmlFor="inlineRadio2">Plantas</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" onChange={e => actualizarRadios(e)} value="lugares"></input>
                        <label className="form-check-label" htmlFor="inlineRadio3">Lugares</label>
                    </div>
                </div>
                <div className="modal fade text-dark" id="nuevoitemmodal">
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">{edit ? 'Editar Elemento' : 'Nuevo Elemento'}</h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => cancelarEdit()}></button>
                            </div>
                            <form id="formularioitems" onSubmit={e => edit ? modificarItem(e) : nuevoItem(e)}>
                                <div className="modal-body">
                                    {error && (
                                        <div className="alert alert-danger">
                                            {error}
                                        </div>
                                    )}
                                    <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" onChange={e => setType(e.target.value)} defaultValue="plant">
                                        <option value="plant">Planta</option>
                                        <option value="place">Lugar</option>
                                    </select>
                                    <div className="d-flex flex-row">
                                        <div className="izq ms-auto me-3">
                                            <div className="form-floating mt-4">
                                                <input type="text" className="form-control" id="name" placeholder="Nombre" name="name" maxLength="50" onChange={e => setName(e.target.value)}></input>
                                                <label htmlFor="name">Nombre</label>
                                            </div>
                                            <div className="form-floating mt-3">
                                                <input type={type === "place" ? "hidden" : "text"} className="form-control" id="scientificname" placeholder="Nombre Científico" name="scientificname" maxLength="50" onChange={e => setScientificName(e.target.value)} disabled={type === "place"}></input>
                                                <label htmlFor="scientificname" hidden={type === "place"}>Nombre Científico</label>
                                            </div>
                                            <div className="form-floating mt-3">
                                                <input type={type === "place" ? "hidden" : "text"} className="form-control" id="category" placeholder="Categoría" name="category" maxLength="50" onChange={e => setCategory(e.target.value)} disabled={type === "place"}></input>
                                                <label htmlFor="category" hidden={type === "place"}>Categoría</label>
                                            </div>
                                            <select className="form-select mt-3" aria-label="Default select example" onChange={e => setTerrace(e.target.value)} defaultValue="Terraza de los Cuadros">
                                                <option value="Terraza de los Cuadros">Terraza de los Cuadros</option>
                                                <option value="Terraza de las Escuelas">Terraza de las Escuelas</option>
                                                <option value="Terraza del Plano de la Flor">Terraza del Plano de la Flor</option>
                                                <option value="Terraza de los Bonsáis">Terraza de los Bonsáis</option>
                                            </select>
                                            <div className="form-floating mt-3">
                                                <textarea className="form-control texto" id="description" name="description" placeholder="Descripción" maxLength="200" onChange={e => setDescription(e.target.value)}></textarea>
                                                <label htmlFor="description">Descripción</label>
                                            </div>

                                            <div className="d-flex justify-content-center align-items-center mt-4">
                                                <label htmlFor="formFile" className="form-label">Imágenes: </label>
                                                <input className="form-control w-100 ms-2" type="file" accept="image/*,video/*" multiple id="formFile" onChange={e => setImages(e.target.files)}></input>
                                            </div>
                                            <div className="d-flex justify-content-center align-items-center mt-4">
                                                <label htmlFor="formFileAudio" className="form-label">Audio: </label>
                                                <input className="form-control w-100 ms-2" type="file" accept="audio/*" id="formFileAudio" onChange={e => setAudio(e.target.files[0])}></input>
                                            </div>
                                        </div>
                                        <div className="der ms-3 me-auto">
                                            <div className="d-flex justify-content-center align-items-center mt-4">
                                                <LoadScript googleMapsApiKey="AIzaSyBncVh-3ckA9tPjbWstXnSGDRI8ySEnQ08">
                                                    <GoogleMap
                                                        mapContainerStyle={containerStyle}
                                                        center={center}
                                                        zoom={17}
                                                        options={{ mapId: "2492686c7e82773c" }}
                                                        onClick={e => obtenerLatLong(e)}
                                                    >
                                                        { /* Child components, such as markers, info windows, etc. */}
                                                        <Marker position={LatLng} visible={marcadorVisible}></Marker>
                                                        <></>
                                                    </GoogleMap>
                                                </LoadScript>
                                            </div>
                                            <div className="d-flex mt-3">
                                                <div className="form-floating mt-3 ms-auto">
                                                    <input type="text" className="form-control" id="lat" placeholder="Latitud" name="lat" maxLength="50" onChange={e => setName(e.target.value)}></input>
                                                    <label htmlFor="lat">Latitud</label>
                                                </div>
                                                <div className="form-floating mt-3 ms-1 me-auto">
                                                    <input type="text" className="form-control" id="long" placeholder="Longitud" name="long" maxLength="50" onChange={e => setName(e.target.value)}></input>
                                                    <label htmlFor="long">Longitud</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="modal-footer">
                                    {loading ? (
                                        <button type="submit" className="btn btn-success" value={edit ? 'Editar' : 'Añadir'}>
                                            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Cargando...
                                        </button>
                                    ) : (<input type="submit" className="btn btn-success" value={edit ? 'Editar' : 'Añadir'}></input>)}

                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => cancelarEdit()}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="me-auto me-5">
                    <input type="text" id="busc" className="form-control form-control-md text-dark" placeholder="Buscar" onChange={e => buscarItem(e)} onKeyDown={e => buscarItem(e)}></input>
                </div>
            </div>
            <div className="container d-flex flex-column">
                <div className="mt-4 contenedor rounded">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Nombre</th>
                                {!radioLugares && (<th>Nombre Científico</th>)}
                                {!radioLugares && (<th>Categoría</th>)}
                                <th>Terraza</th>
                                <th>Posición</th>
                                <th>Descripción</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                list.map(e => (
                                    <tr key={e.id}>
                                        <td>{e.name}</td>
                                        {!radioLugares && (<td>{e.scientific_name}</td>)}
                                        {!radioLugares && (<td>{e.category}</td>)}
                                        <td>{e.terrace}</td>
                                        <td>[{e.position._lat},{e.position._long}]</td>
                                        <td>{e.description.length > 200 ? e.description.substring(0, 200) + "..." : e.description}</td>
                                        <td><div className="d-flex"><button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#nuevoitemmodal" onClick={() => loadModalModificarItem(e.id)}>Editar</button><button className="btn btn-danger ms-3" onClick={() => eliminarItem(e.id)}>Eliminar</button></div></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Plants
