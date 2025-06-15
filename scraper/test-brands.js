const ProductParser = require('./src/product-parser');

// Test cases for the new brands and iPhone models
const testCases = [
    // New brands
    'Motorola Edge 30 Pro 256GB Black',
    'Realme GT Neo 3 128GB Blue',
    'Poco F4 GT 256GB Silver',
    'Vivo V23 5G 128GB Gold',
    
    // iPhone models that should now work
    'iPhone XS 64GB Space Gray Grade A',
    'iPhone SE 2022 128GB Red',
    'iPhone X 256GB Silver',
    'iPhone XR 128GB Blue',
    
    // Existing brands (should still work)
    'Samsung Galaxy S23 Ultra 512GB Phantom Black',
    'Huawei P50 Pro 256GB Golden',
    'Oppo Find X5 Pro 256GB White',
    'Xiaomi Mi 12 Pro 256GB Blue',
    
    // Numbered iPhone models (should still work)
    'iPhone 14 Pro Max 1TB Deep Purple',
    'iPhone 13 mini 128GB Pink'
];

console.log('Testing brand and model parsing...\n');

testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: "${testCase}"`);
    const result = ProductParser.parseProductTitle(testCase);
    console.log(`  Brand: ${result.brand}`);
    console.log(`  Model: ${result.model}`);
    console.log(`  Storage: ${result.storage}`);
    console.log(`  Color: ${result.color}`);
    console.log(`  Grade: ${result.grade}`);
    console.log('');
});
