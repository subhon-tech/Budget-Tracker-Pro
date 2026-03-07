// Temporary script to clear oversized cookies on localhost:3000
// Run: node clear-cookies-server.js
// Then visit http://localhost:3000/clear in browser
// After cookies are cleared, stop this and start normal dev server

const http = require('http');

const server = http.createServer((req, res) => {
    // Set very large header size tolerance
    const cookieNames = [
        'next-auth.session-token',
        '__Secure-next-auth.session-token',
        'next-auth.csrf-token',
        '__Secure-next-auth.csrf-token',
        'next-auth.callback-url',
        '__Secure-next-auth.callback-url',
        '__Host-next-auth.csrf-token',
    ];

    // Add chunked session tokens (0-9)
    for (let i = 0; i <= 9; i++) {
        cookieNames.push(`next-auth.session-token.${i}`);
        cookieNames.push(`__Secure-next-auth.session-token.${i}`);
    }

    // Create Set-Cookie headers to delete all auth cookies
    const clearHeaders = cookieNames.map(name =>
        `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`
    );

    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Set-Cookie': clearHeaders,
    });

    res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>Cookies Cleared</title></head>
        <body style="font-family: system-ui; display: flex; justify-content: center; align-items: center; height: 100vh; background: #111; color: #fff;">
            <div style="text-align: center;">
                <h1 style="color: #22c55e;">✅ Cookies Cleared Successfully!</h1>
                <p style="color: #888;">All NextAuth session cookies have been removed.</p>
                <p style="color: #888; margin-top: 20px;">Now:</p>
                <ol style="color: #ccc; text-align: left; display: inline-block;">
                    <li>Stop this temporary server (Ctrl+C in terminal)</li>
                    <li>Start your normal dev server: <code>npm run dev</code></li>
                    <li>Open <a href="http://localhost:3000" style="color: #22c55e;">localhost:3000</a></li>
                </ol>
            </div>
        </body>
        </html>
    `);
});

server.maxHeaderSize = 128 * 1024; // 128KB to accept the oversized cookies

server.listen(3000, () => {
    console.log('\n🧹 Cookie clearing server running on http://localhost:3000');
    console.log('👉 Open http://localhost:3000 in your browser to clear cookies');
    console.log('👉 Then stop this server (Ctrl+C) and run: npm run dev\n');
});
