# La Mano Araña Mutante

Juego arcade de escalada: guía a la mano araña por 6 edificios de 10 pisos cada uno,
esquiva peligros, junta bichos y dale un susto al profesor dormido.
Incluye un álbum de 40 láminas coleccionables.

## Jugar

- **En línea:** https://vibarachokit-design.github.io/la_mano_arana/ (requiere activar GitHub Pages).
- **En tu computador:** descarga el repositorio (Code → Download ZIP), descomprímelo y abre `index.html`.

## Controles

- Arrastra la mano, o usa ← → (también A / D).
- Espacio o botón TELARAÑA: escudo de 2 segundos (recarga en 6).
- P o Esc: pausa. Enter: empezar.

## Progreso

- Los edificios se desbloquean de a uno al ganar el anterior.
- Sobres: uno de 1 lámina la primera vez que llegas a cada piso, y uno especial de 3 láminas al ganar cada edificio.
- Los puntos de cada partida van a un monedero: cada lámina sorpresa cuesta 1.000 puntos.
- El avance se guarda en el navegador.
- Para probar todos los edificios sin jugar: agrega `?desbloquear` al final de la dirección.

## Estructura

- `index.html`, `game.js`, `level-hazards.js`, `album.js`: el juego.
- `assets/`: imágenes, láminas (`card-XX.webp`, miniaturas en `assets/thumbs/`) y música (`musica*.mp3`).
- `LEEME.txt`: historial de versiones.
