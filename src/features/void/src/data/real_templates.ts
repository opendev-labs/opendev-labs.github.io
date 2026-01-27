export const VOID_LANDING_PAGE_CODE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Void - Next Gen Serverless</title>
    <style>
        body {
            background-color: #000;
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            overflow: hidden;
        }
        .container {
            text-align: center;
            padding: 20px;
            z-index: 10;
        }
        h1 {
            font-size: 4rem;
            font-weight: 800;
            margin: 0 0 20px 0;
            letter-spacing: -2px;
            background: linear-gradient(to right, #fff, #666);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        p {
            font-size: 1.5rem;
            color: #888;
            max-width: 600px;
            margin: 0 auto 40px auto;
            line-height: 1.5;
        }
        .btn {
            display: inline-block;
            background: #fff;
            color: #000;
            padding: 12px 32px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            transition: transform 0.2s, opacity 0.2s;
        }
        .btn:hover {
            transform: scale(1.05);
            opacity: 0.9;
        }
        .grid {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
            background-size: 50px 50px;
            pointer-events: none;
            z-index: 1;
        }
        .glow {
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 0;
        }
    </style>
</head>
<body>
    <div class="grid"></div>
    <div class="glow"></div>
    <div class="container">
        <h1>VOID</h1>
        <p>The next-generation serverless platform for modern developers. Deploy instantly, scale infinitely.</p>
        <a href="https://void-zero.web.app" class="btn">Get Started</a>
    </div>
</body>
</html>
`;

export const NEXTJS_STARTER_CODE = {
    'package.json': JSON.stringify({
        name: "next-starter",
        version: "0.1.0",
        private: true,
        scripts: {
            "dev": "next dev",
            "build": "next build",
            "start": "next start"
        },
        dependencies: {
            "next": "latest",
            "react": "latest",
            "react-dom": "latest"
        }
    }, null, 2),
    'pages/index.js': `
export default function Home() {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: 50 }}>
      <h1>Welcome to Next.js on Void</h1>
      <p>This is a starter template deployed via Void.</p>
    </div>
  )
}
    `
};

export const REAL_TEMPLATES: Record<string, Record<string, string>> = {
    'landing-page': {
        'index.html': VOID_LANDING_PAGE_CODE
    },
    'nextjs-starter': NEXTJS_STARTER_CODE,
    // default fallback
    'default': {
        'README.md': '# Hosted on Void\n\nThis project was deployed using the Void platform.'
    }
};
