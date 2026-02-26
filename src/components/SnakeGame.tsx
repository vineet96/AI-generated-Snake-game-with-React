import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving up
const GAME_SPEED = 120;

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
      // Prevent default scrolling for arrow keys
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

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
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
      {/* Score Board */}
      <div className="flex justify-between w-full max-w-[400px] mb-4 px-4 py-2 bg-gray-900/80 backdrop-blur-md rounded-xl neon-border">
        <div className="flex flex-col">
          <span className="text-cyan-400 text-xs font-display uppercase tracking-wider">Score</span>
          <span className="text-white text-5xl font-digital font-bold neon-text glitch" data-text={score}>{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-pink-400 text-xs font-display uppercase tracking-wider">High Score</span>
          <span className="text-white text-5xl font-digital font-bold neon-text-pink glitch" data-text={highScore}>{highScore}</span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative bg-black/80 backdrop-blur-sm rounded-xl neon-border overflow-hidden"
        style={{ 
          width: '400px', 
          height: '400px',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.2), inset 0 0 20px rgba(0, 255, 255, 0.1)'
        }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(#0ff 1px, transparent 1px), linear-gradient(90deg, #0ff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className="absolute rounded-sm"
              style={{
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                backgroundColor: isHead ? '#fff' : '#0ff',
                boxShadow: isHead ? '0 0 10px #fff, 0 0 20px #0ff' : '0 0 5px #0ff',
                zIndex: isHead ? 10 : 5,
                transform: 'scale(0.9)'
              }}
            />
          );
        })}

        {/* Food */}
        <div
          className="absolute rounded-full"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            backgroundColor: '#f0f',
            boxShadow: '0 0 10px #f0f, 0 0 20px #f0f',
            transform: 'scale(0.8)',
            animation: 'pulse 1s infinite alternate'
          }}
        />

        {/* Overlays */}
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
            <h2 className="text-3xl font-display font-bold text-white neon-text mb-4">NEON SNAKE</h2>
            <p className="text-cyan-300 animate-pulse">Press any arrow key to start</p>
          </div>
        )}

        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <h2 className="text-3xl font-display font-bold text-white neon-text tracking-widest">PAUSED</h2>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
            <h2 className="text-4xl font-display font-bold text-red-500 mb-2" style={{ textShadow: '0 0 10px red, 0 0 20px red' }}>GAME OVER</h2>
            <p className="text-white text-xl mb-6">Score: <span className="neon-text">{score}</span></p>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-transparent border-2 border-cyan-400 text-cyan-400 font-display font-bold rounded hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_10px_#0ff] hover:shadow-[0_0_20px_#0ff]"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-gray-400 text-sm flex gap-4">
        <span><kbd className="bg-gray-800 px-2 py-1 rounded border border-gray-700">WASD</kbd> / <kbd className="bg-gray-800 px-2 py-1 rounded border border-gray-700">Arrows</kbd> to move</span>
        <span><kbd className="bg-gray-800 px-2 py-1 rounded border border-gray-700">Space</kbd> to pause</span>
      </div>
    </div>
  );
}
