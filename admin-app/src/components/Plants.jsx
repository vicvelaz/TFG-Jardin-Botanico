import React from 'react'
import {db,auth,storage} from '../firebase'

const Plants = () => {
     //listado de plantas y lugares
    const [plants,setPlants] = React.useState([]);
    const [radioTodos, setRadioTodos] = React.useState(false);

    const obtenerPlantas = async () => {

        try{
            const data = await db.collection('plants').get();
            const arrayData = data.docs.map(doc => ({id: doc.id, ...doc.data()}));
            setPlants(arrayData);

        } catch(error){
            console.log(error);
        }

    }

    React.useEffect(()=>{obtenerPlantas()},[]);

    return (
        <div className="background">
            <div className="d-flex justify-content-center mt-5">
                <h1 className="me-5">Plantas y Lugares</h1>
            </div>
            <div className="d-flex mt-5 elems">
                <button className="btn btn-success ms-auto" data-bs-toggle="modal" data-bs-target="#nuevaplantamodal">Nuevo Elemento</button>
                <div className="d-flex ms-auto me-auto bg-success rounded p-2">
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" onChange={e => setRadioTodos(e.target.value)} value="option1" checked></input>
                        <label className ="form-check-label" htmlFor="inlineRadio1">Todo</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"></input>
                        <label className ="form-check-label" htmlFor="inlineRadio2">Plantas</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3"></input>
                        <label className ="form-check-label" htmlFor="inlineRadio3">Lugares</label>
                    </div>
                </div>
                <div className="me-auto me-5">
                    <input type="text" id="busc" className="form-control form-control-md text-dark" placeholder="Buscar"></input>
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
                                plants.map(e => (
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
