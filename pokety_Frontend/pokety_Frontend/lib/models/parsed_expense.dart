class ParsedExpense {
  final double amount;
  final String currency;
  final String category;
  final String merchant;
  final String date;
  final String type;

  ParsedExpense({
    required this.amount,
    required this.currency,
    required this.category,
    required this.merchant,
    required this.date,
    required this.type,
  });

  factory ParsedExpense.fromJson(Map<String, dynamic> json) {
    return ParsedExpense(
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'] ?? 'INR',
      category: json['category'] ?? 'General',
      merchant: json['merchant'] ?? 'Unknown',
      date: json['date'] ?? '',
      type: json['type'] ?? 'expense',
    );
  }
}