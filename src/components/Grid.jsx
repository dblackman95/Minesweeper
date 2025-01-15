import PropTypes from 'prop-types';

Grid.propTypes = {
    grid: PropTypes.array,
    reveal: PropTypes.func.isRequired,
};

export default function Grid({ grid, reveal }) {

    
    return (
        <div style={{ display: 'flex', alignItems: 'center',}}>
            <table id="table" style={{ margin: '0 auto',}}>
                <tbody>
                    {grid && grid.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td 
                                    width="25" 
                                    height="25" 
                                    key={cellIndex}
                                    id={rowIndex + "_" + cellIndex} 
                                    onClick={() => {
                                        reveal(rowIndex, cellIndex);
                                    }}
                                    style={{
                                        backgroundColor: cell.isRevealed ? (cell.revealedDisplay === '-1' ? 'red' : 'gray') : '#1a1a1a',
                                        backgroundImage: (cell.isRevealed && cell.revealedDisplay === '-1' ? `url('bomb.png')` : ''),
                                        backgroundSize: 'contain',
                                    }}
                                >
                                    {cell.isRevealed ? (cell.revealedDisplay === "-1" ? " " : cell.revealedDisplay) : cell.display}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

