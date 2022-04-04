import React, { Fragment } from 'react';

import Select, { components } from 'react-select';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';


function arrayMove(array, from, to) {
  array = array.slice();
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
  return array;
}

const SortableMultiValue = SortableElement(props => {
  // this prevents the menu from being opened/closed when the user clicks
  // on a value to begin dragging it. ideally, detecting a click (instead of
  // a drag) would still focus the control and toggle the menu, but that
  // requires some magic with refs that are out of scope for this example
  const onMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const innerProps = { onMouseDown };
  return <components.MultiValue {...props} innerProps={innerProps} />;
});
const SortableSelect = SortableContainer(Select);


const MultiSelectSort = (props) => {

  const lista = props.paradas;
  const [selected, setSelected] = React.useState([]);

  const onChange = selectedOptions => {
    if(selectedOptions.length<=24){
      setSelected(selectedOptions);
      props.actualizarPuntos(selectedOptions);
    }

  } 

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newValue = arrayMove(selected, oldIndex, newIndex);
    setSelected(newValue);
    props.actualizarPuntos(newValue);
    console.log('Values sorted:', newValue.map(i => i.value));
  };

  const onReset = (e) => {
    e.preventDefault();
    setSelected([]);
  }

  const editarPuntos = (e, puntos) => {
    e.preventDefault();
    setSelected(puntos);
  }

  return (
    <Fragment>
    <SortableSelect
      // react-sortable-hoc props:
      axis="xy"
      onSortEnd={onSortEnd}
      distance={4}
      // small fix for https://github.com/clauderic/react-sortable-hoc/pull/352:
      getHelperDimensions={({ node }) => node.getBoundingClientRect()}
      // react-select props:
      isMulti
      options={lista}
      value={selected}
      onChange={onChange}
      onReset={onReset}
      components={{
        MultiValue: SortableMultiValue,
      }}
      closeMenuOnSelect={false}
    />
    <button id="resetsortableselect" onClick={(e) => onReset(e)}>clear</button>
    <button id="editsortableselect" onClick={(e) => editarPuntos(e, props.editarPuntos)}>edit</button>
    </Fragment>
    
  );
}

export default MultiSelectSort;