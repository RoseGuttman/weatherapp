import React, {useContext, useState} from 'react';
//import logo from './logo.svg';
import './App.css';
import {Input, Button} from 'antd'
import {Bar} from 'react-chartjs-2'

const context = React.createContext()


function App() {
  const [state, setState] = useState({
    searchTerm:''
  }) 
  return <context.Provider value={{
    ...state, // Putting all the properties into the context
    set: v=> setState({...state, ...v}) //Set the state to be a new object, set all the existing states and add new pieces
  }}>
    <div className="App">
      <Header>
        {state.error && <div>{state.error}</div>}
      </Header>
    </div>
  </context.Provider>;
}


function Header(){
  const ctx = useContext(context)
  return <header className="App-header">
    <Input 
      style={{height:'3rem', fontSize:'2rem'}} 
      value={ctx.searchTerm}
      onChange={e=> ctx.set({searchTerm: e.target.value})}
      onKeyPress={e=>{
        if(e.key==='Enter'&& ctx.searchTerm) search(ctx)
      }}
    />
    <Button style={{margineLeft:5,height:'3rem'}}
      onClick={()=> search(ctx)} type="primary"
      disabled={!ctx.searchTerm}>
      Search
    </Button>

  </header>
}
function Body(){
  const ctx = useContext(context)
  const {error, weather} = ctx
  let data
  if(weather){
    data = {
      labels: weather.daily.data.map(d=>d.time),
      datasets: [ weather.daily.data.map(d=>d.temperatureHigh)]
    }
  }
  return <div className="App-body">
    {error && <div className="error">{ctx.error}</div>}
    {weather && <div>
      <Bar data={data}
        width={800} height={400}
      />
    </div>}
    </div>
}


async function search({searchTerm, set}){
  try{
    const term = searchTerm
    set({searchTerm:'', error:''})

    const osmurl = `https://nominatim.openstreetmap.org/search/${term}?format=json`
    const r = await fetch(osmurl)
    const loc = await r.json()
    if(!loc[0]){
      return set({error:'No city matching that query'})
    }
    const city = loc[0]

    const key = '0d93b992ed00cc794b8ed11da81c4574'
    const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${key}/${city.lat},${city.lon}`
    const r2 = await fetch(url)
    const weather = await r2.json()
    set({weather})
  } catch(e){
    set({error: e.message})
    }
  }

export default App;
