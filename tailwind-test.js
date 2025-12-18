// Tailwind CSS Test Script - Run in Browser Console
// Copy and paste this entire script into your browser console

(function testTailwindCSS() {
  console.log('🎨 Testing Tailwind CSS...\n');
  
  // Test 1: Check if Tailwind classes exist in stylesheets
  const stylesheets = Array.from(document.styleSheets);
  let tailwindFound = false;
  
  stylesheets.forEach((sheet, index) => {
    try {
      const rules = Array.from(sheet.cssRules || sheet.rules || []);
      const tailwindRules = rules.filter(rule => 
        rule.selectorText && (
          rule.selectorText.includes('.bg-') ||
          rule.selectorText.includes('.text-') ||
          rule.selectorText.includes('.p-') ||
          rule.selectorText.includes('.m-') ||
          rule.selectorText.includes('.flex') ||
          rule.selectorText.includes('.grid')
        )
      );
      
      if (tailwindRules.length > 0) {
        tailwindFound = true;
        console.log(`✅ Stylesheet ${index}: Found ${tailwindRules.length} Tailwind rules`);
      }
    } catch (e) {
      console.log(`⚠️ Stylesheet ${index}: Cannot access (CORS)`);
    }
  });
  
  // Test 2: Create test element with Tailwind classes
  const testDiv = document.createElement('div');
  testDiv.className = 'bg-blue-500 text-white p-4 rounded-lg shadow-lg';
  testDiv.style.position = 'fixed';
  testDiv.style.top = '20px';
  testDiv.style.right = '20px';
  testDiv.style.zIndex = '9999';
  testDiv.innerHTML = '🎨 Tailwind Test';
  document.body.appendChild(testDiv);
  
  // Check computed styles
  const computedStyle = window.getComputedStyle(testDiv);
  const tests = [
    { class: 'bg-blue-500', property: 'backgroundColor', expected: 'rgb(59, 130, 246)' },
    { class: 'text-white', property: 'color', expected: 'rgb(255, 255, 255)' },
    { class: 'p-4', property: 'padding', expected: '16px' },
    { class: 'rounded-lg', property: 'borderRadius', expected: '8px' }
  ];
  
  console.log('\n📊 Tailwind Class Tests:');
  tests.forEach(test => {
    const actual = computedStyle[test.property];
    const passed = actual === test.expected || actual.includes(test.expected.replace('px', ''));
    console.log(`${passed ? '✅' : '❌'} ${test.class}: ${actual} ${passed ? '(PASS)' : '(FAIL)'}`);
  });
  
  // Test 3: Check for CSS custom properties (design system)
  const rootStyle = getComputedStyle(document.documentElement);
  const customProps = [
    '--color-primary-600',
    '--color-surface-primary',
    '--spacing-4',
    '--font-size-base'
  ];
  
  console.log('\n🎨 Design System Variables:');
  customProps.forEach(prop => {
    const value = rootStyle.getPropertyValue(prop);
    console.log(`${value ? '✅' : '❌'} ${prop}: ${value || 'Not found'}`);
  });
  
  // Test 4: Check if Tailwind utilities work
  console.log('\n🔧 Utility Class Test:');
  const utilityTest = document.createElement('div');
  utilityTest.className = 'hidden';
  document.body.appendChild(utilityTest);
  const isHidden = window.getComputedStyle(utilityTest).display === 'none';
  console.log(`${isHidden ? '✅' : '❌'} .hidden utility: ${isHidden ? 'Working' : 'Not working'}`);
  
  // Cleanup and summary
  setTimeout(() => {
    testDiv.remove();
    utilityTest.remove();
    
    console.log('\n📋 SUMMARY:');
    console.log(`Tailwind CSS: ${tailwindFound ? '✅ LOADED' : '❌ NOT LOADED'}`);
    console.log('Check individual tests above for details.');
    
    if (!tailwindFound) {
      console.log('\n🔧 TROUBLESHOOTING:');
      console.log('1. Check if Tailwind CSS is imported in your main CSS file');
      console.log('2. Verify Vite config includes Tailwind plugin');
      console.log('3. Check if CSS file is properly linked in HTML');
      console.log('4. Run: pnpm run build to see if CSS is generated');
    }
  }, 3000);
  
})();
