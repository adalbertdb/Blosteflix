import 'package:flutter/material.dart';

class VideoCard extends StatelessWidget {
  final String id;
  final String thumbnail;
  final VoidCallback? onTap;

  const VideoCard({
    super.key,
    required this.id,
    required this.thumbnail,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Card(
        // Pequeña elevación para el efecto de profundidad
        elevation: 4,
        // Con shape le damos forma, en este caso, hacemos las esquinas redondeadas
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(
            16,
          ), // definimos el radio para las esquinas
        ),
        clipBehavior:
            Clip.antiAlias, // Con esto evitamos que las imágenes se salgan
        child: Container(
          height: 150, // Hacemos un contenedor de altura fija
          padding: const EdgeInsets.all(16),
          // Añadimos la imagen dentro de la propiedad decoration de la tarjeta
          decoration: BoxDecoration(
            // Añadimos un color de fondo del tema si no hay imagen
            color: Theme.of(context).disabledColor,
            // Añadimos la imagen para que ocupe todo el espacio
            image: DecorationImage(
              image: NetworkImage(thumbnail),
              fit: BoxFit.cover,
            ),
          ),
          child: Align(
            // Texto en la parte inferior izquierda
            alignment: Alignment.bottomLeft,
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
                id,
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.white, // Color del texto
                  fontFamily: 'Roboto', // Tipografía
                  // Sombra para el texto
                  shadows: const [
                    Shadow(
                      blurRadius: 6.0,
                      color: Colors.black45,
                      offset: Offset(2.0, 2.0),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
