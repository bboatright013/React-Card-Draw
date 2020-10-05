import React, {useState, useEffect, useRef} from 'react';
import Card from './Card';
import axios from 'axios';

const CardTable = () => {
const BASE_API_URL = 'https://deckofcardsapi.com/api/deck/';

const [deckId, setDeckId] = useState(null);
const [drawn, setDrawn] = useState([]);
//set state for auto draw
const [autoDraw, setAutoDraw] = useState(false);
//global var to listen for button push
const timerRef = useRef();


    useEffect(() => {
        try {
            async function loadDeck() {
                const res = await axios.get(`${BASE_API_URL}new/shuffle/`);

                
                setDeckId(res.data.deck_id);
                
            }
            loadDeck();
            return  () => console.log("cleanup")
        } catch(e){
            throw e.message;
        }
    } , [setDeckId]);



    useEffect(()=> {
    async function drawCard() {
        try {
            const res = await axios.get(`${BASE_API_URL}${deckId}/draw/?count=1`);
            // check if there are remaining cards, if not turn off autoDraw and throw e message
            if (res.data.remaining === 0) {
                setAutoDraw(false);
                throw new Error("no cards remaining!");
              }
            // build a card obj with api data
            const card = res.data.cards[0];
            // add card into drawn cards array with custom obj
            setDrawn(c => [...c, 
            {
                image : card.image,
                value : card.value,
                suit: card.suit,
                id : card.code
    
            }]);
        }catch(e){
            alert(e);
        }
        }


    // if autoDraw was set true and timerRef.current
    // doesnt have a setInterval ID ie:false
    // set current to this setInterval ID
    if (autoDraw && !timerRef.current) {
        timerRef.current = setInterval(async () => {
          await drawCard();
          console.log(timerRef.current);
        }, 1000);
      }
      //on cleanup turn off the intervall
      // resent timerRef current to null
      return () => {
        clearInterval(timerRef.current);
        timerRef.current = null;
      };
    },[autoDraw,setAutoDraw, deckId])
    
    //negate the boolean
    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
      };


return (
    <div className="CardTable">
        <button onClick={toggleAutoDraw}>Draw</button>
        <div className="cards">
            {drawn.map(card => {
             return ( <Card image={card.image} value={card.value} suit={card.suit} key={card.id} /> )
            })}

        </div>
    </div>
)

}

export default CardTable;


// single draw with button
// import React, {useState, useEffect, useRef} from 'react';
// import Card from './Card';
// import axios from 'axios';

// const CardTable = () => {
// const BASE_API_URL = 'https://deckofcardsapi.com/api/deck/';

// const [deckId, setDeckId] = useState(null);
// const [drawn, setDrawn] = useState([]);


//     useEffect(() => {
//         try {
//             async function loadDeck() {
//                 const res = await axios.get(`${BASE_API_URL}new/shuffle/`);

                
//                 setDeckId(res.data.deck_id);
                
//             }
//             loadDeck();
//             return  () => console.log("cleanup")
//         } catch(e){
//             throw e.message;
//         }
//     } , [setDeckId]);




//     async function drawCard() {
//         try {
//             const res = await axios.get(`${BASE_API_URL}${deckId}/draw/?count=1`);
//             if (res.data.remaining === 0) {
//                 throw new Error("no cards remaining!");
//               }
//             const card = res.data.cards[0];
//             setDrawn(c => [...c, 
//             {
//                 image : card.image,
//                 value : card.value,
//                 suit: card.suit,
//                 id : card.code
    
//             }]);
//         }catch(e){
//             alert(e);
//         }
//         }

    




// return (
//     <div className="CardTable">
//         <button onClick={drawCard}>Draw</button>
//         <div className="cards">
//             {drawn.map(card => {
//              return ( <Card image={card.image} value={card.value} suit={card.suit} key={card.id} /> )
//             })}

//         </div>
//     </div>
// )

// }

// export default CardTable;