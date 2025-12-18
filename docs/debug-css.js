// Paste this in browser console to check missing CSS classes
// Run on each page: Login, Dashboard, Landing, Editor

(function checkMissingCSS() {
  const allElements = document.querySelectorAll('*');
  const missing = new Set();
  const found = new Set();
  
  allElements.forEach(el => {
    el.classList.forEach(cls => {
      // Skip Tailwind utilities and common patterns
      if (/^(flex|grid|gap|p-|m-|w-|h-|text-|bg-|border-|rounded|hidden|block|inline|absolute|relative|fixed|sticky|top-|left-|right-|bottom-|z-|overflow|cursor|transition|duration|ease|opacity|scale|translate|rotate|animate-|hover:|focus:|active:|disabled:|sm:|md:|lg:|xl:|2xl:)/.test(cls)) {
        return;
      }
      
      // Check if class has styles
      const testEl = document.createElement('div');
      testEl.className = cls;
      document.body.appendChild(testEl);
      const styles = getComputedStyle(testEl);
      
      // Check for any non-default styles
      const hasStyles = 
        styles.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
        styles.color !== 'rgb(0, 0, 0)' ||
        styles.border !== '0px none rgb(0, 0, 0)' ||
        styles.padding !== '0px' ||
        styles.margin !== '0px' ||
        styles.display !== 'block' ||
        styles.position !== 'static';
      
      document.body.removeChild(testEl);
      
      if (hasStyles) {
        found.add(cls);
      } else {
        missing.add(cls);
      }
    });
  });
  
  console.log('%c✅ Found CSS Classes:', 'color: #22c55e; font-weight: bold');
  console.log([...found].sort().join(', '));
  
  console.log('%c❌ Missing CSS Classes:', 'color: #ef4444; font-weight: bold');
  console.log([...missing].sort());
  
  return { found: [...found], missing: [...missing] };
})();
