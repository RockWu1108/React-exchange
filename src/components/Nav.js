import React from 'react'
import {Link} from 'react-router-dom';
function Nav() {
    return (
        <nav>
           <ul>
               <li><img src="https://static.coingecko.com/s/gecko_cny-bde49ea1c653ee02f9e299d3dd1fdb1d3c1f0b49de7dd0cb7a264f6ce8e360bb.png"></img></li>
               <li><Link to="/">Home</Link></li>
               <li><Link to="/about">About</Link></li>
           </ul>
        </nav>
    )
}
export default Nav
