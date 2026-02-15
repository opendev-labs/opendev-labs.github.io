
(function () {
    // Create the HUD container
    const hud = document.createElement('div');
    hud.id = 'void-hud';
    hud.style.position = 'fixed';
    hud.style.top = '-100%';
    hud.style.left = '0';
    hud.style.width = '100%';
    hud.style.height = '100%';
    hud.style.backgroundColor = 'rgba(0, 10, 0, 0.95)';
    hud.style.zIndex = '9999';
    hud.style.transition = 'top 0.5s ease-in-out';
    hud.style.display = 'flex';
    hud.style.flexDirection = 'column';
    hud.style.color = '#00ff41';
    hud.style.fontFamily = 'monospace';

    // Header
    const header = document.createElement('div');
    header.style.padding = '20px';
    header.style.borderBottom = '1px solid #00ff41';
    header.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <h1 style="margin:0; text-shadow: 0 0 10px #00ff41;">VOID PROTOCOL // HUD</h1>
            <button id="close-hud" style="background:none; border:1px solid #00ff41; color:#00ff41; cursor:pointer; padding:5px 10px;">CLOSE SYSTEMS</button>
        </div>
    `;
    hud.appendChild(header);

    // Content (Iframe to Void)
    const iframe = document.createElement('iframe');
    iframe.src = 'https://nanopi.web.app'; // Point to Void Dashboard
    iframe.style.flex = '1';
    iframe.style.border = 'none';
    hud.appendChild(iframe);

    document.body.appendChild(hud);

    // Toggle Button
    const btn = document.createElement('button');
    btn.innerText = 'INITIALIZE VOID';
    btn.style.position = 'fixed';
    btn.style.top = '10px';
    btn.style.left = '50%';
    btn.style.transform = 'translateX(-50%)';
    btn.style.zIndex = '9998'; // Below loader but above basic content
    btn.style.background = 'black';
    btn.style.color = '#00ff41';
    btn.style.border = '1px solid #00ff41';
    btn.style.padding = '5px 15px';
    btn.style.cursor = 'pointer';
    btn.style.fontFamily = 'monospace';
    btn.style.opacity = '0.7';
    btn.onmouseover = () => btn.style.opacity = '1';
    btn.onmouseout = () => btn.style.opacity = '0.7';

    btn.onclick = () => {
        hud.style.top = '0';
    };
    document.body.appendChild(btn);

    // Close logic
    document.getElementById('close-hud').onclick = () => {
        hud.style.top = '-100%';
    };
})();
