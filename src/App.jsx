import './App.css'
import Grid from './components/Grid';
import Toolbar from './components/Toolbar';
import useMinesweeper from './hooks/useMinesweeper';



function App() {

  const width = 16;
  const height = 16;
  const numMines = 15;

  const {flagEnabled, setFlagEnabled, gameover, setGameover, grid, setGrid, reveal, flagsRemaining, flagCoordinates, startTimer, timer} = useMinesweeper(width, height, numMines);



  return (
    <div>
      <div style={{ display: 'flex-column', flexDirection: 'column', alignItems: 'center',}}>
        <Toolbar 
            flagEnabled={flagEnabled} 
            setFlagEnabled={setFlagEnabled} 
            gameover={gameover} 
            flagsRemaining={flagsRemaining} 
            startTimer={startTimer} 
            timer={timer} 
        />
        <Grid 
            grid={grid} 
            reveal={reveal} 
            flagCoordinates={flagCoordinates} 
        />
      </div>
    </div>
  );
}

export default App
