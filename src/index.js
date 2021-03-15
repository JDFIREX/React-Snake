import React, { useEffect, useState,useCallback} from "react"
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

const Main = ({setMain,setStop}) => {

    const HandleClick = () => {
        setMain(false)
        setStop(false);
    }

    return(
        <div className="Main">
            <h1>React - Snake</h1>
            <button onClick={HandleClick}>PLAY</button>
        </div>
    )
}

const GameBoard = React.memo(({applePos,move,setStop,setScore,score,setApplePos}) => {

    const [snakePos, setSnakePos] = useState([480, 480 + 31, 480 + 62])

    useEffect(() => {
        apple(snakePos,setApplePos)
    },[])
    
    useEffect(() => {
        snakeMove = setInterval(() => {
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
                        if(snakePos.includes(newPos[0])){
                            setStop(true);
                        }
                    }
                }else{
                    newPos.push(prevPos)
                }
                prevPos = a;
            })
            if(newPos[0] === applePos){
                newPos.push(prevPos)
                setScore(score + 1)
                if(score >= 950){
                    setStop(true)
                }
                apple(snakePos,setApplePos)
            }
            setSnakePos([...newPos])
        },100);
        
        
        return () => {
            clearInterval(snakeMove)
        }
    })

    return(
        <React.StrictMode>
                {
                    game.map((a) => ( 
                        <Pole 
                            classes={a === applePos ? "pole apple" : a === center ? "pole  center" : "pole"} 
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

const GameBox = () => {
    const [score, setScore] = useState(0)
    const [move, setMove] = useState(-31);
    const [applePos, setApplePos] = useState(null)
    const [rerender, setrerender] = useState(false)
    const [stop, setStop] = useState(false)


    const HandleClick = (e) => {
        if(e.key !== lastKey){
            if(e.key ==="Escape" || "Esc"){
                setrerender(false)
                clearInterval(snakeMove)
            }
            if(e.key ==="Enter"){
                setrerender(true)
            }
            if((e.key === "w" || e.key === "W") && move !== -31){
                setMove(-31)
            }
            if((e.key === "a" || e.key === "A") && move !== -1){
                setMove(-1)
            }
            if((e.key === "d" || e.key === "D") && move !== +1){
                setMove(+1)
            }
            if((e.key === "s" || e.key === "s") && move !== +31){
                setMove(+31)
            }
            lastKey = e.key;
        }
    }


    useEffect(() => {
        window.addEventListener("keydown", HandleClick)
        
        return () => {
            window.removeEventListener("keydown", HandleClick)
        } 
    },[move,setMove])

    useEffect(() => {
        if(stop === true){
            clearInterval(snakeMove)
        }
    },[stop])

    

    return (
        <React.StrictMode>
            {stop === false && <GameBoard applePos={applePos} move={move} setStop={setStop} setScore={setScore} score={score} setApplePos={setApplePos} />}
        </React.StrictMode> 
    )
}



const Root = () => {
    const [stop, setStop] = useState(true)
    const [main, setMain] = useState(true)

    return (
        <React.StrictMode>
            <div className="gra">
                {
                    stop === false ? <GameBox /> : <Main setMain={setMain} setStop={setStop}/>
                }
            </div>
        </React.StrictMode> 
    )

}



ReactDOM.render(<Root />, document.querySelector('#root'))