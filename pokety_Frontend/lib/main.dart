import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:fl_chart/fl_chart.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pokety - AI Expense Tracker',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
        textTheme: GoogleFonts.poppinsTextTheme(Theme.of(context).textTheme),
      ),
      home: const ExpenseHomeScreen(),
    );
  }
}

class ExpenseHomeScreen extends StatefulWidget {
  const ExpenseHomeScreen({super.key});

  @override
  State<ExpenseHomeScreen> createState() => _ExpenseHomeScreenState();
}

class _ExpenseHomeScreenState extends State<ExpenseHomeScreen> {
  final TextEditingController _controller = TextEditingController();
  bool _isLoading = false;
  List<dynamic> _expenses = [];
  Map<String, dynamic> _analytics = {};

  // Localhost URL for FastAPI backend
  final String baseUrl = const String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://127.0.0.1:8000',
  );

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    await Future.wait([
      _fetchExpenses(),
      _fetchAnalytics(),
    ]);
  }

  Future<void> _fetchExpenses() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/expenses'));
      if (response.statusCode == 200) {
        setState(() {
          _expenses = json.decode(response.body);
        });
      }
    } catch (e) {
      print("Error fetching expenses: $e");
    }
  }

  Future<void> _fetchAnalytics() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/analytics'));
      if (response.statusCode == 200) {
        setState(() {
          _analytics = json.decode(response.body);
        });
      }
    } catch (e) {
      print("Error fetching analytics: $e");
    }
  }

  Future<void> _parseAndSave() async {
    if (_controller.text.trim().isEmpty) return;
    setState(() => _isLoading = true);

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/parse-expense'),
        headers: {"Content-Type": "application/json"},
        body: json.encode({"text": _controller.text}),
      );

      if (response.statusCode == 200) {
        _controller.clear();
        await _fetchData(); // Refresh list and chart
      }
    } catch (e) {
      print("Error parsing expense: $e");
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text('Pokety — AI Expense Tracker', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Input Card Section
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text('Track with Natural Language', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.deepPurple)),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _controller,
                      decoration: InputDecoration(
                        hintText: 'e.g., Spent 500 on dinner or Uber 300',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        filled: true,
                        fillColor: Colors.grey[50],
                      ),
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton.icon(
                      onPressed: _isLoading ? null : _parseAndSave,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.deepPurple,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      icon: _isLoading 
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : const Icon(Icons.auto_awesome),
                      label: Text(_isLoading ? 'AI is parsing...' : 'Parse & Save Expense', style: const TextStyle(fontSize: 16)),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Analytics / Pie Chart Section
            if (_analytics.isNotEmpty) ...[
              const Text('Spending Analytics', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 10),
              Card(
                elevation: 4,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: SizedBox(
                    height: 200,
                    child: PieChart(
                      PieChartData(
                        sectionsSpace: 4,
                        centerSpaceRadius: 40,
                        sections: _analytics.entries.map((entry) {
                          final index = _analytics.keys.toList().indexOf(entry.key);
                          final colors = [Colors.deepPurple, Colors.orange, Colors.teal, Colors.pink, Colors.blue];
                          final color = colors[index % colors.length];
                          return PieChartSectionData(
                            color: color,
                            value: (entry.value as num).toDouble(),
                            title: '${entry.key}\n₹${entry.value}',
                            radius: 50,
                            titleStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                          );
                        }).toList(),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],

            // History Transactions Section
            const Text('Recent Transactions', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            _expenses.isEmpty
                ? const Center(child: Padding(padding: EdgeInsets.all(20.0), child: Text('No expenses recorded yet. Try adding one above!')))
                : ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _expenses.length,
                    itemBuilder: (context, index) {
                      final item = _expenses[index];
                      return Card(
                        elevation: 2,
                        margin: const EdgeInsets.only(bottom: 10),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: Colors.deepPurple.shade50,
                            child: const Icon(Icons.receipt_long, color: Colors.deepPurple),
                          ),
                          title: Text(item['raw_text'] ?? '', style: const TextStyle(fontWeight: FontWeight.w600)),
                          subtitle: Text('Category: ${item['category']} | Date: ${item['date']}'),
                          trailing: Text('₹${item['amount']}', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.green[700])),
                        ),
                      );
                    },
                  ),
          ],
        ),
      ),
    );
  }
}