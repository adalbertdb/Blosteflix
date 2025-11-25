import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import 'package:http/http.dart' as http;

class VideoWidget extends StatefulWidget {
  final String videoId;

  const VideoWidget({super.key, required this.videoId});

  @override
  State<VideoWidget> createState() => _VideoWidgetState();
}

class _VideoWidgetState extends State<VideoWidget> {
  VideoPlayerController? _controller;
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _initializeVideo();
  }

  Future<void> _initializeVideo() async {
    try {
      // Use .m3u8 extension to ensure ExoPlayer recognizes it as HLS
      final hlsUrl =
          'http://10.0.2.2:3000/api/videolist/videos/${widget.videoId}/index.m3u8';
      print('🎬 Initializing video with URL: $hlsUrl');

      // First, test if we can fetch the playlist manually
      try {
        final response = await http.get(Uri.parse(hlsUrl));

        if (response.statusCode != 200) {
          throw Exception(
            'Server returned ${response.statusCode}: ${response.body}',
          );
        }

        if (!response.body.contains('#EXTM3U')) {
          throw Exception('Response is not a valid m3u8 playlist');
        }
      } catch (e) {
        print('Failed to fetch playlist: $e');
        throw Exception('Cannot reach server: $e');
      }

      // Create controller
      final controller = VideoPlayerController.networkUrl(Uri.parse(hlsUrl));

      // Initialize
      await controller.initialize();

      if (!controller.value.isInitialized) {
        throw Exception('Failed to initialize video controller');
      }

      // Only set state if widget is still mounted
      if (!mounted) {
        controller.dispose();
        return;
      }

      setState(() {
        _controller = controller;
        _isLoading = false;
      });

      // Auto-play after initialization
      await _controller!.play();
      _controller!.setLooping(true);
    } catch (error) {
      print('Error initializing video: $error');
      if (!mounted) return;

      setState(() {
        _isLoading = false;
        _error = error.toString();
      });
    }
  }

  @override
  void didUpdateWidget(VideoWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.videoId != widget.videoId) {
      _controller?.pause();
      _controller?.dispose();
      setState(() {
        _controller = null;
        _isLoading = true;
        _error = null;
      });
      _initializeVideo();
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error, color: Colors.red, size: 60),
            const SizedBox(height: 16),
            Text(
              'Error al cargar el vídeo',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                _error!,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 12),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _error = null;
                  _isLoading = true;
                });
                _initializeVideo();
              },
              child: const Text('Reintentar'),
            ),
          ],
        ),
      );
    }

    if (_isLoading) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Cargando vídeo...'),
          ],
        ),
      );
    }

    if (_controller == null || !_controller!.value.isInitialized) {
      return const Center(child: CircularProgressIndicator());
    }

    return AspectRatio(
      aspectRatio: _controller!.value.aspectRatio,
      child: Stack(
        children: [
          VideoPlayer(_controller!),
          Align(
            alignment: Alignment.bottomCenter,
            child: VideoProgressIndicator(
              _controller!,
              allowScrubbing: true,
              padding: const EdgeInsets.all(8.0),
            ),
          ),
        ],
      ),
    );
  }
}
