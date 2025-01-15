import PropTypes from 'prop-types';

Toolbar.propTypes = {
    flagEnabled: PropTypes.bool,
    setFlagEnabled: PropTypes.func,
    gameover: PropTypes.bool,
    flagsRemaining: PropTypes.number,
    timer: PropTypes.number,
};

export default function Toolbar({ flagEnabled, setFlagEnabled, gameover, flagsRemaining, timer }) {

    const flagUrl = 'src/assets/flag.png';
    const smileUrl = 'src/assets/smile.png';
    const frownUrl = 'src/assets/frown.png';

    return (
        <div style={{
            display: 'flex',
            height: '150px',
        }}>
            <div style={{ marginLeft: '1vw', marginRight: '1vw', display: 'flex', flexDirection: 'column', }}>
                <div style={{ display: 'flex', alignSelf: 'center', flexDirection: 'column', }}>
                    <p>Place flags:</p>
                    <button 
                        onClick={() => {
                            setFlagEnabled(value => !value);
                            flagEnabled ? 
                                        document.getElementById('flagbutton').classList.remove("green_glow") 
                                        : 
                                        document.getElementById('flagbutton').classList.add("green_glow");
                            }} 
                            id='flagbutton'
                    >
                        <img 
                            src={flagUrl} 
                            style={{
                                width: '5vw',
                                height: '5vw',
                            }}
                        />
                    </button>
                </div>
            </div>
            <div style={{ marginLeft: '1vw', marginRight: '1vw', display: 'flex', flexDirection: 'column', }}>
                <div style={{ display: 'flex', alignSelf: 'center', flexDirection: 'column', }}>
                    <p>Remaining Mines:</p>
                    <div style={{
                        fontSize: '3em',
                        fontWeight: 'bolder',
                    }}>
                        <p>{flagsRemaining}</p>
                    </div>
                </div>
            </div>
            <div style={{ marginLeft: '1vw', marginRight: '1vw', display: 'flex', flexDirection: 'column', }}>
                <div style={{
                    backgroundColor: '#404040',
                    borderRadius: '10px',
                    display: 'flex',
                    alignSelf: 'center',
                    flexDirection: 'column',
                }}>
                    {gameover ?
                    <img 
                        src={frownUrl} 
                        style={{
                            width: '5vw',
                            height: '5vw',
                        }}
                    /> :
                    <img 
                        src={smileUrl} 
                        style={{
                            width: '5vw',
                            height: '5vw',
                        }}
                    />
                    }
                </div>
            </div>
            <div style={{ marginLeft: '1vw', marginRight: '1vw', display: 'flex', flexDirection: 'column', }}>
                <div style={{ display: 'flex', alignSelf: 'center', flexDirection: 'column', }}>
                    <p>Time Elapsed:</p>
                    <div style={{
                        fontSize: '3em',
                        fontWeight: 'bolder',
                    }}>
                        <p>{timer}s</p>
                    </div>
                </div>
            </div>
        </div>
    );
}