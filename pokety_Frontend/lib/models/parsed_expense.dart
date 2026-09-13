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
      currency: json['currency'] as String,
      category: json['category'] as String,
      merchant: json['merchant'] as String,
      date: json['date'] as String,
      type: json['type'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'amount': amount,
      'currency': currency,
      'category': category,
      'merchant': merchant,
      'date': date,
      'type': type,
    };
  }
}
