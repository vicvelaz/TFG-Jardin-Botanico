import React, { useState } from "react";

import "bootstrap";
import "moment/locale/es";

import Select from "react-select";


const SelectItineraries = (props) => {

    let paradas = props.paradas;
    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
      ];

const [selectedOption, setSelectedOption] = useState(null);

React.useEffect(() => {
    // setSelectedOption(options);
  }, []);


    return (
        <div className="iti">SelectItineraries!!!!!!!!!!
        {paradas.map((e)=>(
            <div>{e.label}</div>
        ))
        }
        
        <Select
        autoFocus={true}
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
      />
        </div>
       
    );

}


export default SelectItineraries;
