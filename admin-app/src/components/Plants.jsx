import React from 'react'
import {db,auth,storage} from '../firebase'

const Plants = () => {
    //listado de plantas y lugares
    const [list, setList] = React.useState([]);
    const [items,setItems] = React.useState([]);
    const [plants,setPlants] = React.useState([]);
    const [places,setPlaces] = React.useState([]);

    //estados de control
    const [loading,setLoading] = React.useState(false);
    const [edit,setEdit] = React.useState(false);
    const [error,setError] = React.useState(null);

    //estados para inputs
    const [radioTodos, setRadioTodos] = React.useState(true);
    const [radioPlantas, setRadioPlantas] = React.useState(false);
    const [radioLugares, setRadioLugares] = React.useState(false);
    const [busqueda,setBusqueda] = React.useState(""); 
    
    const [id,setID] = React.useState("");
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

        try{
            const data = await db.collection('plants').get();
            const arrayData = data.docs.map(doc => ({id: doc.id, ...doc.data()}));
            setList(arrayData);
            setItems(arrayData);
            setPlants(arrayData.filter(pl => pl.type==="plant"));
            setPlaces(arrayData.filter(pl => pl.type==="place"));

        } catch(error){
            console.log(error);
        }

    }

    React.useEffect(()=>{
        obtenerPlantas()
        document.getElementById("inlineRadio1").checked = true;
    },[]);

    //Funciones asincronas => Consulta a Firebase


    //Funciones auxiliares => Formateo y Frontend
    const buscarItem = (e) => {
        setBusqueda(e.target.value);
        if(busqueda === ""){
            setList(items);
        }else{
            setList(list.filter(ev => ev.name.includes(busqueda)));
        }
    }

    const actualizarRadios = (e) => {
        if(e.target.id==="inlineRadio1"){
            setRadioTodos(true);
            setRadioPlantas(false);
            setRadioLugares(false);
            setList(items);
        }
        else if(e.target.id==="inlineRadio2"){
            setRadioTodos(false);
            setRadioPlantas(true);
            setRadioLugares(false);
            setList(plants);
        }
        else{
            setRadioTodos(false);
            setRadioPlantas(false);
            setRadioLugares(true);
            setList(places);
        }
    }

    return (
        <div className="background">
            <div className="d-flex justify-content-center mt-5">
                <h1 className="me-5">Plantas y Lugares</h1>
            </div>
            <div className="d-flex mt-5 elems">
                <button className="btn btn-success ms-auto" data-bs-toggle="modal" data-bs-target="#nuevaplantamodal">Nuevo Elemento</button>
                <div className="d-flex ms-auto me-auto bg-success rounded p-2">
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" onChange={e => actualizarRadios(e)} value="todos"></input>
                        <label className ="form-check-label" htmlFor="inlineRadio1">Todo</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" onChange={e => actualizarRadios(e)} value="plantas"></input>
                        <label className ="form-check-label" htmlFor="inlineRadio2">Plantas</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" onChange={e => actualizarRadios(e)} value="lugares"></input>
                        <label className ="form-check-label" htmlFor="inlineRadio3">Lugares</label>
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
                                <th>Nombre Científico</th>
                                <th>Categoría</th>
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
                                        <td>{e.scientific_name}</td>
                                        <td>{e.category}</td>
                                        <td>{e.terrace}</td>
                                        <td>[{e.position._lat},{e.position._long}]</td>
                                        <td>{e.description.length > 200 ? e.description.substring(0,200)+"..." : e.description}</td>
                                        <td><div className="d-flex"><button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#nuevaplantamodal">Editar</button><button className="btn btn-danger ms-3">Eliminar</button></div></td>
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
