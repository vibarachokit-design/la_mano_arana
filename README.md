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
- Cada edificio superado por primera vez regala un sobre de 3 láminas (con una rara o mejor) que se abre al tiro, con animación.
- Los puntos de cada partida se guardan como moco puntos: un sobre de 3 láminas cuesta 9.000 y una lámina suelta 2.000. No se guardan sobres: el de cada edificio se abre al tiro y el resto se compra.
- ADN: se gana jugando (1 por cada 2 bichos, +10 al superar un edificio) y canjeando repetidas. En POTENCIAR se usa para mejorar la mano: escudo de telaraña, vida extra, imán de bichos y mutación más larga.
- Cada edificio tiene su propio final animado: ventana (1), café y puerta (2), hamaca en la playa (3), choque contra el vidrio (4), chimenea (5) y el profesor asusta a la mano (6).
- Cada edificio es más difícil que el anterior (más peligros, más rápidos y con menos aviso).
- El avance se guarda en el navegador. En el álbum, "Respaldo del avance" permite copiar un código o descargar un archivo para recuperarlo o pasarlo a otro dispositivo.
- Para probar todos los edificios sin jugar: agrega `?desbloquear` al final de la dirección.

## Estructura

- `index.html`, `game.js`, `level-hazards.js`, `endings.js`, `album.js`: el juego. `endings.js` tiene los finales animados de los edificios 2 a 6.
- `assets/end-*.webp`: sprites de esos finales.
- `assets/`: imágenes, láminas (`card-XX.webp`, miniaturas en `assets/thumbs/`) y música (`musica*.mp3`).
- `LEEME.txt`: historial de versiones.
