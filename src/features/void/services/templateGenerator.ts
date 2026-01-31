/**
 * Template Code Generator
 * Generates production-ready template code for deployment
 */

export interface TemplateFiles {
    [path: string]: string;
}

export interface GeneratedTemplate {
    files: TemplateFiles;
    packageJson?: any;
    readme: string;
}

export class TemplateGenerator {
    /**
     * Generate Portfolio Template (HTML/CSS/JS)
     */
    static generatePortfolio(projectName: string): GeneratedTemplate {
        return {
            files: {
                'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName} - Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="logo">${projectName}</div>
            <ul class="nav-links">
                <li><a href="#work">Work</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <section class="hero">
        <div class="container">
            <h1>Creative Portfolio</h1>
            <p>Showcasing Photography & Design Excellence</p>
        </div>
    </section>

    <section id="work" class="work">
        <div class="container">
            <h2>Selected Work</h2>
            <div class="project-grid">
                <div class="project-card">
                    <div class="project-image"></div>
                    <h3>Project 1</h3>
                    <p>Photography</p>
                </div>
                <div class="project-card">
                    <div class="project-image"></div>
                    <h3>Project 2</h3>
                    <p>Design</p>
                </div>
                <div class="project-card">
                    <div class="project-image"></div>
                    <h3>Project 3</h3>
                    <p>Branding</p>
                </div>
            </div>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2>About</h2>
            <p>I'm a creative professional specializing in photography and design.</p>
        </div>
    </section>

    <section id="contact" class="contact">
        <div class="container">
            <h2>Get In Touch</h2>
            <form class="contact-form">
                <input type="text" placeholder="Name" required>
                <input type="email" placeholder="Email" required>
                <textarea placeholder="Message" required></textarea>
                <button type="submit">Send Message</button>
            </form>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2026 ${projectName}. Built with OpenDev Labs.</p>
        </div>
    </footer>
</body>
</html>`,
                'style.css': `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: #000;
    color: #fff;
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.navbar {
    padding: 20px 0;
    border-bottom: 1px solid #222;
}

.navbar .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 24px;
    font-weight: bold;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 30px;
}

.nav-links a {
    color: #999;
    text-decoration: none;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: #fff;
}

.hero {
    padding: 120px 0;
    text-align: center;
}

.hero h1 {
    font-size: 72px;
    font-weight: bold;
    margin-bottom: 20px;
}

.hero p {
    font-size: 20px;
    color: #999;
}

.work {
    padding: 80px 0;
}

.work h2 {
    font-size: 36px;
    margin-bottom: 40px;
}

.project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.project-card {
    background: #111;
    border: 1px solid #222;
    padding: 20px;
    transition: transform 0.3s, border-color 0.3s;
}

.project-card:hover {
    transform: translateY(-5px);
    border-color: #fff;
}

.project-image {
    width: 100%;
    height: 200px;
    background: #222;
    margin-bottom: 15px;
}

.project-card h3 {
    font-size: 20px;
    margin-bottom: 5px;
}

.project-card p {
    color: #999;
    font-size: 14px;
}

.about, .contact {
    padding: 80px 0;
    text-align: center;
}

.about h2, .contact h2 {
    font-size: 36px;
    margin-bottom: 20px;
}

.about p {
    font-size: 18px;
    color: #999;
    max-width: 600px;
    margin: 0 auto;
}

.contact-form {
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.contact-form input,
.contact-form textarea {
    padding: 15px;
    background: #111;
    border: 1px solid #222;
    color: #fff;
    font-size: 16px;
}

.contact-form textarea {
    min-height: 150px;
    resize: vertical;
}

.contact-form button {
    padding: 15px;
    background: #fff;
    color: #000;
    border: none;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s;
}

.contact-form button:hover {
    background: #ddd;
}

footer {
    padding: 40px 0;
    border-top: 1px solid #222;
    text-align: center;
    color: #666;
    font-size: 14px;
}

@media (max-width: 768px) {
    .hero h1 {
        font-size: 48px;
    }
    
    .navbar .container {
        flex-direction: column;
        gap: 20px;
    }
    
    .project-grid {
        grid-template-columns: 1fr;
    }
}`
            },
            readme: `# ${projectName}

A modern, minimal portfolio website built with OpenDev Labs.

## Features
- Responsive design
- Project showcase grid
- Contact form
- Clean, modern aesthetic

## Deploy
- **Vercel**: \`vercel --prod\`
- **GitHub Pages**: Push to \`gh-pages\` branch
- **Firebase**: \`firebase deploy\`

Built with ❤️ using OpenDev Labs
`
        };
    }

    /**
     * Generate minimal starter files for other templates
     * Full implementations can be added later
     */
    static generateTemplate(templateId: string, projectName: string): GeneratedTemplate {
        switch (templateId) {
            case 'tmpl_portfolio':
                return this.generatePortfolio(projectName);

            case 'tmpl_ecommerce':
            case 'tmpl_saas':
            case 'tmpl_agency':
            case 'tmpl_restaurant':
            case 'tmpl_realestate':
            case 'tmpl_blog':
            case 'tmpl_startup':
            case 'tmpl_personal':
            case 'tmpl_blank':
            default:
                return this.generatePortfolio(projectName); // Fallback for now
        }
    }
}

export const templateGenerator = new TemplateGenerator();
