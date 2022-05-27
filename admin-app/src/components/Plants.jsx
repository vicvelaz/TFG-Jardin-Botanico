import React from 'react'
import { db, storage, firebase } from '../firebase/firebase-config'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import $ from 'jquery'
import 'bootstrap'
import { MDBDataTableV5 } from 'mdbreact';

const Plants = () => {
    //listado de plantas y lugares
    const [list, setList] = React.useState([]);
    const [items, setItems] = React.useState([]);
    const [plants, setPlants] = React.useState([]);
    const [places, setPlaces] = React.useState([]);

    //estados de control
    const [loading, setLoading] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [marcadorVisible, setMarcadorVisible] = React.useState(true);
    const [numPaginas, setNumPaginas] = React.useState(4);
    const [pagActual, setPagActual] = React.useState(1);
    const [itemActual, setItemActual] = React.useState(0);
    const [paginas, setPaginas] = React.useState([]);

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
    const [type, setType] = React.useState("plant");
    const [scientificName, setScientificName] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [terrace, setTerrace] = React.useState("Terraza de los Cuadros");
    const [description, setDescription] = React.useState("");
    const [position, setPosition] = React.useState([]);
    const [images, setImages] = React.useState([]);
    const [audio, setAudio] = React.useState(null);
    const [otherServices, setOtherServices] = React.useState(false);


    const [plantsRow, setPlantsRow] = React.useState();
    const [placesRow, setPlacesRow] = React.useState();

    const [datatable, setDatatable] = React.useState(
        {
            columns: [
                {
                    label: 'Nombre',
                    field: 'name',
                    sort: 'asc',
                    width: 300
                },
                {
                    label: 'Terraza',
                    field: 'terrace',
                    sort: 'asc',
                    width: 300
                },
                {
                    label: 'Descripción',
                    field: 'description',
                    sort: 'asc',
                    width: 0
                },
                {
                    label: 'Posicion',
                    field: 'position',
                    sort: 'asc',
                    width: 600
                },
                {
                    label: 'Opciones',
                    field: 'options',
                    sort: 'asc',
                    width: 150
                }
            ],
            rows: []
        }
    );


    const obtenerPlantas = async () => {

        try {
            const data = await db.collection('plants').get();
            const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItems(arrayData);
            setPlants(arrayData.filter(pl => pl.type === "plant"));
            setPlaces(arrayData.filter(pl => pl.type === "place"));

            const tableRow = [];
            const tablePlantsRow = [];
            const tablePlacesRow = [];
            arrayData.forEach(element => {
                const elem = {
                    id: element.id,
                    name: element.name,
                    terrace: element.terrace,
                    description: element.description.length > 140 ? `${element.description.substring(0, 140)}...` : element.description,
                    position: "["+element.position._lat+", "+element.position._long+"]",
                    options: <div className="d-flex"><button className="btn btn-light" onClick={() => loadModalModificarItem(element.id)} data-bs-toggle="modal" data-bs-target="#nuevoitemmodal">Editar</button><button className="btn btn-danger ms-3" onClick={() => eliminarItem(element.id)}>Eliminar</button></div>,
                };

                tableRow.push(elem)

                element.type === "plant" ? tablePlantsRow.push(elem) : tablePlacesRow.push(elem);
            })

            setDatatable({ ...datatable, rows: tableRow });
            setPlantsRow(tablePlantsRow);
            setPlacesRow(tablePlacesRow);

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
        e.preventDefault();

        try {

            const nuevoItem = type === "plant" ?
                {
                    name: name,
                    description: description,
                    category: category,
                    scientific_name: scientificName,
                    type: "plant",
                    terrace: terrace,
                    position: new firebase.firestore.GeoPoint(lat, long),
                    media: '',
                    audio: ''
                } : {
                    name: name,
                    description: description,
                    type: "place",
                    terrace: terrace,
                    position: new firebase.firestore.GeoPoint(lat, long),
                    media: '',
                    audio: '',
                    otherServices: otherServices
                };

            setLoading(true);
            const it = await db.collection('plants').add(nuevoItem);

            if (images !== null) {
                const arr = Array.from(images);
                if (arr.length !== 0) {
                    arr.map(async (i, index) => {
                        const imagenRef = storage.ref().child(`/images/plants/${it.id}`).child(`${index}-${Date.now()}`);
                        await imagenRef.put(i);
                        const imagenURL = await imagenRef.getDownloadURL();
                        await db.collection('plants').doc(it.id).update({ media: firebase.firestore.FieldValue.arrayUnion(imagenURL) });
                    })
                }
            }

            if (audio !== null) {
                const audioRef = storage.ref().child("/audio/plants").child(it.id);
                await audioRef.put(audio);
                const audioURL = await audioRef.getDownloadURL();
                await db.collection('plants').doc(it.id).update({ audio: audioURL });
            }

            obtenerPlantas();

            setLoading(false);
            setName('');
            setID('');
            setType('');
            setCategory('');
            setScientificName('');
            setPosition([]);
            setDescription('');
            setImages('');
            setAudio('');
            setLong(0);
            setLat(0);
            setOtherServices(false);
            setMarcadorVisible(false)


            document.getElementById("formularioitems").reset();
            window.$('#nuevoitemmodal').modal('toggle');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();

        } catch (error) {
            console.log(error);
        }
    }

    const eliminarItem = async (id) => {
        try {
            await db.collection('plants').doc(id).delete();
            const imagenRef = storage.ref().child(`/images/plants/${id}`);
            imagenRef.listAll().then((listResults) => {
                if (listResults.items.length !== 0) {
                    const promises = listResults.items.map((item) => {
                        return item.delete();
                    });
                    Promise.all(promises);
                }
            });
            const audioRef = storage.ref().child("/audio/plants").child(id);
            await audioRef.delete();
            obtenerPlantas();

        } catch (error) {
            obtenerPlantas();
        }
    }

    const modificarItem = async (e) => {
        e.preventDefault();

        try {
            const nuevoItem = type === "plant" ?
                {
                    name: name,
                    description: description,
                    category: category,
                    scientific_name: scientificName,
                    type: "plant",
                    terrace: terrace,
                    position: new firebase.firestore.GeoPoint(lat, long),
                } : {
                    name: name,
                    description: description,
                    type: "place",
                    terrace: terrace,
                    position: new firebase.firestore.GeoPoint(lat, long),
                    otherServices: otherServices,
                };

            setLoading(true);

            const it = await db.collection('plants').doc(id).update(nuevoItem);

            if (images !== null && images !== "") {
                const arr = Array.from(images);
                console.log(arr.length);
                if (arr.length !== 0) {
                    await db.collection('plants').doc(id).update({ media: firebase.firestore.FieldValue.delete() });
                    arr.map(async (i, index) => {
                        console.log('i', i);
                        console.log('id',id);
                        const imagenRef = storage.ref().child(`/images/plants/${id}`).child(`${index}-${Date.now()}`);
                        await imagenRef.put(i);
                        const imagenURL = await imagenRef.getDownloadURL();
                        await db.collection('plants').doc(id).update({ media: firebase.firestore.FieldValue.arrayUnion(imagenURL) });
                    })
                }
            }

            if (audio !== "" && audio !== null) {
                const audioRef = storage.ref().child("/audio/plants").child(it.id);
                await audioRef.put(audio);
                const audioURL = await audioRef.getDownloadURL();
                await db.collection('plants').doc(it.id).update({ audio: audioURL });
            }

            obtenerPlantas();

            setLoading(false);
            setName('');
            setID('');
            setType('');
            setCategory('');
            setScientificName('');
            setPosition([]);
            setDescription('');
            setImages('');
            setAudio('');
            setLong(0);
            setLat(0);
            setMarcadorVisible(false)
            setBusqueda("");
            setOtherServices(false);

            document.getElementById("formularioitems").reset();
            window.$('#nuevoitemmodal').modal('toggle');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();

        } catch (error) {
            console.log(error);
        }
    }

    //Funciones auxiliares => Formateo y Frontend
    const loadModalModificarItem = (id) => {
        setEdit(true);

        db.collection('plants').doc(id).get().then(e => {
           const itemInfo = e.data();

            if (itemInfo.type === "plant") {
                document.getElementById("scientificname").value = itemInfo.scientific_name;
                document.getElementById("category").value = itemInfo.category;
                setCategory(itemInfo.category);
            } else {
                setOtherServices(itemInfo.otherServices);
            }

            document.getElementById("tipo").value = itemInfo.type;
            document.getElementById("name").value = itemInfo.name;
            document.getElementById("terrace").defaultValue = itemInfo.terrace;
            document.getElementById("description").value = itemInfo.description;

            document.getElementById("lat").value = itemInfo.position._lat;
            document.getElementById("long").value = itemInfo.position._long;
            setLatLng(new window.google.maps.LatLng(itemInfo.position._lat, itemInfo.position._long));
            setLat(itemInfo.position._lat);
            setLong(itemInfo.position._long);
            setMarcadorVisible(true);

            setType(itemInfo.type);
            setID(id);
            setName(itemInfo.name);
            setDescription(itemInfo.description);
            setTerrace(itemInfo.terrace);
        });
    }

    const cancelarEdit = () => {
        setEdit(false);
        setName('');
        setDescription('');
        setImages(null);
        setType("plant");
        setMarcadorVisible(false);
        setOtherServices(false);

        document.getElementById("formularioitems").reset();
    }


    const actualizarRadios = (e) => {
        let npag = 0;

        if (e.target.id === "inlineRadio1") {
            setRadioTodos(true);
            setRadioPlantas(false);
            setRadioLugares(false);
            setDatatable({ ...datatable, rows: [...placesRow, ...plantsRow] });
        }
        else if (e.target.id === "inlineRadio2") {
            setRadioTodos(false);
            setRadioPlantas(true);
            setRadioLugares(false);
            setDatatable({ ...datatable, rows: plantsRow });
        }
        else {
            setRadioTodos(false);
            setRadioPlantas(false);
            setRadioLugares(true);
            setDatatable({ ...datatable, rows: placesRow });
        }

        setNumPaginas(npag);
        setItemActual(5);
        setPagActual(1);
        let pag = Array.from({ length: npag }, (_, index) => index + 1);
        setPaginas(pag);
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
            <div className="container d-flex flex-column ">
                <div className="d-flex mt-5 justify-content-between">
                    <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#nuevoitemmodal">Nuevo Elemento</button>
                    <div className="d-flex bg-success rounded p-2 pull-right ">
                        <div className="form-check form-check-inline d-flex align-items-center justify-content-center ms-2">
                            <input className="form-check-input " type="radio" name="inlineRadioOptions" id="inlineRadio1" onChange={e => actualizarRadios(e)} value="todos"></input>
                            <label className="form-check-label ms-1 mt-1" htmlFor="inlineRadio1">Todo</label>
                        </div>
                        <div className="form-check form-check-inline d-flex align-items-center justify-content-center">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" onChange={e => actualizarRadios(e)} value="plantas"></input>
                            <label className="form-check-label ms-1 mt-1" htmlFor="inlineRadio2">Plantas</label>
                        </div>
                        <div className="form-check form-check-inline d-flex align-items-center justify-content-center mx-auto me-2">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" onChange={e => actualizarRadios(e)} value="lugares"></input>
                            <label className="form-check-label ms-1 mt-1" htmlFor="inlineRadio3">Lugares</label>
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
                                        <select id="tipo" className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" onChange={e => setType(e.target.value)} defaultValue="plant">
                                            <option value="plant">Planta</option>
                                            <option value="place">Lugar</option>
                                        </select>
                                        <div className="d-flex flex-row">
                                            <div className="izq ms-auto me-3">
                                                <div className="form-floating mt-4">
                                                    <input type="text" className="form-control" id="name" placeholder="Nombre" name="name" maxLength="50" onChange={e => setName(e.target.value.replace(/"/g, "'"))} required></input>
                                                    <label htmlFor="name">Nombre</label>
                                                </div>
                                                <div className="form-floating mt-3">
                                                    <input type={type === "place" ? "hidden" : "text"} className="form-control" id="scientificname" placeholder="Nombre Científico" name="scientificname" maxLength="50" onChange={e => setScientificName(e.target.value.replace(/"/g, "'"))} disabled={type === "place"}></input>
                                                    <label htmlFor="scientificname" hidden={type === "place"}>Nombre Científico</label>
                                                </div>
                                                <div className="form-floating mt-3">
                                                    <input type={type === "place" ? "hidden" : "text"} className="form-control" id="category" placeholder="Categoría" name="category" maxLength="50" onChange={e => setCategory(e.target.value.replace(/"/g, "'"))} disabled={type === "place"}></input>
                                                    <label htmlFor="category" hidden={type === "place"}>Categoría</label>
                                                </div>
                                                <select id="terrace" className="form-select mt-3" aria-label="Default select example" onChange={e => setTerrace(e.target.value)} defaultValue="Terraza de los Cuadros">
                                                    <option value="Terraza de los Cuadros">Terraza de los Cuadros</option>
                                                    <option value="Terraza de las Escuelas">Terraza de las Escuelas</option>
                                                    <option value="Terraza del Plano de la Flor">Terraza del Plano de la Flor</option>
                                                    <option value="Terraza de los Bonsáis">Terraza de los Bonsáis</option>
                                                </select>
                                                <div className="form-check mt-3" hidden={type === "plant"}>
                                                    <input
                                                        type={type === "plant" ? "hidden" : "checkbox"}
                                                        onChange={e => setOtherServices(!otherServices)}
                                                        id="otherservices"
                                                        className="form-check-input"
                                                        name={"Otros servicios"}
                                                        checked={otherServices}
                                                    />
                                                    <label className='form-check-label' for="otherservices" >Otros servicios </label>
                                                </div>
                                                <div className="form-floating mt-3">
                                                    <textarea className="form-control text" id="description" name="description" placeholder="Descripción" maxLength="2000" onChange={e => setDescription(e.target.value.replace(/"/g, "'"))} disabled={type === "place" && otherServices} required></textarea>
                                                    <label htmlFor="description">Descripción</label>
                                                </div>

                                                <div className="d-flex justify-content-center align-items-center mt-4">
                                                    <label htmlFor="formFile" className="form-label">Imágenes: </label>
                                                    <input className="form-control w-100 ms-2" type="file" accept="image/*,video/*" multiple id="formFile" onChange={e => setImages(e.target.files)} required={!edit}></input>
                                                </div>
                                                <div className="d-flex justify-content-center align-items-center mt-4">
                                                    <label htmlFor="formFileAudio" className="form-label">Audio: </label>
                                                    <input className="form-control w-100 ms-2" type="file" accept="audio/*" id="formFileAudio" onChange={e => setAudio(e.target.files[0])} disabled={type === "place" && otherServices}></input>
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
                                                        <input type="text" className="form-control" id="lat" placeholder="Latitud" name="lat" maxLength="50" onChange={e => setName(e.target.value)} required></input>
                                                        <label htmlFor="lat">Latitud</label>
                                                    </div>
                                                    <div className="form-floating mt-3 ms-1 me-auto">
                                                        <input type="text" className="form-control" id="long" placeholder="Longitud" name="long" maxLength="50" onChange={e => setName(e.target.value)} required></input>
                                                        <label htmlFor="long">Longitud</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="modal-footer">
                                        {loading ? (
                                            <button type="submit" className="btn btn-success" value={edit ? 'Editar' : 'Añadir'}>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Cargando...
                                            </button>
                                        ) : (<input type="submit" className="btn btn-success" value={edit ? 'Editar' : 'Añadir'}></input>)}

                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => cancelarEdit()}>Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <MDBDataTableV5
                    hover
                    entriesOptions={[5, 10, 20]}
                    entries={5}
                    pagesAmount={4}
                    data={datatable}
                    paging
                    theadColor='elegant-color'
                    theadTextWhite
                    tbodyColor='rgba-grey-strong'
                    searchBottom={true}
                    className="mt-2"
                />


            </div>
        </div>
    )
}

export default Plants
