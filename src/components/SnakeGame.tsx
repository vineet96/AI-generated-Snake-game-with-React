import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 100;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  
  const directionRef = useRef(direction);
  
  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setHasStarted(true);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted) {
        if (gameOver) {
          resetGame();
        } else {
          setIsPaused(prev => !prev);
        }
        return;
      }

      if (!hasStarted && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        setHasStarted(true);
      }

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, hasStarted]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
      setDirection(directionRef.current);
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [food, gameOver, isPaused, hasStarted, generateFood, highScore]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-[400px] mb-6 px-4 py-2 border-glitch-alt relative">
        <div className="absolute top-0 right-0 bg-[#ff00ff] text-black text-xs px-2 py-0.5 font-bold">
          PROC_0x9A
        </div>
        <div className="flex flex-col mt-2">
          <span className="text-[#00ffff] text-xs tracking-widest">MEM_ALLOC</span>
          <span className="text-white text-4xl font-digital font-bold glitch-text" data-text={score.toString().padStart(4, '0')}>
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end mt-2">
          <span className="text-[#ff00ff] text-xs tracking-widest">MAX_MEM</span>
          <span className="text-white text-4xl font-digital font-bold glitch-text" data-text={highScore.toString().padStart(4, '0')}>
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-[#00ffff] overflow-hidden"
        style={{ 
          width: '400px', 
          height: '400px',
        }}
      >
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(#ff00ff 1px, transparent 1px), linear-gradient(90deg, #ff00ff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className="absolute"
              style={{
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                backgroundColor: isHead ? '#fff' : '#00ffff',
                border: isHead ? '2px solid #ff00ff' : '1px solid #000',
                zIndex: isHead ? 10 : 5,
              }}
            />
          );
        })}

        <div
          className="absolute animate-pulse"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            backgroundColor: '#ff00ff',
            border: '2px solid #fff',
          }}
        />

        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 border-4 border-[#ff00ff] m-4">
            <h2 className="text-4xl font-display font-bold text-white glitch-text mb-4" data-text="INIT_SEQ">INIT_SEQ</h2>
            <p className="text-[#00ffff] animate-pulse text-sm tracking-widest">[PRESS_ANY_KEY]</p>
          </div>
        )}

        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 border-4 border-[#00ffff] m-4">
            <h2 className="text-4xl font-display font-bold text-white glitch-text tracking-widest" data-text="HALTED">HALTED</h2>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-[#ff00ff] m-4 screen-tear">
            <h2 className="text-3xl font-display font-bold text-[#ff00ff] mb-2 glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
            <p className="text-white text-lg mb-6 tracking-widest">DUMP: <span className="text-[#00ffff]">{score}</span></p>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-[#00ffff] text-black font-bold uppercase tracking-widest hover:bg-[#ff00ff] hover:text-white transition-colors"
            >
              [REBOOT]
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-[#00ffff] text-xs flex gap-6 tracking-widest">
        <span>INPUT: [W,A,S,D] OR [ARROWS]</span>
        <span>INTERRUPT: [SPACE]</span>
      </div>
    </div>
  );
}
