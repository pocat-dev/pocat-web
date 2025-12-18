// 🎨 Quick Tailwind CSS Test - Paste in Browser Console
console.log('🎨 Testing Tailwind CSS...');

// Create test element
const test = document.createElement('div');
test.className = 'bg-blue-500 text-white p-4 rounded-lg fixed top-4 right-4 z-50';
test.innerHTML = '✅ Tailwind Test';
document.body.appendChild(test);

// Check styles
const style = getComputedStyle(test);
const results = {
  'bg-blue-500': style.backgroundColor === 'rgb(59, 130, 246)',
  'text-white': style.color === 'rgb(255, 255, 255)', 
  'p-4': style.padding.includes('16px'),
  'rounded-lg': style.borderRadius === '8px'
};

console.table(results);
console.log(Object.values(results).every(Boolean) ? '✅ Tailwind CSS Working!' : '❌ Tailwind CSS Issues');

setTimeout(() => test.remove(), 3000);
