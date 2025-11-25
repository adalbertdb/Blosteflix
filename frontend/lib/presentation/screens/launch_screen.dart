import 'package:flutter/material.dart';
import 'package:frontend/domain/entities/video.dart';
import 'package:frontend/presentation/widgets/video_card.dart';
import 'package:frontend/presentation/widgets/videoWidget.dart';
import 'package:frontend/repo_singleton.dart';

class LaunchScreen extends StatefulWidget {
  const LaunchScreen({super.key});

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
        future: _listaVideosFuture,
        builder: (context, asyncSnapshot) {
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
          final lista = asyncSnapshot.data ?? const <Video>[];

          // Si la lista está vacía lo indicamos
          if (lista.isEmpty) {
            return const Center(child: Text("No se han encontrado vídeos"));
          }

          // Si contiene datos, generamos las tarjetas
          return Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Mostrar video solo si hay uno seleccionado
                if (currentVideo != null) ...[
                  SizedBox(
                    height: 250,
                    child: VideoWidget(
                      videoId: currentVideo!.id,
                    ), // ← CORREGIDO
                  ),
                  const SizedBox(height: 16),
                  Text(
                    currentVideo!.id,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                ],

                // Lista de videos
                Expanded(
                  child: ListView.builder(
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
