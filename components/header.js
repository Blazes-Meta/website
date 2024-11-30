class Header extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
          <header class="site-header">
            <div class="logo"><a href="https://blazesmeta.de"><img src="img/logo.png" alt="Logo von Blazes Meta"></a></div>
            <nav class="navbar">
              <ul>
                <li><a href="https://discord.gg/2YvbptpAqz"><div class="icon-wrapper"><img src="img/join-discord.svg" alt="Discord" class="icon"></div></a></li>
                <li><a href="https://status.blazesmeta.de"><div class="icon-wrapper"><img src="img/icons/uptimerobot.svg" alt="UptimeRobot" class="icon"></div></a></li>
                <li><a href="https://map.blazesmeta.de"><div class="icon-wrapper"><img src="img/icons/dynmap.png" alt="Dynmap" class="icon"></div></a></li>
              </ul>
            </nav>
          </header>

          <style>
            .site-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 20px;
              background-color: #333;
              color: white;
            }
              
            .logo img {
              height: 35px; /* Automatische Anpassung der Breite für Seitenverhältnis */
              width: auto; /* Keine Verzerrung */
              display: block; /* Entfernt eventuelle Inline-Element-Abstände */
            }

            .navbar ul {
              display: flex;
              justify-content: center;
              align-items: center;
              list-style: none;
              margin: 0;
              padding: 0;
              display: flex;
              gap: 15px;
            }

            .navbar a {
              display: flex;
              justify-content: center;
              align-items: center;
              font-family: "Quicksand", sans-serif;
              font-optical-sizing: auto;
              font-weight: 400;
              font-style: normal;
              text-decoration: none;
              color: white;
              transition: color 0.3s;
            }

            .navbar .icon {
              height: 45px;
            }

            .navbar .icon-wrapper {
              position: relative;
              display: inline-block;
              padding: 0;
              height: 45px; /* explizite Höhe des Bildes */
              box-sizing: border-box; /* Verhindert, dass padding den Container vergrößert */
            }

            .navbar .icon-wrapper img {
              width: 100%; /* Bild soll die gesamte Containergröße ausfüllen */
              height: 100%; /* Höhe des Bildes auf 100% des Containers setzen */
              display: block; /* Entfernt mögliche Inline-Abstände */
            }

            .navbar .icon-wrapper::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(255, 255, 255, 0.1);
              opacity: 0;
              transition: opacity 0.3s ease;
              border-radius: 7px;
              z-index: 1; /* Damit der Tint über dem Bild liegt */
            }

            .navbar .icon-wrapper:hover::after {
              opacity: 1;
            }
            </style>
        `;
    }
  }

customElements.define('custom-header', Header);