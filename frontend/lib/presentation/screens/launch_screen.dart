import 'package:flutter/material.dart';
import 'package:frontend/domain/entities/video.dart';
// import 'package:frontend/presentation/screens/play_screen.dart';
import 'package:frontend/presentation/widgets/video_card.dart';
import 'package:frontend/repo_singleton.dart';

class LaunchScreen extends StatefulWidget {
  LaunchScreen({super.key});

  @override
  State<LaunchScreen> createState() => _LaunchScreenState();
}

class _LaunchScreenState extends State<LaunchScreen> {
  // Acceso al repositorio a través del Singleton
  final Future<List<Video>?> _listaVideosFuture = RepoSingleton().repo
      .getVideos();
  Video? currentVideo;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Blosteflix')),
      body: FutureBuilder<List<Video>?>(
        future: _listaVideosFuture, // Future del que dependemos
        builder: (context, asyncSnapshot) {
          // Cuando el Future se complete, tendremos el resultado en el snapshot
          // Según lo que este contenga, dibujaremos unos widgets u otros

          // Barra de progreso circular mientras se está cargando
          if (asyncSnapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          // Si el snapshot contiene algún error lo mostramos
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

          // Si llegamos aquí, vemos si el snapshot contiene datos.
          // (Si no contiene generamos una lista vacía)
          final lista = asyncSnapshot.data ?? const <Video>[];

          // Si la lista de provincias está vacía (el snapshot no contiene datos) lo indicamos
          if (lista.isEmpty) {
            return const Center(child: Text("No se han encontrado vídeos"));
          }

          // Si contiene datos, generamos las tarjetas
          return Padding(
            // Padding para dejar un margen
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                currentVideo != null ? Placeholder() : SizedBox(),
                Expanded(
                  child: ListView.builder(
                    // Generamos la lista de widgets proporcionándole la lista de provincias
                    itemCount: lista.length,
                    itemBuilder: (context, i) {
                      final v = lista[i];
                      return VideoCard(
                        id: v.id,
                        thumbnail: v.thumbnail ?? '',
                        onTap: () {
                          setState(() {
                            currentVideo = v;
                          });
                          /* Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => PlayScreen(idVideo: v.id),
                            ),
                          ); */
                        },
                      );
                    },
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
