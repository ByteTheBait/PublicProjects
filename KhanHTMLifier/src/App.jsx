import React, { useState } from 'react';
import { Copy, Download, Code, Eye } from 'lucide-react';

export default function KAConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const convertToHTML = () => {
    const parts = [];
    parts.push('<!DOCTYPE html>');
    parts.push('<html lang="en">');
    parts.push('<head>');
    parts.push('    <meta charset="UTF-8">');
    parts.push('    <meta name="viewport" content="width=device-width, initial-scale=1.0">');
    parts.push('    <title>Khan Academy Sketch</title>');
    parts.push('    <script src="https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.6.6/processing.min.js"></script>');
    parts.push('    <style>');
    parts.push('        body {');
    parts.push('            margin: 0;');
    parts.push('            padding: 20px;');
    parts.push('            display: flex;');
    parts.push('            justify-content: center;');
    parts.push('            align-items: center;');
    parts.push('            min-height: 100vh;');
    parts.push('            background: #f0f0f0;');
    parts.push('            font-family: Arial, sans-serif;');
    parts.push('        }');
    parts.push('        #canvas-container {');
    parts.push('            background: white;');
    parts.push('            padding: 20px;');
    parts.push('            border-radius: 8px;');
    parts.push('            box-shadow: 0 2px 10px rgba(0,0,0,0.1);');
    parts.push('        }');
    parts.push('        canvas {');
    parts.push('            display: block;');
    parts.push('        }');
    parts.push('    </style>');
    parts.push('</head>');
    parts.push('<body>');
    parts.push('    <div id="canvas-container">');
    parts.push('        <canvas id="mycanvas"></canvas>');
    parts.push('    </div>');
    parts.push('    ');
    parts.push('    <script>');
    parts.push('        window.addEventListener("load", function() {');
    parts.push('            var processingCode = ' + JSON.stringify(input) + ';');
    parts.push('            var canvas = document.getElementById("mycanvas");');
    parts.push('            var processing = new Processing(canvas, processingCode);');
    parts.push('        });');
    parts.push('    </script>');
    parts.push('</body>');
    parts.push('</html>');
    
    setOutput(parts.join('\n'));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert('Copied to clipboard!');
  };

  const downloadHTML = () => {
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sketch.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exampleCode = `// Example: Bouncing Ball
var x = 200;
var y = 200;
var speedX = 3;
var speedY = 2;

draw = function() {
    background(255);
    
    // Draw ball
    fill(255, 0, 0);
    ellipse(x, y, 50, 50);
    
    // Move ball
    x += speedX;
    y += speedY;
    
    // Bounce off edges
    if (x > 400 || x < 0) {
        speedX *= -1;
    }
    if (y > 400 || y < 0) {
        speedY *= -1;
    }
};`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Khan Academy to HTML Converter
            </h1>
          </div>
          
          <p className="text-gray-600 mb-6">
            Paste your Khan Academy Processing.js code below and convert it to a standalone HTML file.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Khan Academy Code (Processing.js)
                </label>
                <button
                  onClick={() => setInput(exampleCode)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors"
                >
                  Load Example
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="// Paste your Khan Academy code here&#10;// Example:&#10;draw = function() {&#10;    background(255);&#10;    ellipse(200, 200, 100, 100);&#10;};"
                className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm focus:border-indigo-500 focus:outline-none resize-none"
              />
              <button
                onClick={convertToHTML}
                disabled={!input.trim()}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Convert to HTML
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  HTML Output
                </label>
                {output && (
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                    <button
                      onClick={downloadHTML}
                      className="flex items-center gap-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                )}
              </div>
              <textarea
                value={output}
                readOnly
                placeholder="Converted HTML will appear here..."
                className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-none"
              />
              {output && (
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  {showPreview ? 'Hide' : 'Show'} Preview
                </button>
              )}
            </div>
          </div>

          {showPreview && output && (
            <div className="mt-6 p-4 bg-gray-50 border-2 border-gray-300 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Preview:</h3>
              <div className="bg-white p-4 rounded border border-gray-200">
                <iframe
                  srcDoc={output}
                  className="w-full h-96 border-0"
                  title="Preview"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
            <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
              <li>Copy your Khan Academy Processing.js code (or click "Load Example" to test)</li>
              <li>Paste it into the left text area</li>
              <li>Click "Convert to HTML"</li>
              <li>Click "Show Preview" to test it works</li>
              <li>Download the HTML file and open it in any browser!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}