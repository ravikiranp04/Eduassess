import React from 'react';

function Upgrade(props) {
  return (
    <div className="card rounded-5 bg-primary text-light text-center h-100">
      <div className="card-body p-4">
        <h1>{props.planobj.planname}</h1>
        <p className="lead">{props.planobj.money}</p>
        <h2>No of Tests Monthly: {props.planobj.noOfTests}</h2>
        <h3 className="p-4">Test Data Available: {props.planobj.dataAvailable}</h3>
        <p className="lead">{props.planobj.mes}</p>
      </div>
    </div>
  );
}

export default Upgrade;
