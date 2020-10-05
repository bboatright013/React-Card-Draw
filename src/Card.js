import React from 'react';
import './Card.css';

const Card = ({image, value, suit}) => {

    return (
        <div className="Card" value={value} suit={suit}>
            <img src={image} alt={`${value} of ${suit}`} />
        </div>
    )

}

export default Card;