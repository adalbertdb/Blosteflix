import 'package:flutter/material.dart';
import 'package:dynamic_color/dynamic_color.dart';
import 'package:frontend/presentation/screens/launch_screen.dart';

const seed = Color(0xFF6750A4); // Color semilla

void main() => runApp(BlosteflixApp());

class BlosteflixApp extends StatelessWidget {
  const BlosteflixApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Hacemos uso de colores dinámicos si están definidos en el sistema
    // DynamicColorBuilder debe envolver el MaterialApp dentro del builder
    return DynamicColorBuilder(
      builder: (ColorScheme? lightDyn, ColorScheme? darkDyn) {
        final ColorScheme light =
            (lightDyn?.harmonized()) ??
            ColorScheme.fromSeed(seedColor: seed, brightness: Brightness.light);

        final ColorScheme dark =
            (darkDyn?.harmonized()) ??
            ColorScheme.fromSeed(seedColor: seed, brightness: Brightness.dark);

        return MaterialApp(
          debugShowCheckedModeBanner: false,
          themeMode: ThemeMode.system,
          theme: ThemeData(useMaterial3: true, colorScheme: light),
          darkTheme: ThemeData(useMaterial3: true, colorScheme: dark),
          home: LaunchScreen(),
        );
      },
    );
  }
}
