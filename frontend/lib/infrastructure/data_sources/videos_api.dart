// Clase es la que interactúa con la API para obtener la información
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class VideosApi {
  // URL base que se proporcionará en el momento de instanciar
  String baseURL;

  // Constructor
  VideosApi(this.baseURL);

  // Obtiene la lista de videos
  Future<List<dynamic>> getVideos() async {
    String url = baseURL;

    http.Response data = await http.get(Uri.parse(url));
    if (data.statusCode == HttpStatus.ok) {
      String body = utf8.decode(data.bodyBytes);
      final bodyJSON = jsonDecode(body) as List;

      return bodyJSON;
    } else {
      return [];
    }
  }

  // Obtiene una lista de videos mediante un topic
  Future<List<dynamic>> getVideosByTopic(String topic) async {
    String url = "$baseURL/$topic";

    http.Response data = await http.get(Uri.parse(url));
    if (data.statusCode == HttpStatus.ok) {
      String body = utf8.decode(data.bodyBytes);
      final bodyJSON = jsonDecode(body) as List;

      return bodyJSON;
    } else {
      return [];
    }
  }

  // Obtiene información de un video en concreto
  Future<Map<String, dynamic>> getVideoById(String id) async {
    String url = "$baseURL/$id";

    http.Response data = await http.get(Uri.parse(url));
    if (data.statusCode == HttpStatus.ok) {
      String body = utf8.decode(data.bodyBytes);
      final bodyJSON = jsonDecode(body);

      return bodyJSON;
    } else {
      return {};
    }
  }
}
