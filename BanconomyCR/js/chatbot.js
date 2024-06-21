//Instrucciones
// Para implementar este script inserte este script en el body de la página
// El token de la URL se encuentra en el canal Mobile de Virtual Agents.


// Specifies the token endpoint URL. 
const tokenEndpointURL = new URL('https://defaulte7984cac25434f888f979524335e6b.c4.environment.api.powerplatform.com/powervirtualagents/botsbyschema/cr29b_banconomyBot/directline/token?api-version=2022-03-01-preview');


//Inserta html del chatbot

    // Crear el elemento de botón
  var boton = document.createElement("button");
  boton.id = "botonToggle";
  boton.textContent = "Chat";
  boton.onclick = toggleVentana;

  // Crear el elemento de ventana flotante
  var popUp = document.createElement("div");
  popUp.id = "popUp";

  // Crear el elemento de banner
  var banner = document.createElement("div");
  banner.id = "banner";
  var bannerTexto = document.createElement("p");
  bannerTexto.textContent = "Banconomy Bot";
  banner.appendChild(bannerTexto);

  // Crear el elemento de webchat
  var webchat = document.createElement("div");
  webchat.id = "webchat";
  webchat.setAttribute("role", "main");

  // Agregar los elementos al popUp
  popUp.appendChild(banner);
  popUp.appendChild(webchat);

  // Agregar el botón y la ventana al documento
  document.body.appendChild(boton);
  document.body.appendChild(popUp);


//Agrega funciones pop up
  var init_win_toggle = document.getElementById("popUp");
        init_win_toggle.style.display="none"
       function toggleVentana() {
            var ventana = document.getElementById("popUp");
            var botonToggle = document.getElementById("botonToggle");

            if (ventana.style.display === "none" || ventana.style.display === "") {
                ventana.style.display = "block";
                botonToggle.innerText = "Ocultar";
            } else {
                ventana.style.display = "none";
                botonToggle.innerText = "Chat";
            }
        }

        // Función para cerrar la ventana flotante
        function cerrarVentana() {
            var ventana = document.getElementById("popUp");
            var botonToggle = document.getElementById("botonToggle");

            ventana.style.display = "none";
            botonToggle.innerText = "Chat";
        }


// Crear el script y configurar sus atributos

  var scriptElement = document.createElement("script");
  scriptElement.crossorigin = "anonymous";
  scriptElement.src = "https://cdn.botframework.com/botframework-webchat/latest/webchat.js";

  // Agregar el script al final del cuerpo del documento
  document.body.appendChild(scriptElement);


//Configuracion chatbot virtual agents

(async function () {
  // Specifies style options to customize the Web Chat canvas.
  // Please visit https://microsoft.github.io/BotFramework-WebChat for customization samples.
  const styleOptions = {
    // Hide upload button.
    hideUploadButton: true
  };

  const locale = document.documentElement.lang || 'es'; 
  const apiVersion = tokenEndpointURL.searchParams.get('api-version');

  const [directLineURL, token] = await Promise.all([
    fetch(new URL(`/powervirtualagents/regionalchannelsettings?api-version=${apiVersion}`, tokenEndpointURL))
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to retrieve regional channel settings.');
        }

        return response.json();
      })
      .then(({ channelUrlsById: { directline } }) => directline),
    fetch(tokenEndpointURL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to retrieve Direct Line token.');
        }

        return response.json();
      })
      .then(({ token }) => token)
  ]);

  const directLine = WebChat.createDirectLine({ domain: new URL('v3/directline', directLineURL), token });

  const subscription = directLine.connectionStatus$.subscribe({
    next(value) {
      if (value === 2) {
        directLine
          .postActivity({
            localTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            locale,
            name: 'startConversation',
            type: 'event'
          })
          .subscribe();

        subscription.unsubscribe();
      }
    }
  });

  WebChat.renderWebChat({ directLine, locale, styleOptions }, document.getElementById('webchat'));
})();


//Estilos
  // Crear el elemento de estilo
  var estilo = document.createElement("style");
  estilo.type = "text/css";

  // Definir el contenido del estilo con el CSS proporcionado
  var css = `
    #popUp {
      position: fixed;
      bottom: 70px;
      right: 10px;
      height: 520px;
      max-width: 1100px;
      z-index: 999;
      background-color: white;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    #botonToggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      background-color: #ffffff;
      color: #333;
      padding: 10px 20px;
      border: 2px solid #333;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      outline: none;
      transition: background-color 0.3s, color 0.3s;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    #botonToggle:hover {
      background-color: #FD7E14;
      color: #ffffff;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    #banner {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background-color: #FD7E14;
      display: flex;
      height: 50px;
      border-radius: 20px 20px 0 0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      color: white;
    }

    #banner p {
      display: inline-block;
      vertical-align: middle;
      margin: auto;
    }

    #webchat {
      top: 50px;
      width: 1000px;
      height: 450px;
      padding: 10px;
      border-radius: 20px;
    }

    #webchat p {
      font-size: 17px;
    }

    .webchat__text-content {
      background-color: whitesmoke;
      border-radius: 5px;
    }
  `;

  // Asignar el contenido del CSS al elemento de estilo
  estilo.appendChild(document.createTextNode(css));

  // Agregar el elemento de estilo al head del documento
  document.head.appendChild(estilo);
