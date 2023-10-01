import { createContext, useContext, useState } from 'react';
import './App.css'
import logo from './images/logo.png'
import { AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

const PageContext = createContext()

function App() {
  const page = useState(0)
  return (
    <PageContext.Provider value={page}>
      {page[0]===0 && <Home />}
      {page[0]===1 && <MainPage />}
    </PageContext.Provider>
  );
}

function MainPage() {
  const [risk,handleRisk] = useState()
  const [type,handleType] = useState()
  const [money,handleMoney] = useState()
  const [page,handlePage] = useContext(PageContext)
  const [result,handleResult] = useState("")
  const changeRisk = (event) => {
    handleRisk(event.target.value)
  }
  const changeType = (event) => {
    console.log(event.target.value)
    handleType(event.target.value)
  }
  const handleSubmit = () => {
    fetch(`http://192.168.160.240:5000/?risk=${risk}&type=${type}`)
    .then((item)=> item.json())
    .then((item)=> handleResult(item.result))
    .catch(item => console.log(item))
  }
  const handleHome = () => {
    handlePage(0)
  }
  return(
    <div>
      <nav>
        <img className='logo' alt='logo' src={logo}></img>
        <h1 className='title'>MoneyMeetsMarket</h1>
        <h2><span className='blue' onClick={handleHome}>Home&emsp;&emsp;&emsp;&emsp;&emsp;</span>About&emsp;&emsp;&emsp;&emsp;&emsp;Our App&emsp;&emsp;&emsp;&emsp;&emsp;Pages</h2>
      </nav>
      <div className='space'></div>
      <div className='home2'>
        <div className='form'>
          <label>Enter Your Preferences</label>
          <input onChange={changeRisk} className='parameters' required placeholder="Risk Appetite(%)"></input>
          <select onChange={changeType} className='selector'>
            <option value="" disabled selected hidden>Choose a Type of Investment</option>
            <option value="Shares">Shares</option>
            <option value="Commodities">Commodiities</option>
            <option value="Funds">Funds</option>
          </select>
          <button className='submit' onClick={handleSubmit}>Submit</button>
        </div>
        <div>
          <AreaChart>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
          </AreaChart>
          <h1 className='result'>{result}</h1>
        </div>
      </div>
    </div>
  )
}

function Home() {
  const [page,handlePage]=useContext(PageContext)
  const handleClick = () => {
    handlePage(1)
  }
  return(
    <div className="main-window">
      <nav>
        <img className='logo' alt='logo' src={logo}></img>
        <h1 className='title'>MoneyMeetsMarket</h1>
        <h2><span className='blue'>Home&emsp;&emsp;&emsp;&emsp;&emsp;</span>About&emsp;&emsp;&emsp;&emsp;&emsp;Our App&emsp;&emsp;&emsp;&emsp;&emsp;Pages</h2>
        <button className='login'>Login</button>
      </nav>
      <div className='space'></div>
      <div className='home'>
        <h1 className='caption'>
          Building <span className='blue'>Futures</span> Together <br />
          With Your <span className='blue'>Investments</span> <br />
          And Our <span className='blue'>Expertise</span> <br />
        </h1>
        <p className='welcome'>
          Welcome to MMM - where Money Meets Market! We're dedicated to keeping you <br />
          informed and in control of your investments. With real-time updates, insightful <br />
          analysis, and user-friendly tools, we empower you to make informed decisions in the <br />
          dynamic world of stocks. A seasoned trader or a beginner - join us and experience a <br />
          seamless stock market tracking journey today!
        </p>
        <button onClick={handleClick} className='start'>Get Started</button>
      </div>
    </div>
  )
}

export default App;
