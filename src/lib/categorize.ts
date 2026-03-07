const CATEGORY_KEYWORDS: Record<string, string[]> = {
    'Food & Drink': [
        'starbucks', 'mcdonalds', 'subway', 'chipotle', 'dominos', 'pizza',
        'burger', 'cafe', 'restaurant', 'coffee', 'doordash', 'ubereats',
        'grubhub', 'dunkin', 'wendys', 'taco bell', 'kfc', 'chick-fil-a',
        'panera', 'diner', 'bakery', 'groceries', 'grocery', 'whole foods',
        'trader joe', 'kroger', 'safeway', 'food', 'lunch', 'dinner', 'breakfast',
    ],
    'Transportation': [
        'uber', 'lyft', 'gas', 'fuel', 'shell', 'chevron', 'bp',
        'exxon', 'parking', 'metro', 'transit', 'bus', 'train', 'taxi',
    ],
    'Shopping': [
        'amazon', 'target', 'walmart', 'costco', 'best buy', 'nike',
        'adidas', 'zara', 'h&m', 'ikea', 'apple store', 'mall', 'shop',
    ],
    'Entertainment': [
        'netflix', 'spotify', 'hulu', 'disney', 'hbo', 'youtube',
        'movie', 'cinema', 'theater', 'concert', 'game', 'steam',
    ],
    'Bills & Utilities': [
        'electric', 'water', 'internet', 'wifi', 'phone', 'verizon',
        'at&t', 't-mobile', 'comcast', 'utility', 'bill', 'insurance', 'rent',
    ],
    'Health & Fitness': [
        'gym', 'fitness', 'cvs', 'walgreens', 'pharmacy', 'doctor',
        'hospital', 'dental', 'medical', 'health', 'yoga',
    ],
    'Education': [
        'tuition', 'school', 'university', 'course', 'udemy', 'coursera',
        'textbook', 'book', 'library', 'education',
    ],
    'Travel': [
        'hotel', 'airbnb', 'flight', 'airline', 'airport', 'booking',
        'expedia', 'travel', 'vacation',
    ],
}

export const EXPENSE_CATEGORIES = [
    'Food & Drink', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Health & Fitness', 'Education', 'Travel',
    'Personal Care', 'Other',
]

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']

export const BILLS_SUBCATEGORIES = [
    'Mortgage',
    'Rent',
    'Car Insurance',
    'Car Lease',
    'Electricity',
    'Water',
    'Gas',
    'Internet/Wi-Fi',
    'Phone Line',
    'Home Loans',
    'Health Insurance',
]

export const CATEGORY_COLORS: Record<string, string> = {
    'Food & Drink': '#f97316',
    'Transportation': '#3b82f6',
    'Shopping': '#a855f7',
    'Entertainment': '#ec4899',
    'Bills & Utilities': '#64748b',
    'Health & Fitness': '#22c55e',
    'Education': '#eab308',
    'Travel': '#06b6d4',
    'Personal Care': '#f43f5e',
    'Salary': '#10b981',
    'Freelance': '#8b5cf6',
    'Investment': '#14b8a6',
    'Gift': '#f59e0b',
    'Other': '#94a3b8',
    'Recurring': '#8b5cf6',
    // Bills & Utilities subcategories
    'Bills & Utilities: Mortgage': '#475569',
    'Bills & Utilities: Rent': '#64748b',
    'Bills & Utilities: Car Insurance': '#6b7280',
    'Bills & Utilities: Car Lease': '#78716c',
    'Bills & Utilities: Electricity': '#eab308',
    'Bills & Utilities: Water': '#0ea5e9',
    'Bills & Utilities: Gas': '#f97316',
    'Bills & Utilities: Internet/Wi-Fi': '#8b5cf6',
    'Bills & Utilities: Phone Line': '#06b6d4',
    'Bills & Utilities: Home Loans': '#475569',
    'Bills & Utilities: Health Insurance': '#22c55e',
}

export function categorize(description: string): string {
    const lower = description.toLowerCase().trim()
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        for (const keyword of keywords) {
            if (lower.includes(keyword)) return category
        }
    }
    return 'Other'
}
