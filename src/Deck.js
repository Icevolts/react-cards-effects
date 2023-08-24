import React, {useEffect, useState, useRef} from "react";
import Card from './Card';
import axios from 'axios';

const BASE_URL = 'http://deckofcardsapi.com/api/deck/';

function Deck(){
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        async function getData(){
            let d = await axios.get(`${BASE_URL}new/shuffle`);
            setDeck(d.data);
        }
        getData();
    }, [setDeck]);

    useEffect(() => {
        async function getCard() {
            let { deck_id } = deck;

            try{
                let res = await axios.get(`${BASE_URL}${deck_id}/draw`);

                if(res.data.remaining === 0){
                    setAutoDraw(false);
                    throw new Error('No more cards');
                }
                const card = res.data.cards[0];

                setDrawn(d => [...d, {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image
                }]);
            }catch(err){
                alert(err);
            }
        }


        if(autoDraw && !timerRef.current){
            timerRef.current = setInterval(async () => {
                await getCard();
            }, 1000);
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [autoDraw, setAutoDraw, deck]);

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
    };

    const cards = drawn.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
    ));

    return (
        <div className="Deck">
            {deck ? (
                <button onClick={toggleAutoDraw}>
                    {autoDraw ? 'Stop' : 'Start'} drawing
                </button>
            ) : null}
            <div>{cards}</div>
        </div>
    );
}

export default Deck;