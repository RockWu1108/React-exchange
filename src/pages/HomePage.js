import React,{useState , useEffect , useRef} from 'react';
import Coin from '../components/Coin';
import '../styles/coinsearch.css';
const HomePage = () => {

    const [page , setPage] = useState(1);
    const [loading , setLoading] = useState(false);
    const [coinData , setCoinData] = useState([]);
    const [search , setSearch] = useState('');
    const inputRef = useRef("");
    const COIN_API = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=${page}&sparkline=false`
    // 抓取貨幣資料

    useEffect(()=>{

        loadMoreCoin();

    },[search])

    

    const loadMoreCoin = () =>{
        fetch(COIN_API)
        .then(res => {
            return res.json();
        }).then(result => {
            setCoinData(coinData.concat(result));
        });

        setPage(page+1);
        console.log(page);
    }

    const setsearch = (e) => {
        e.preventDefault();
        setSearch(inputRef.current.value);
    
        if(inputRef.current.value ===""){
            setPage(1);
            setCoinData([]);
            console.log("search!!!!", search)
        }
      
    }

    // const handleChange = (e) => {
    //     setSearch(e.target.value);
    // }

    const filterCoin = coinData.filter(coin =>
        coin.name.toLowerCase().includes(search.toLowerCase())
    )
    return (
        
        <div className="coin-app" style={{minHeight:'95vh'}}>
           <div className="coin-search">
                <h1 className="coin-text">Coin Search</h1>
                <form>
                    <input type="text" className="coin-input" placeholder="Search" ref={inputRef}/>
                    <button className="coin-button" onClick={(e)=>{setsearch(e)}}>Submit</button>
                </form>
           </div>

           {filterCoin.map(coin =>{
               
                    return <Coin
                        key={coin.id}
                        name={coin.name}
                        img={coin.image}
                        symbol={coin.symbol}
                        volume={coin.total_volume}
                        price={coin.current_price}
                        priceChange={coin.price_change_percentage_24h}
                        marketCap = {coin.market_cap}
                        /> 
                })}

            <div className="more-coin">
                <button onClick={loadMoreCoin}>Load more ...</button>
            </div>

        </div>
    )
}

export default HomePage
