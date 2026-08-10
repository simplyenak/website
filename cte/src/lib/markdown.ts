/**
 * Simple markdown to HTML converter
 */
export function renderMarkdown(markdown) {
  if (!markdown) return '';
  
  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-2xl font-bold mt-8 mb-4">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold mt-10 mb-6">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold mt-12 mb-8">$1</h1>');
  
  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-accent hover:underline">$1</a>');
  
  // Line breaks
  html = html.replace(/\n/g, '<br />');
  
  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul class="list-disc pl-6 space-y-2">$&</ul>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ol class="list-decimal pl-6 space-y-2">$&</ol>');
  
  return html;
}
