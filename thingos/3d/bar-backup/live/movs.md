# Patrones de movimiento
En este archivo se describen los comandos de movimiento y animación que son enviados al servidor o se reciben para su interpretación y coordinación.

- oid

## Avatares
- walk
	- f (forward): 1 / -1 / 0
	- r (rigth): 1 / -1 / 0

- jump
	- h: 1 / 0

- axis
	- y (giro sobre y): 1 / -1 / 0
	- v (velocidad): apm
	- a (algoritomo de aceleracion)

## Objetos en general
- mov
	- d (vector de dirección): [ dx, dy, dz ]
	- v (velocidad incial)
	- a (algoritomo de aceleracion)
	
- turn
	- d (vector de rotacion): [ rx, ry, rz ]
	- v (velocidad inicial)
	- a (algoritmo de aceleracion)

- scale
	- x (crecimiento en x)
	- y (crecimiento en y)
	- z (crecimiento en z)
	- v (velocidad incial)
	- a (algoritmo de aceleracion)

- tras
	- axis (centro de rotacion)
	- v (velocidad inicial)
	- a (algoritmo de aceleracion)

# Posición
- pos
	- x
	- y
	- z

- rot
	- x
	- y
	- z

- siz
	- x
	- y
	- z