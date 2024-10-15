document.addEventListener('DOMContentLoaded', () => {
    const character = document.querySelector('.character');
    let obstacles = [];
    let puntos = 0; // Variable para los puntos
    let obstaclesPassed = 0; // Contador de obstáculos que han pasado
    let obstacleInterval; // Variable para el intervalo de obstáculos

    let characterX = 200;
    let characterY = 400;

    // Obtener los elementos de audio desde el HTML
    const backgroundMusic = document.getElementById('background-music');
    const gameOverMusic = document.getElementById('game-over-music');

    // Crear el botón de reinicio
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Reiniciar Juego';
    restartButton.style.position = 'fixed';
    restartButton.style.top = '50%';
    restartButton.style.left = '50%';
    restartButton.style.transform = 'translate(-50%, -50%)';
    restartButton.style.fontSize = '24px';
    restartButton.style.padding = '10px 20px';
    restartButton.style.display = 'none'; // Ocultar el botón inicialmente
    document.body.appendChild(restartButton);

    // Crear el aviso y botón de inicio
    const startButton = document.getElementById('start-button');
    const inicio = document.getElementById('inicio');
    inicio.style.display = 'block'; // Mostrar aviso al cargar la página

    // Crear el marcador de puntos y añadirlo al DOM
    const scoreDisplay = document.createElement('div');
    scoreDisplay.style.position = 'fixed'; // Fijar la posición
    scoreDisplay.style.top = '20px'; // Parte superior con margen
    scoreDisplay.style.right = '20px'; // Parte derecha con margen
    scoreDisplay.style.fontSize = '24px'; // Tamaño de fuente
    scoreDisplay.style.color = 'black'; // Color del texto
    scoreDisplay.style.padding = '10px'; // Añadir un poco de espacio interno (padding)
    scoreDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'; // Fondo semitransparente para destacar
    scoreDisplay.style.borderRadius = '8px'; // Bordes redondeados
    scoreDisplay.textContent = `Puntos: ${puntos}`;
    document.body.appendChild(scoreDisplay); // Añadirlo al cuerpo del documento

    // Crear el contador de obstáculos pasados y añadirlo al DOM
    const passedObstaclesDisplay = document.createElement('div');
    passedObstaclesDisplay.style.position = 'fixed'; // Fijar la posición
    passedObstaclesDisplay.style.top = '60px'; // Parte superior con margen
    passedObstaclesDisplay.style.right = '20px'; // Parte derecha con margen
    passedObstaclesDisplay.style.fontSize = '24px'; // Tamaño de fuente
    passedObstaclesDisplay.style.color = 'black'; // Color del texto
    passedObstaclesDisplay.style.padding = '10px'; // Añadir un poco de espacio interno (padding)
    passedObstaclesDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'; // Fondo semitransparente para destacar
    passedObstaclesDisplay.style.borderRadius = '8px'; // Bordes redondeados
    passedObstaclesDisplay.textContent = `Obstáculos Pasados: ${obstaclesPassed}`;
    document.body.appendChild(passedObstaclesDisplay); // Añadirlo al cuerpo del documento

    // Función para actualizar los puntos
    function actualizarPuntos() {
        puntos++;
        scoreDisplay.textContent = `Puntos: ${puntos}`;
    }

    // Función para crear un obstáculo
    function createObstacle() {
        let obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.left = `${Math.random() * (window.innerWidth - 70)}px`; // Ajustar el tamaño
        obstacle.style.top = '0px';
        document.body.appendChild(obstacle);
        obstacles.push(obstacle);
    }

    // Función para actualizar el juego en cada frame
    function update() {
        character.style.left = `${characterX}px`;
        character.style.top = `${characterY}px`;

        obstacles.forEach((obstacle, index) => {
            let obstacleY = parseInt(obstacle.style.top);
            obstacleY += 5; // Velocidad de caída

            // Verificar colisión (atrapar el obstáculo)
            if (characterX + character.offsetWidth >= parseInt(obstacle.style.left) && 
                characterX <= parseInt(obstacle.style.left) + obstacle.offsetWidth &&
                characterY + character.offsetHeight >= obstacleY &&
                characterY <= obstacleY + obstacle.offsetHeight) {
                document.body.removeChild(obstacle); // Eliminar el obstáculo
                obstacles.splice(index, 1); // Eliminar de la lista de obstáculos
                actualizarPuntos(); // Aumentar los puntos
            } else if (obstacleY > window.innerHeight) {
                document.body.removeChild(obstacle); // Eliminar si se sale de la pantalla
                obstacles.splice(index, 1);
                obstaclesPassed++; // Aumentar contador de obstáculos pasados
                passedObstaclesDisplay.textContent = `Obstáculos Pasados: ${obstaclesPassed}`; // Actualizar el contador

                // Verificar si el jugador ha perdido
                if (obstaclesPassed >= 15) {
                    alert('¡Perdiste! Puntos finales: ' + puntos);
                    backgroundMusic.pause(); // Detener la música de fondo
                    gameOverMusic.play(); // Reproducir música de Game Over
                    mostrarBotonReiniciar(); // Mostrar botón de reinicio
                }
            } else {
                obstacle.style.top = `${obstacleY}px`;
                obstacle.style.left = `${parseInt(obstacle.style.left)}px`;
            }
        });

        requestAnimationFrame(update);
    }

    // Función para mostrar el botón de reinicio
    function mostrarBotonReiniciar() {
        restartButton.style.display = 'block'; // Mostrar el botón
        restartButton.onclick = reiniciarJuego; // Asignar función de reinicio al botón
    }

    // Función para reiniciar el juego
    function reiniciarJuego() {
        // Reiniciar variables
        puntos = 0;
        obstaclesPassed = 0; // Reiniciar el contador de obstáculos pasados
        characterX = 200;
        characterY = 400;
        scoreDisplay.textContent = `Puntos: ${puntos}`;
        passedObstaclesDisplay.textContent = `Obstáculos Pasados: ${obstaclesPassed}`; // Reiniciar el contador en la UI
        restartButton.style.display = 'none'; // Ocultar el botón
        backgroundMusic.currentTime = 0; // Reiniciar la música de fondo
        backgroundMusic.play(); // Reproducir la música de fondo
        obstacles.forEach(obstacle => document.body.removeChild(obstacle)); // Eliminar obstáculos
        obstacles = []; // Reiniciar la lista de obstáculos

        // Limpiar el intervalo de creación de obstáculos, si existe
        clearInterval(obstacleInterval); 
        obstacleInterval = setInterval(createObstacle, 1000); // Crear un nuevo intervalo de obstáculos
        createObstacle(); // Crear un nuevo obstáculo inmediatamente
        update(); // Reiniciar la actualización del juego
    }

    // Función para mover al personaje con las teclas de flecha
    function moveCharacter(event) {
        const speed = 60; // Aumentar la velocidad del personaje
        switch(event.key) {
            case 'ArrowUp':
                characterY -= speed; // Mover hacia arriba
                break;
            case 'ArrowDown':
                characterY += speed; // Mover hacia abajo
                break;
            case 'ArrowLeft':
                characterX -= speed; // Mover hacia la izquierda
                break;
            case 'ArrowRight':
                characterX += speed; // Mover hacia la derecha
                break;
        }
    }

    // Evento para iniciar el juego
    startButton.addEventListener('click', () => {
        inicio.style.display = 'none'; // Ocultar el aviso
        backgroundMusic.loop = true; // Hacer que la música de fondo se repita
        backgroundMusic.play(); // Reproducir la música de fondo
        obstacleInterval = setInterval(createObstacle, 1000); // Crear un obstáculo cada segundo
        createObstacle(); // Crear el primer obstáculo inmediatamente
        update(); // Iniciar la actualización del juego
    });

    // Añadir evento de movimiento al personaje
    window.addEventListener('keydown', moveCharacter);
});
