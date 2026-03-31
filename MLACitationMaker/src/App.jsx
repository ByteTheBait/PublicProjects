import React, { useState } from 'react';
import { AlertCircle, LinkIcon, CheckCircle } from 'lucide-react';

export default function MLACitationGenerator() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [citation, setCitation] = useState('');
    const [error, setError] = useState('');

    const extractMetadata = (html, url) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract title
        let title = doc.querySelector('meta[property="og:title"]')?.content ||
            doc.querySelector('meta[name="twitter:title"]')?.content ||
            doc.querySelector('title')?.textContent ||
            'No Title Found';

        // Extract author
        let author = doc.querySelector('meta[name="author"]')?.content ||
            doc.querySelector('meta[property="article:author"]')?.content ||
            doc.querySelector('[rel="author"]')?.textContent ||
            '';

        // Extract site name
        let siteName = doc.querySelector('meta[property="og:site_name"]')?.content ||
            new URL(url).hostname.replace('www.', '') ||
            '';

        // Extract publication date
        let pubDate = doc.querySelector('meta[property="article:published_time"]')?.content ||
            doc.querySelector('meta[name="date"]')?.content ||
            doc.querySelector('meta[name="publish-date"]')?.content ||
            doc.querySelector('time[datetime]')?.getAttribute('datetime') ||
            '';

        return { title, author, siteName, pubDate, url };
    };

    const formatMLACitation = (metadata) => {
        const { title, author, siteName, pubDate, url } = metadata;

        let citation = '';

        // Author (Last, First.)
        if (author) {
            const names = author.trim().split(' ');
            if (names.length > 1) {
                citation += `${names[names.length - 1]}, ${names.slice(0, -1).join(' ')}. `;
            } else {
                citation += `${author}. `;
            }
        }

        // Title in quotes
        citation += `"${title.trim()}." `;

        // Website/Container name in italics
        if (siteName) {
            citation += `*${siteName}*, `;
        }

        // Publication date
        if (pubDate) {
            const date = new Date(pubDate);
            if (!isNaN(date)) {
                citation += `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })}. ${date.getFullYear()}, `;
            }
        }

        // URL
        citation += `${url}.`;

        // Access date
        const today = new Date();
        citation += ` Accessed ${today.getDate()} ${today.toLocaleString('en-US', { month: 'short' })}. ${today.getFullYear()}.`;

        return citation;
    };

    const handleScan = async () => {
        if (!url.trim()) {
            setError('Please enter a URL');
            return;
        }

        // Validate URL
        let fullUrl = url.trim();
        if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
            fullUrl = 'https://' + fullUrl;
        }

        try {
            new URL(fullUrl);
        } catch (e) {
            setError('Please enter a valid URL');
            return;
        }

        setLoading(true);
        setError('');
        setCitation('');

        try {
            const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(fullUrl));

            if (!response.ok) {
                throw new Error('Failed to fetch website');
            }

            const html = await response.text();
            const metadata = extractMetadata(html, fullUrl);
            const mlaCitation = formatMLACitation(metadata);

            setCitation(mlaCitation);
        } catch (err) {
            setError('Unable to scan website. Please check the URL and try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const copyCitation = () => {
        navigator.clipboard.writeText(citation);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <LinkIcon className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-800">MLA Citation Generator</h1>
                    </div>

                    <p className="text-gray-600 mb-6">
                        Enter a website URL to automatically generate an MLA format citation.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website URL
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                                    placeholder="https://example.com/article"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                />
                                <button
                                    onClick={handleScan}
                                    disabled={loading}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
                                >
                                    {loading ? 'Scanning...' : 'Generate'}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-red-800">{error}</p>
                            </div>
                        )}

                        {citation && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-green-700">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium">Citation Generated</span>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <p className="text-gray-800 leading-relaxed">{citation}</p>
                                </div>

                                <button
                                    onClick={copyCitation}
                                    className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                                >
                                    Copy to Clipboard
                                </button>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Note:</strong> Always verify the citation against the actual source.
                                        Some metadata may not be available or may be incorrect.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h2 className="font-semibold text-gray-800 mb-2">MLA 9th Edition Format:</h2>
                        <p className="text-sm text-gray-600">
                            Author Last Name, First Name. "Title of Web Page." <em>Website Name</em>,
                            Day Month Year, URL. Accessed Day Month Year.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}