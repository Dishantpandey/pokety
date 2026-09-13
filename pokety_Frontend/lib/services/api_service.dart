import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/parsed_expense.dart';

class ApiService {
  // Backend API URL - Update this based on your backend server
  static const String baseUrl = const String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://127.0.0.1:8000',
  );
  static const String apiEndpoint = '$baseUrl/api/v1/parse-expense';

  static Future<ParsedExpense?> parseExpense(String text) async {
    try {
      final response = await http.post(
        Uri.parse(apiEndpoint),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode({'text': text}),
      ).timeout(
        const Duration(seconds: 30),
        onTimeout: () {
          throw Exception('Backend connection timeout');
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonData = jsonDecode(response.body);
        return ParsedExpense.fromJson(jsonData);
      } else {
        print('Backend error: ${response.statusCode}');
        print('Response: ${response.body}');
        return null;
      }
    } catch (e) {
      print('Error parsing expense: $e');
      return null;
    }
  }
}
