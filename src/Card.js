import React from "react";

function Card({name, image}){
    return <img className="Card" alt={name} src={image} />
}

export default Card;