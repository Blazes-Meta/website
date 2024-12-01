class Footer extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
          <link rel="stylesheet" href="style/header.css">
          
          <header class="header">
            <div class="logo"><a href="https://blazesmeta.de"><img src="img/logo.png" alt="Logo von Blazes Meta"></a></div>
            <nav class="navbar">
              <ul>
                <li><a href="https://discord.gg/2YvbptpAqz"><div class="icon-wrapper"><img src="img/join-discord.svg" alt="Discord" class="icon show-mobile"></div></a></li>
                <li><a href="https://status.blazesmeta.de"><div class="icon-wrapper"><img src="img/icons/uptimerobot.svg" alt="UptimeRobot" class="icon"></div></a></li>
                <li><a href="https://play.blazesmeta.de:32866"><div class="icon-wrapper"><img src="img/icons/dynmap.png" alt="Dynmap" class="icon"></div></a></li>
              </ul>
            </nav>
          </header>
        `;
    }
  }

customElements.define('custom-footer', Footer);