import React, { useEffect, useState} from "react"
import ReactDOM from "react-dom"
import "./index.css"

let pola = [];
for(let i = 0; i < 961; i++){
    pola.push(i);
}
let bt = [];
let br = [];
let bb = [];
let bl = [];


for(let i = 0; i < 31; i++){
    bt.push(i)
}
for(let i = 30; i < 961; i +=31){
    br.push(i)
}
for(let i = 0; i < 950; i +=31){
    bl.push(i)
}
for(let i = 961 - 31; i < 961; i++){
    bb.push(i)
}

const game = [...pola];
const center = 480;
let snakeMove;
let lastKey;
let score = 0;

const apple = (snakePos,setApplePos) => {
    let random = Math.round(Math.random() * 960)
    if(snakePos.includes(random)){
        apple(snakePos,setApplePos)
    }else{
        setApplePos(Number(random))
    }
}
const Pole = React.memo(({classes,idPole,children}) => {
    return (
        <div className={classes} data-id={idPole}>
            {children}
        </div>
    )
})
const GameBoard = React.memo(({applePos, snakePos}) => {
    
    return(
        <React.StrictMode>
            {
                game.map((a) => ( 
                    <Pole 
                        classes={ a === center ? "pole  center" : a === applePos ? "apple pole" : "pole" } 
                        key={a} 
                        idPole={a}
                        children={snakePos.includes(a) && <div className={a === snakePos[0] ? "snake  head" : "snake"}></div>}
                    >
                    </Pole>
                ))      
            }
        </React.StrictMode> 
    )

})

const GameBox = React.memo(({setEsc,stop,move, esc,setMove, applePos, setApplePos,snakePos,setStop,setSnakePos}) => {

    useEffect(() => {

        snakeMove = setInterval(() => {
            if(esc === false){
                let prevPos;
                let newPos = [];
                snakePos.forEach((a,b) => {
                    if(b === 0){
                        if(bt.includes(a) && move === -31){
                            newPos.push((31 * 30) + a)
                        }else if(bb.includes(a) && move === +31){
                            newPos.push(a % 31);
                        }else if(br.includes(a) && move === +1){
                            newPos.push(a - 30)
                        }else if(bl.includes(a) && move === -1){
                            newPos.push(a + 30)
                        }else{
                            newPos.push(a + move)
                        }
                        if(snakePos.includes(newPos[0])){
                            clearInterval(snakeMove)
                            setStop(true);
                        }
                    }else{
                        newPos.push(prevPos)
                    }
                    prevPos = a;
                })
                if(newPos[0] === applePos){
                    newPos.push(prevPos)
                    score = score +  1;
                    prevPos = null;
                    if(score >= 950){
                        setStop(true);
                    }
                    apple(newPos,setApplePos)
                }
                setSnakePos([...newPos])
            }else{
                setSnakePos([...snakePos])
            }
        },100)

        return () => {
            clearInterval(snakeMove)
        }
        
    },[esc,setEsc,snakePos])

    const HandleClick = (e) => {
        if(e.key !== lastKey){
            if(e.key === "Escape" || e.key === "Esc"){
                clearInterval(snakeMove)
                setEsc(true)
            }
            if((e.key === "w" || e.key === "W") && move !== -31){
                setMove(-31)
                lastKey = e.key;
            }
            if((e.key === "a" || e.key === "A") && move !== -1){
                setMove(-1)
                lastKey = e.key;
            }
            if((e.key === "d" || e.key === "D") && move !== +1){
                setMove(+1)
                lastKey = e.key;
            }
            if((e.key === "s" || e.key === "s") && move !== +31){
                setMove(+31)
                lastKey = e.key;
            }
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", HandleClick)
        
        return () => {
            window.removeEventListener("keydown", HandleClick)
        } 
    },[move,setMove])

    

    return (
        <React.StrictMode>
            {stop === false && <GameBoard applePos={applePos} snakePos={snakePos} />}
        </React.StrictMode> 
    )
})

const Main = React.memo(({setMain,snakePos,setApplePos}) => {

    const HandleClick = () => {

        setMain(false)
        apple(snakePos,setApplePos)
    }

    return(
        <div className="Main">
            <h1>React - Snake</h1>
            <button onClick={HandleClick}>PLAY</button>
        </div>
    )
})

const EscBox = React.memo(({setEsc,setMove,move,setStop}) => {

    const HandleClick = () => {
        setEsc(false);
        setMove(move)
        setStop(false)
    }


    return(
        <div className="Main">
            <h1>Resume Game</h1>
            <button onClick={HandleClick}>PLAY</button>
        </div>
    )
})

const EndBox = React.memo(({setEsc,setStop,setMove,setSnakePos,setApplePos}) => {

    const HandleClick = () => {
        setEsc(false);
        setStop(false)
        setMove(-31)
        setApplePos(null)
        setSnakePos([480, 480 + 31, 480 + 62])
        apple([480, 480 + 31, 480 + 62],setApplePos)
        score = 0;
    }


    return(
        <div className="Main">
            <h1>SCORE : {score}</h1>
            <button onClick={HandleClick}>PLAY AGAIN</button>
        </div>
    )
})

const Root = () => {
    const [stop, setStop] = useState(false)
    const [main, setMain] = useState(true)
    const [esc, setEsc] = useState(false)
    const [move, setMove] = useState(-31);
    const [applePos, setApplePos] = useState(null)
    const [snakePos, setSnakePos] = useState([480, 480 + 31, 480 + 62])

    useEffect(() => {
        if(stop === true || esc === true){
            clearInterval(snakeMove)
        }
    },[stop,esc, setStop, setEsc])

    return (
        <React.StrictMode>
            <div className="gra">
                {
                    stop === true ?
                    <EndBox setEsc={setEsc} setStop={setStop} setMove={setMove} setSnakePos={setSnakePos} setApplePos={setApplePos}/> :
                    esc === true ? 
                    <EscBox setEsc={setEsc} move={move} setMove={setMove} setStop={setStop} /> :
                    main === true ? 
                    <Main  setMain={setMain} snakePos={snakePos} setApplePos={setApplePos}/> :
                    <GameBox setEsc={setEsc} stop={stop} esc={esc} setStop={setStop} move={move} setMove={setMove} applePos={applePos} setApplePos={setApplePos} snakePos={snakePos} setSnakePos={setSnakePos} />  
                }
            </div>
        </React.StrictMode> 
    )

}

ReactDOM.render(<Root />, document.querySelector('#root'))