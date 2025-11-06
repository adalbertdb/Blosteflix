class Video {
  String id;
  String? topic;
  String? description;
  double? duration;
  String? thumbnail;

  // Constructor y argumentos
  Video({
    required this.id,
    this.topic,
    this.description,
    this.duration,
    this.thumbnail,
  });

  @override
  String toString() {
    return '''\x1B[34mId:\t\t\x1B[36m$id\n\x1B[0m
\x1B[34mTopic:\t\x1B[36m$topic\n\x1B[0m
\x1B[34mDescription:\t\x1B[36m${description.toString()}\n\x1B[0m
\x1B[34mDuration:\t\t\x1B[36m$duration\n\x1B[0m
\x1B[34mThumbnail:\t\x1B[36m$thumbnail\n\x1B[0m''';
  }
}
