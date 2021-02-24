import Footer from './components/Footer';
import Nav from './components/Nav';
import React from 'react';
import HomePage from './pages/HomePage';
import About from './pages/About';
import{Switch , Route} from 'react-router-dom';
import './styles/style.css'
function App() {
  return (
    <div>
        <Nav/>
      {/* Nav 與 Footer固定於每個頁面，透過Router只更改所需要頁面，減少不必要渲染 */}
        <Switch>
            <Route path="/" exact>
              <HomePage/>
            </Route>

            <Route path="/about" exact>
              <About/>
            </Route>
        </Switch>
    
        <Footer/>
    </div>
  );
}

export default App;
