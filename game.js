<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Juego del Sapo</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: 'Courier New', monospace;
            background-color: #000000;
            color: #c2f13f;
            flex-direction: column;
            overflow: hidden;
            touch-action: none; /* Desactiva la manipulación del zoom y el desplazamiento */
            -ms-touch-action: none; /* IE 10+ */
            user-select: none; /* Evita la selección de texto */
        }

        canvas {
            border: 2px solid #0bf612;
            box-shadow: 0 0 10px #222;
            background-color: #151b1e;
            background-image: url('fondo.webp');
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            background-image: linear-gradient(rgba(137, 137, 137, 0.103), rgba(255, 255, 255, 0.368)), url('fondo.webp');
        height: 80%;
        }

        .score {
            position: absolute;
            top: 20px;
            left: 20px;
            font-size: 24px;
            z-index: 1;
        }

        button {
            width: 60px;
            height: 60px;
            background-color: rgba(255, 255, 255, 0.085);
            border: 2px solid #0bf612;
            border-radius: 50%;
            font-size: 20px;
            color: #151b1e;
            cursor: pointer;
        }

        button#startBtn {
            position: absolute;
            top: 50%;
            left: 50%;
            padding: 10px 20px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            background-color: #0bf612;
            color: #151b1e;
            box-shadow: 0 0 5px #222;
            cursor: pointer;
            width: 25%;
            transform: translate(-50%, -50%);
        }

        button#muteBtn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            font-size: 24px;
            z-index: 1;
        }

        /* Estilo para pantallas grandes (ordenador) */
        #controls {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        /* Estilo para pantallas pequeñas (móviles) */
        @media (max-width: 768px) {
            .score {
                font-size: 18px;
            }

            canvas {
                width: 90%;
                height: 80%;
                max-height: calc(60vh - 10px); /* Ajusta el canvas para que los botones quepan debajo */
            }

            #controls {
                display: flex;
                position: absolute;
                bottom: 5px;
                left: 50%;
                transform: translateX(-50%);
                width: 80%;
                justify-content: space-evenly;
            }

            #controls button {
                flex: 1;
                margin: 5px;
                font-size: 16px;
            }

            #startBtn {
                width: 35%;
            }
        }

        @media (orientation: landscape) and (max-width: 768px) {
            body {
                flex-direction: column;
            }

            canvas {
                width: 100%;
                height: 60%;
                max-height: calc(80vh - 120px); /* Ajusta el canvas para que los botones quepan debajo */
            }

            #controls {
                position: absolute;
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
                width: 80%;
                display: flex;
                justify-content: space-evenly;
            }

            #controls button {
                flex: 1;
                margin: 5px;
                font-size: 16px;
            }

            #startBtn {
                display: block;
                width: 35%;
            }
        }
    </style>
</head>
<body>
    <div class="score">Puntaje: <span id="score">0</span></div>
    <button id="startBtn">Iniciar</button>
    <button id="muteBtn">🔇</button>
    <div id="controls">
        <button id="leftBtn">⬅️</button>
        <button id="tongueBtn">👅</button>
        
        <button id="jumpBtn">⬆️</button>
        <button id="rightBtn">➡️</button>
    </div>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    
    <script src="game.js"></script>
</body>
</html>

