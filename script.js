document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    let isGameOver = false;
    let moveSnowwhiteInterval;
    let snowwhiteSpeed = 1000;
    let timerInterval;
    let backgroundMusic = document.getElementById("background-music");
    
    startButton.addEventListener('click', startGame);
    startButton.addEventListener('touchstart', startGame);
    
    const restartButton = document.getElementById('restart-button');
    restartButton.addEventListener('click', () => {
        isGameOver = false;
        clearInterval(moveSnowwhiteInterval);
        clearInterval(timerInterval);

        var LifeQ = document.getElementById("LifeQ");
        LifeQ.value = 160;
        LifeQ.style.accentColor = "";
        document.body.style.backgroundColor = "";
        var snowwhite = document.getElementById("snowwhite");
        snowwhite.src = "biancaviva.png";
        var queen = document.getElementById("queen");
        queen.src = "queenandapple.png";
        queen.style.transform = "scale(1)";
        var gameStatus = document.getElementById('gameStatus');
        gameStatus.textContent = "";
        gameStatus.style.color = "";
        document.getElementById('timer').textContent = "30";
        var timerElement = document.getElementById('timer');
        timerElement.textContent = "30";
        timerElement.style.display = "none";
        
        snowwhiteSpeed = 1000;
        startGame();
    });

    function startGame() {
        var timerElement = document.getElementById('timer');
        timerElement.style.display = "block";
        timerElement.style.color = "black";

        restartButton.style.display = "none";
        console.log("Il gioco sta iniziando!");
        startButton.style.display = "none";
        var LifeQ = document.getElementById("LifeQ");
        LifeQ.style.width = "70%";
        LifeQ.style.height = "50px"

        document.getElementById('sium').style.display = 'none';

        SetBackground();
        OnGame();
        startCountdown();
        var backgroundMusic = document.getElementById('background-music');
        backgroundMusic.play();
        
        console.log("background attivo");

        // Gestione del movimento per il touch
        document.addEventListener('touchmove', (event) => {
            if (!isGameOver) {
                const touch = event.touches[0];
                // Creiamo un oggetto evento personalizzato con le coordinate del touch
                const touchEvent = {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                };
                MoveQueen(touchEvent); // Passiamo l'evento touch alla funzione MoveQueen
            }
        });

        moveSnowwhiteInterval = setInterval(() => {
            MoveSnowwhiteRandomly();
        }, snowwhiteSpeed);
    }

    // Gestione del movimento del mouse
    document.addEventListener('mousemove', (event) => {
        if (!isGameOver) {
            MoveQueen(event); // Usa direttamente l'evento mouse
        }
    });

    function startCountdown() {
        var startTime = new Date().getTime(); // Tempo di inizio del gioco in millisecondi
        var duration = 30 * 1000; // Durata del countdown in millisecondi (30 secondi)
        var timerElement = document.getElementById('timer');
    
        function updateTimer() {
            var currentTime = new Date().getTime();
            var elapsedTime = currentTime - startTime;
            var timeLeft = Math.max(duration - elapsedTime, 0); // Assicura che il timer non diventi negativo
            var secondsLeft = Math.ceil(timeLeft / 1000); // Converti il tempo rimanente in secondi
            timerElement.textContent = secondsLeft;
    
            if (timeLeft <= 0) {
                clearInterval(timerInterval); // Ferma il timer se il tempo è scaduto
                youLose(); // Il giocatore ha perso
            } else if (LifeQ.value <= 0) {
                clearInterval(timerInterval); // Ferma il timer se la vita del giocatore è arrivata a zero
                youWin(); // Il giocatore ha vinto
            }
            if (timeLeft <= 10500) {
                console.log("Less than 10 seconds left, changing color to red");
                timerElement.style.color = "red";
            }
        }
    
        updateTimer(); // Aggiorna il timer immediatamente dopo l'avvio
        timerInterval = setInterval(updateTimer, 1000); // Aggiorna il timer ogni secondo
    }

    function OnGame() {
        document.getElementById('timer').style.display = 'block';
        document.getElementById('LifeQ').style.display = 'block';
        document.getElementById('queen').style.display = 'block';
        document.getElementById('snowwhite').style.display = 'block';
    }

    function SetBackground() {
        document.body.style.backgroundImage = "url('gamingBack.jpg')";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundAttachment = "fixed";
    }

    function MoveQueen(event) {
        if (!isGameOver) {
            var queen = document.getElementById("queen");
            queen.style.display = "block";
            queen.style.left = event.clientX + "px";
            queen.style.top = event.clientY + "px";

            var snowwhite = document.getElementById("snowwhite");

            if (isColliding(queen, snowwhite)) {
                ChangeLife();
                MoveSnowwhiteRandomly();
            }
        }
    }

    function MoveSnowwhiteRandomly() {
        if (!isGameOver) {
            var snowwhite = document.getElementById("snowwhite");
            var maxX = window.innerWidth - snowwhite.clientWidth;
            var maxY = window.innerHeight - snowwhite.clientHeight;

            var newX = Math.random() * maxX;
            var newY = Math.random() * maxY;

            snowwhite.style.left = newX + "px";
            snowwhite.style.top = newY + "px";
            var queen = document.getElementById("queen");
            RotateQueen(queen, snowwhite);
            console.log("si sta girando");
        }
    }

    function RotateQueen(queen, snowwhite) {
        var queenRect = queen.getBoundingClientRect();
        var snowwhiteRect = snowwhite.getBoundingClientRect();

        if (queenRect.left < snowwhiteRect.left) {
            // Biancaneve è alla sinistra della regina
            queen.style.transform = "scaleX(-1)";
        } else {
            // Biancaneve è alla destra della regina
            queen.style.transform = "scaleX(1)";
        }
    }

    function isColliding(element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();

        return (
            rect1.left < rect2.right &&
            rect1.right > rect2.left &&
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top
        );
    }

    function ChangeLife() {
        if (!isGameOver) {
            var LifeQ = document.getElementById("LifeQ");
            LifeQ.value -= 3;
            snowwhiteSpeed -= 100;
            
            if (LifeQ.value < 50) {
                LifeQ.style.accentColor = "red";
            }
    
            if (LifeQ.value <= 0) {
                LifeQ.value = 0;
                document.body.style.backgroundColor = "red";
                var snowwhite = document.getElementById("snowwhite");
                snowwhite.src = "biancaneveaddormentata.png";
                var queen = document.getElementById("queen");
                queen.src = "queensmiling_remv.png";
                ShowGameOver();
                StopGame();
                console.log("gioco finito");
            }
        }
    }

    function ShowRestartButton() {
        var restartButton = document.getElementById('restart-button');
        restartButton.style.display = 'block';
    }

    function youLose() {
        var gameStatus = document.getElementById('gameStatus');
        gameStatus.textContent = "Hai perso!";
        gameStatus.style.color = "red";
        ShowGameOver("lose"); // Passa il tipo di evento
        StopGame();
    }
    
    function youWin() {
        var gameStatus = document.getElementById('gameStatus');
        gameStatus.textContent = "Hai vinto!";
        gameStatus.style.color = "green";
        ShowGameOver("win"); // Passa il tipo di evento
        StopGame();
    }
    

    function ShowGameOver(result) {
        ZoomOnQueen();
        var backgroundMusic = document.getElementById("background-music");
        backgroundMusic.pause();
        console.log("Musica spenta");
    
        var gameoverSound = document.getElementById("game-over-sound");
    
        var queen = document.getElementById("queen");
        if (result === "win") {
            // Cambia immagine e suono per la vittoria
            queen.src = "queen_smiling_remv.png";
            gameoverSound.src = "laugh.mp3";
            console.log("Suono di risata caricato");
        } else if (result === "lose") {
            // Cambia immagine e suono per la sconfitta
            queen.src = "Designer.png";
            gameoverSound.src = "cry.mp3";
            console.log("Suono di pianto caricato");
        }
    
        gameoverSound.play(); // Riproduci il suono corrispondente
        console.log("Suono di game over riprodotto");
    
        restartButton.style.display = 'block';
        clearInterval(moveSnowwhiteInterval);
        ShowRestartButton();
    }
    

    function ZoomOnQueen() {
        var queen = document.getElementById("queen");
        queen.style.transition = "all 2s ease-in-out";
        queen.style.transform = "scale(2)";

        setTimeout(() => {
            queen.style.transition = "none";
        }, 2000);
    }

    function StopGame() {
        isGameOver = true;
        
        document.removeEventListener('mousemove', MoveQueen);
        document.removeEventListener('touchmove', MoveQueen);
        document.removeEventListener('click', ChangeLife);
        document.removeEventListener('touchstart', ChangeLife);

        clearInterval(moveSnowwhiteInterval);
        clearInterval(timerInterval);
    }
});






