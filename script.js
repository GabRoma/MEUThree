import * as THREE from 'https://cdn.skypack.dev/three@0.150.1';

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', init);

function init() {
    startButton.style.display = 'none';

    // Crear escena, cámara y renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 5;

    // Crear objetos
    const objects = [];
    for (let i = 0; i < 50; i++) {
        const geometry = new THREE.SphereGeometry(Math.random() * 0.5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
        scene.add(mesh);
        objects.push(mesh);
    }

    // Configurar el análisis de audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioElement = new Audio('music/laberintos.mp3');
    const track = audioContext.createMediaElementSource(audioElement);
    const analyser = audioContext.createAnalyser();

    track.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    audioElement.play();

    function animate() {
        requestAnimationFrame(animate);

        analyser.getByteFrequencyData(dataArray);

        objects.forEach((obj, i) => {
            const scale = dataArray[i % bufferLength] / 50;
            obj.scale.set(scale, scale, scale);
            obj.material.color.setHSL(scale / 10, 0.5, 0.5);
        });

        renderer.render(scene, camera);
    }
    animate();
}
