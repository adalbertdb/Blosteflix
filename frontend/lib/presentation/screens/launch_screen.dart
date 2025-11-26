// ============================================
// LAUNCH SCREEN - MAIN APPLICATION UI
// ============================================
// Primary screen showing video list and player
// Uses FutureBuilder pattern for async video loading
// Manages video selection and playback state

import 'package:flutter/material.dart';
import 'package:frontend/domain/entities/video.dart';
import 'package:frontend/presentation/widgets/video_card.dart';
import 'package:frontend/presentation/widgets/videoWidget.dart';
import 'package:frontend/repo_singleton.dart';

/**
 * LaunchScreen - Main stateful widget for video streaming
 * Displays:
 * - AppBar with app title
 * - Video player widget (when video selected)
 * - Scrollable list of available videos
 */
class LaunchScreen extends StatefulWidget {
  const LaunchScreen({super.key});

  @override
  State<LaunchScreen> createState() => _LaunchScreenState();
}

/**
 * _LaunchScreenState - State management for launch screen
 * Handles:
 * - Loading videos from API via repository singleton
 * - Tracking currently selected video
 * - Managing UI refresh when video selection changes
 */
class _LaunchScreenState extends State<LaunchScreen> {
  // ============================================
  // STATE VARIABLES
  // ============================================

  // Load video list once via repository singleton pattern
  // RepoSingleton() returns a single shared repository instance
  // .repo.getVideos() fetches all videos asynchronously from backend
  final Future<List<Video>?> _listaVideosFuture = RepoSingleton().repo
      .getVideos();

  // Currently selected video for playback
  // null = no video selected, don't show player
  Video? currentVideo;

  // ============================================
  // BUILD METHOD
  // ============================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Simple app header
      appBar: AppBar(title: const Text('Blosteflix')),

      // Body uses FutureBuilder to manage async video loading states
      body: FutureBuilder<List<Video>?>(
        // Pass future that will load videos
        future: _listaVideosFuture,

        // Build UI based on connection state (loading/error/success)
        builder: (context, asyncSnapshot) {
          // ============================================
          // LOADING STATE
          // ============================================
          // Show spinner while videos are being fetched
          if (asyncSnapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          // ============================================
          // ERROR STATE
          // ============================================
          // If API request fails, display error message
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

          // ============================================
          // SUCCESS STATE
          // ============================================
          // FutureBuilder successfully received video data
          // Use empty list if data is null
          final lista = asyncSnapshot.data ?? const <Video>[];

          // If no videos found, show empty state
          if (lista.isEmpty) {
            return const Center(child: Text("No se han encontrado vídeos"));
          }

          // Videos loaded successfully - display them
          return Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // ============================================
                // VIDEO PLAYER SECTION
                // ============================================

                // Only show player and title if video is selected
                if (currentVideo != null) ...[
                  // Player container with fixed height
                  SizedBox(
                    height: 250,
                    // Pass selected video ID to player widget
                    // VideoWidget will build HLS stream URL and handle playback
                    child: VideoWidget(videoId: currentVideo!.id),
                  ),
                  const SizedBox(height: 16),

                  // Display selected video title below player
                  Text(
                    currentVideo!.id,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                ],

                // ============================================
                // VIDEO LIST SECTION
                // ============================================

                // Scrollable list of all available videos
                // Expanded fills remaining space with scrolling
                Expanded(
                  child: ListView.builder(
                    itemCount: lista.length,
                    // Build each video card
                    itemBuilder: (context, i) {
                      final v = lista[i];
                      return VideoCard(
                        // Video ID (title)
                        id: v.id,
                        // Video thumbnail image URL
                        thumbnail: v.thumbnail ?? '',
                        // When user taps video card:
                        // 1. Update currentVideo state
                        // 2. Trigger rebuild
                        // 3. Player appears and plays this video
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
