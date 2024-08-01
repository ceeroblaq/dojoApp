import React, { useMemo, useState } from 'react'
import RadioGroup from 'react-native-radio-buttons-group';

const Roles = ({ roles, setRole, role }) => {

  const radioButtons = useMemo(() => (roles), []);

  const handleSelection = (id) => {
    console.log("role id", id)
    setRole(id)
  }

  return (
    <RadioGroup
      containerStyle={
        {
          display: 'flex',
          flexDirection: 'column-reverse',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }
      }
      radioButtons={radioButtons}
      onPress={(id)=>{handleSelection(id)}}
      selectedId={role}
    />
  );
}

export default Roles