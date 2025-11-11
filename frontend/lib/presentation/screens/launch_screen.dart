import 'package:flutter/material.dart';
import 'package:frontend/domain/entities/video.dart';
import 'package:frontend/presentation/screens/play_screen.dart';
import 'package:frontend/repo_singleton.dart';

class LaunchScreen extends StatelessWidget {
  LaunchScreen({super.key});

  // Accés al repositori a través del Singleton
  // Obtenim amb ell un Future amb la llista de províncies
  final Future<List<Video>?> _listaVideosFuture = RepoSingleton().repo
      .getVideos();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Vídeos')),
      body: FutureBuilder<List<Video>?>(
        future: _listaVideosFuture, // Future del que depenem
        builder: (context, asyncSnapshot) {
          // Quan el Future es complete, tindrem el resultat a l'snapshot
          // Segons el que aquest continga, dibuixarem uns widgets o altres

          // Barra de progrés circular mentre s'està carregant
          if (asyncSnapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          // Si l'snapshot conté algun error el mostrem
          if (asyncSnapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Text(
                  "Se ha producido un error: ${asyncSnapshot.error}",
                  textAlign: TextAlign.center,
                ),
              ),
            );
          }

          // Si arribem aci, veiem si l'snapshot conté dades.
          // (Si no en conté generem una llista buida)
          final lista = asyncSnapshot.data ?? const <Video>[];

          // Si la llista de províncies és buida (l'snapshot no conté dades) ho indiquem
          if (lista.isEmpty) {
            return const Center(child: Text("No se han encontrado vídeos"));
          }

          // Si conté dades, generem les targetes
          return Padding(
            // Padding per deixar uun marge
            padding: const EdgeInsets.all(16),
            child: ListView.builder(
              // Generem la llista de widgets proporcionant-li la llista de províncies
              itemCount: lista.length,
              itemBuilder: (context, i) {
                final v = lista[i];
                return VideoCard(
                  id: v.id,
                  thumbnail: v.thumbnail ?? '',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => PlayScreen(idVideo: v.id),
                      ),
                    );
                  },
                );
              },
            ),
          );
        },
      ),
    );
  }
}

// Widget per representar la targeta  (Card) amb la província
// Podriem definir-la en un fitxer a banda, dins la carpeta presentation/widgets
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
        // Xicoteta elevació per l'efecte de profunditat
        elevation: 4,
        // Amb shape li donem forma, en aquest cas, fem les vores arrodonides
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(
            16,
          ), // definim el radi per a les vores
        ),
        clipBehavior:
            Clip.antiAlias, // Amb això evitem que les imatges se n'isquen
        child: Container(
          height: 150, // Fem un contenidor d'alçada fixa
          padding: const EdgeInsets.all(16),
          // Afegim la imatge dins la propietat decoration de la targeta
          decoration: BoxDecoration(
            // Afegim un color de fons des del tema si no hi ha imatge
            color: Theme.of(context).disabledColor,
            // Afegim la imatge perquè ocupe tot l'espai
            image: DecorationImage(
              image: NetworkImage(thumbnail),
              fit: BoxFit.cover,
            ),
          ),
          child: Align(
            // Text a la part inferior esquerra
            alignment: Alignment.bottomLeft,
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
                id,
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.white, // Color del text
                  fontFamily: 'Roboto', // Tipografia
                  // Ombra per al text
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
