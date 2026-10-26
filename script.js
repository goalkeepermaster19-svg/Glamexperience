
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =========================================
       DATOS GLAM
    ========================================= */

    if (typeof glam !== "undefined") {
        const nombreNovia = document.getElementById("nombreNovia");
        const nombreNovio = document.getElementById("nombreNovio");
        const numeroDia = document.getElementById("numeroDia");
        const telefonos = document.querySelectorAll(".contacto-datos span");

        if (nombreNovia) {
            nombreNovia.textContent = glam.nombreNovia || "GLAM";
        }

        if (nombreNovio) {
            nombreNovio.textContent =
                glam.nombreNovio || "MIRROR EXPERIENCE";
        }

        if (numeroDia) {
            numeroDia.textContent =
                glam.numeroDia || "TODOS RECUERDAN";
        }

        const mensajePortada = document.querySelector(".portada .mensaje");

        if (mensajePortada && glam.mensajePortada) {
            const partes = glam.mensajePortada.trim().split(/\s+/);
            mensajePortada.textContent = "";

            if (partes.length > 4) {
                const mitad = Math.ceil(partes.length / 2);

                mensajePortada.append(
                    document.createTextNode(partes.slice(0, mitad).join(" ")),
                    document.createElement("br"),
                    document.createTextNode(partes.slice(mitad).join(" "))
                );
            } else {
                mensajePortada.textContent = glam.mensajePortada;
            }
        }

        if (telefonos.length && glam.telefono) {
            telefonos[0].textContent = glam.telefono;
        }
    }

    /* =========================================
       ELEMENTOS Y NAVEGACIÓN PRINCIPAL
    ========================================= */

    const botonAbrir = document.getElementById("abrirInvitacion");
    const portada = document.querySelector(".portada");
    const selectorServicios = document.getElementById("selectorServicios");
    const contenido = document.getElementById("contenido");
    const volverPortada = document.getElementById("volverPortada");

    const botonServicios = document.getElementById("botonServicios");
    const opcionesServicios = document.getElementById("opcionesServicios");
    const iconoServicios = document.getElementById("iconoServicios");

    const paginasServicios = {
        invitaciones: "invitaciones.html",
        vajilleria: "vajilleria.html",
        weddingweek: "wedding-week.html"
    };

    function subirPagina() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function cerrarMenuServicios() {
        if (opcionesServicios) {
            opcionesServicios.classList.add("oculto");
        }

        if (botonServicios) {
            botonServicios.setAttribute("aria-expanded", "false");
        }

        if (iconoServicios) {
            iconoServicios.textContent = "✦";
        }
    }

    function mostrarSelector() {
        if (portada) portada.classList.add("oculto");
        if (contenido) contenido.classList.add("oculto");

        if (selectorServicios) {
            selectorServicios.classList.remove("oculto");
        }

        cerrarMenuServicios();
        subirPagina();
    }

    function mostrarMirror() {
        if (portada) portada.classList.add("oculto");
        if (selectorServicios) selectorServicios.classList.add("oculto");

        if (contenido) {
            contenido.classList.remove("oculto");
        }

        cerrarMenuServicios();
        subirPagina();
    }

    function regresarPortada() {
        if (selectorServicios) selectorServicios.classList.add("oculto");
        if (contenido) contenido.classList.add("oculto");
        if (portada) portada.classList.remove("oculto");

        cerrarMenuServicios();
        subirPagina();
    }

    if (botonAbrir) {
        botonAbrir.addEventListener("click", function (evento) {
            evento.preventDefault();
            mostrarSelector();
        });
    }

    if (volverPortada) {
        volverPortada.addEventListener("click", function (evento) {
            evento.preventDefault();
            regresarPortada();
        });
    }

    /* =========================================
       OPCIONES DEL SELECTOR DE SERVICIOS
    ========================================= */

    document.querySelectorAll(".servicio-opcion[data-servicio]")
        .forEach(function (opcion) {
            opcion.addEventListener("click", function (evento) {
                const servicio = opcion.dataset.servicio;

                if (servicio === "mirror") {
                    evento.preventDefault();
                    mostrarMirror();
                    return;
                }

                if (paginasServicios[servicio]) {
                    evento.preventDefault();
                    window.location.href = paginasServicios[servicio];
                }
            });
        });

    /* =========================================
       MENÚ FLOTANTE
       Un solo controlador para abrir y cerrar
    ========================================= */

    if (botonServicios && opcionesServicios) {
        // Estado inicial consistente
        opcionesServicios.classList.add("oculto");
        botonServicios.setAttribute("aria-expanded", "false");

        botonServicios.addEventListener("click", function (evento) {
            evento.preventDefault();
            evento.stopPropagation();

            const menuEstaCerrado =
                opcionesServicios.classList.contains("oculto");

            if (menuEstaCerrado) {
                opcionesServicios.classList.remove("oculto");
                botonServicios.setAttribute("aria-expanded", "true");

                if (iconoServicios) {
                    iconoServicios.textContent = "×";
                }
            } else {
                cerrarMenuServicios();
            }
        });

        opcionesServicios.querySelectorAll("a, button").forEach(
            function (enlace) {
                enlace.addEventListener("click", function (evento) {
                    const destino = enlace.dataset.destino;
                    const servicio = enlace.dataset.servicio;

                    if (destino === "mirror" || servicio === "mirror") {
                        evento.preventDefault();
                        mostrarMirror();
                        return;
                    }

                    if (
                        destino === "inicio" ||
                        destino === "portada"
                    ) {
                        evento.preventDefault();
                        regresarPortada();
                        return;
                    }

                    // Los demás enlaces mantienen su destino HTML.
                    cerrarMenuServicios();
                });
            }
        );

        // Cerrar al hacer clic fuera del menú
        document.addEventListener("click", function (evento) {
            const clicEnBoton = botonServicios.contains(evento.target);
            const clicEnOpciones = opcionesServicios.contains(evento.target);

            if (!clicEnBoton && !clicEnOpciones) {
                cerrarMenuServicios();
            }
        });
    } else {
        console.warn(
            "GLAM: verifica los IDs botonServicios y opcionesServicios en el HTML."
        );
    }

    // Cerrar el menú con Escape
    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") {
            cerrarMenuServicios();
        }
    });

    /* =========================================
       MENÚ SUPERIOR ANTIGUO (SI EXISTE)
    ========================================= */

    const menuGlam = document.querySelector(".glam-menu");

    if (menuGlam) {
        menuGlam.querySelectorAll('a[href^="#"]').forEach(function (enlace) {
            enlace.addEventListener("click", function (evento) {
                const selector = enlace.getAttribute("href");
                const destino = document.querySelector(selector);

                if (!destino) return;

                evento.preventDefault();

                const encabezado =
                    destino.querySelector(".seccion-encabezado") ||
                    (
                        destino.id === "contacto"
                            ? destino.querySelector(".contacto-texto h2")
                            : null
                    ) ||
                    destino;

                const espacio = window.innerWidth <= 600 ? 85 : 100;

                window.scrollTo({
                    top: Math.max(
                        0,
                        encabezado.getBoundingClientRect().top +
                        window.scrollY - espacio
                    ),
                    behavior: "smooth"
                });

                menuGlam.querySelectorAll("a.activo").forEach(function (otro) {
                    otro.classList.remove("activo");
                });

                enlace.classList.add("activo");
                history.replaceState(null, "", selector);
            });
        });
    }

    /* =========================================
       GALERÍA Y VISOR DE FOTOGRAFÍAS
    ========================================= */

    const fotos = [
        "imagenes/momento1.jpeg",
        "imagenes/momento2.jpeg",
        "imagenes/momento3.jpeg",
        "imagenes/momento4.jpeg",
        "imagenes/momento5.jpeg",
        "imagenes/momento6.jpeg"
    ];

    const visor = document.getElementById("visorFoto");
    const fotoGrande = document.getElementById("fotoGrande");
    const cerrarFoto = document.getElementById("cerrarFoto");
    const fotoAnterior = document.getElementById("fotoAnterior");
    const fotoSiguiente = document.getElementById("fotoSiguiente");

    let indiceActual = 0;

    function mostrarFoto(indice) {
        if (!visor || !fotoGrande) return;

        indiceActual = (indice + fotos.length) % fotos.length;
        fotoGrande.src = fotos[indiceActual];
        fotoGrande.alt = "Foto GLAM " + (indiceActual + 1);

        visor.classList.add("activo");
        document.body.style.overflow = "hidden";
    }

    function cerrarVisor() {
        if (!visor) return;

        visor.classList.remove("activo");
        document.body.style.overflow = "";
    }

    document.querySelectorAll(".foto-glam").forEach(function (foto) {
        foto.addEventListener("click", function () {
            const imagen = foto.querySelector("img");
            const indice = imagen ? Number(imagen.dataset.indice) : 0;

            mostrarFoto(Number.isInteger(indice) ? indice : 0);
        });
    });

    if (cerrarFoto) {
        cerrarFoto.addEventListener("click", cerrarVisor);
    }

    if (fotoAnterior) {
        fotoAnterior.addEventListener("click", function () {
            mostrarFoto(indiceActual - 1);
        });
    }

    if (fotoSiguiente) {
        fotoSiguiente.addEventListener("click", function () {
            mostrarFoto(indiceActual + 1);
        });
    }

    if (visor) {
        visor.addEventListener("click", function (evento) {
            if (evento.target === visor) cerrarVisor();
        });
    }

    /* =========================================
       MÚSICA
    ========================================= */

    const musica = document.getElementById("musicaBoda");
    const botonMusica = document.getElementById("botonMusica");

    if (musica && botonMusica) {
        botonMusica.addEventListener("click", function () {
            if (musica.paused) {
                musica.play()
                    .then(function () {
                        botonMusica.textContent = "🔊";
                        botonMusica.setAttribute("aria-pressed", "true");
                        botonMusica.setAttribute("aria-label", "Pausar música");
                    })
                    .catch(function (error) {
                        console.error("Error al reproducir música:", error);

                        alert(
                            "No se pudo reproducir la música. " +
                            "Comprueba que exista musica/cancion.mp3."
                        );
                    });
            } else {
                musica.pause();
                botonMusica.textContent = "🔇";
                botonMusica.setAttribute("aria-pressed", "false");
                botonMusica.setAttribute("aria-label", "Reproducir música");
            }
        });
    }

    /* =========================================
       MODAL DE COTIZACIÓN
    ========================================= */

    const abrirCotizacion = document.getElementById("abrirCotizacion");
    const modalCotizacion = document.getElementById("modalCotizacion");
    const cerrarCotizacion = document.getElementById("cerrarCotizacion");
    const formulario = document.getElementById("formularioCotizacion");

    function abrirModal() {
        if (!modalCotizacion) return;

        modalCotizacion.classList.add("activo");
        document.body.style.overflow = "hidden";

        const primerCampo =
            modalCotizacion.querySelector("input, select, textarea");

        if (primerCampo) {
            primerCampo.focus({ preventScroll: true });
        }
    }

    function cerrarModal() {
        if (!modalCotizacion) return;

        modalCotizacion.classList.remove("activo");
        document.body.style.overflow = "";
    }

    if (abrirCotizacion) {
        abrirCotizacion.addEventListener("click", abrirModal);
    }

    if (cerrarCotizacion) {
        cerrarCotizacion.addEventListener("click", cerrarModal);
    }

    if (modalCotizacion) {
        modalCotizacion.addEventListener("click", function (evento) {
            if (evento.target === modalCotizacion) cerrarModal();
        });
    }

    /* =========================================
       TECLADO: VISOR, MODAL Y MENÚ
    ========================================= */

    document.addEventListener("keydown", function (evento) {
        if (visor && visor.classList.contains("activo")) {
            if (evento.key === "Escape") cerrarVisor();
            if (evento.key === "ArrowLeft") mostrarFoto(indiceActual - 1);
            if (evento.key === "ArrowRight") mostrarFoto(indiceActual + 1);
        }

        if (
            evento.key === "Escape" &&
            modalCotizacion &&
            modalCotizacion.classList.contains("activo")
        ) {
            cerrarModal();
        }
    });

    /* =========================================
       EVENTOS GLAM
    ========================================= */

    const eventosGrid = document.getElementById("eventosGrid");

    function obtenerEtiquetaEvento(titulo) {
        const etiquetas = {
            "BODAS": "CELEBRA EL AMOR",
            "CUMPLEAÑOS": "CELEBRA A LO GRANDE",
            "XV AÑOS": "UNA NOCHE PARA BRILLAR",
            "GRADUACIONES": "CELEBRA TU LOGRO",
            "EMPRESARIALES": "TU MARCA TAMBIÉN CELEBRA",
            "EVENTOS PRIVADOS": "TU MOMENTO, TU ESTILO"
        };

        return etiquetas[String(titulo || "").toUpperCase()]
            || "MOMENTOS GLAM";
    }

    if (
        eventosGrid &&
        typeof glam !== "undefined" &&
        Array.isArray(glam.eventos)
    ) {
        eventosGrid.innerHTML = "";

        glam.eventos.forEach(function (evento, indice) {
            const tarjeta = document.createElement("article");
            tarjeta.className = "evento-glam-card";

            const imagenContenedor = document.createElement("div");
            imagenContenedor.className = "evento-glam-imagen";

            const imagen = document.createElement("img");
            imagen.src = evento.imagen || "";
            imagen.alt = evento.titulo || "Evento GLAM";
            imagen.loading = "lazy";

            const numero = document.createElement("div");
            numero.className = "evento-glam-numero";
            numero.textContent = String(indice + 1).padStart(2, "0");

            imagenContenedor.append(imagen, numero);

            const informacion = document.createElement("div");
            informacion.className = "evento-glam-info";

            const etiqueta = document.createElement("p");
            etiqueta.className = "evento-glam-etiqueta";
            etiqueta.textContent = obtenerEtiquetaEvento(evento.titulo);

            const titulo = document.createElement("h3");
            titulo.textContent = evento.titulo || "Evento GLAM";

            const descripcion = document.createElement("p");
            descripcion.textContent = evento.descripcion || "";

            informacion.append(etiqueta, titulo, descripcion);
            tarjeta.append(imagenContenedor, informacion);
            eventosGrid.appendChild(tarjeta);
        });
    }

    /* =========================================
       PAQUETES GLAM
    ========================================= */

    const paquetesGrid = document.getElementById("paquetesGrid");

    if (
        paquetesGrid &&
        typeof glam !== "undefined" &&
        Array.isArray(glam.paquetes)
    ) {
        paquetesGrid.innerHTML = "";

        glam.paquetes.forEach(function (paquete, indice) {
            const tarjeta = document.createElement("article");
            tarjeta.className = "paquete-card";

            if (indice === 1) {
                tarjeta.classList.add("paquete-destacado");
            }

            const badge = document.createElement("div");
            badge.className = "paquete-badge";
            badge.textContent = "MÁS ELEGIDO";
            badge.hidden = indice !== 1;

            const numero = document.createElement("div");
            numero.className = "paquete-numero";
            numero.textContent = String(indice + 1).padStart(2, "0");

            const etiqueta = document.createElement("p");
            etiqueta.className = "paquete-etiqueta";
            etiqueta.textContent = "EXPERIENCIA";

            const titulo = document.createElement("h3");
            titulo.textContent = paquete.nombre || "Paquete GLAM";

            const duracion = document.createElement("div");
            duracion.className = "paquete-duracion";
            duracion.textContent = paquete.duracion || "";

            const precio = document.createElement("div");
            precio.className = "paquete-precio";
            precio.textContent = paquete.precio || "Consultar";

            const descripcion = document.createElement("p");
            descripcion.className = "paquete-descripcion";
            descripcion.textContent = paquete.descripcion || "";

            const lista = document.createElement("ul");

            (Array.isArray(paquete.incluye) ? paquete.incluye : [])
                .forEach(function (item) {
                    const li = document.createElement("li");
                    li.textContent = "✓ " + item;
                    lista.appendChild(li);
                });

            const boton = document.createElement("button");
            boton.className = "boton-paquete";
            boton.type = "button";
            boton.dataset.paquete = paquete.nombre || "GLAM";
            boton.textContent = "COTIZAR";

            boton.addEventListener("click", function () {
                abrirFormularioWhatsApp(boton.dataset.paquete);
            });

            tarjeta.append(
                badge,
                numero,
                etiqueta,
                titulo,
                duracion,
                precio,
                descripcion,
                lista,
                boton
            );

            paquetesGrid.appendChild(tarjeta);
        });
    }

    /* =========================================
       COTIZACIÓN POR WHATSAPP
    ========================================= */

    function abrirFormularioWhatsApp(paquete) {
        const nombre = prompt("✨ COTIZACIÓN GLAM\n\n¿Cuál es tu nombre?");
        if (!nombre || !nombre.trim()) return;

        const fecha = prompt("📅 ¿Cuál es la fecha de tu evento?");
        if (!fecha || !fecha.trim()) return;

        const evento = prompt(
            "🎉 ¿Qué tipo de evento realizarás?\n\n" +
            "Ejemplo: Boda, cumpleaños, XV años o graduación."
        );
        if (!evento || !evento.trim()) return;

        const lugar = prompt(
            "📍 ¿Dónde se realizará tu evento?\n\n" +
            "Ejemplo: La Paz, salón de eventos."
        );
        if (!lugar || !lugar.trim()) return;

        const telefonoWhatsApp =
            typeof glam !== "undefined" && glam.whatsapp
                ? String(glam.whatsapp).replace(/\D/g, "")
                : "59172514906";

        const mensaje =
            "Hola GLAM ✨\n\n" +
            "Quiero cotizar el servicio de Espejo Mágico.\n\n" +
            "👤 Nombre: " + nombre.trim() + "\n" +
            "📅 Fecha del evento: " + fecha.trim() + "\n" +
            "🎉 Tipo de evento: " + evento.trim() + "\n" +
            "📍 Lugar: " + lugar.trim() + "\n" +
            "✨ Paquete: " + paquete + "\n\n" +
            "Quisiera conocer la disponibilidad y realizar la cotización.";

        const url =
            "https://wa.me/" +
            telefonoWhatsApp +
            "?text=" +
            encodeURIComponent(mensaje);

        window.open(url, "_blank", "noopener,noreferrer");
    }

    /* =========================================
       ENVÍO DEL FORMULARIO PERSONALIZADO
    ========================================= */

    if (formulario) {
        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();

            if (!formulario.reportValidity()) return;

            const campos = [
                "nombreCliente",
                "telefonoCliente",
                "tipoEvento",
                "fechaEvento",
                "ciudadEvento",
                "propuestaEvento"
            ];

            const datos = new URLSearchParams();
            datos.append("tipoSolicitud", "glam");

            const nombresCampos = {
                nombreCliente: "nombre",
                telefonoCliente: "telefono",
                tipoEvento: "tipoEvento",
                fechaEvento: "fechaEvento",
                ciudadEvento: "ciudadEvento",
                propuestaEvento: "propuesta"
            };

            campos.forEach(function (id) {
                const campo = document.getElementById(id);

                if (campo) {
                    datos.append(nombresCampos[id], campo.value.trim());
                }
            });

            const botonEnviar = formulario.querySelector(
                'button[type="submit"]'
            );

            const textoOriginal = botonEnviar
                ? botonEnviar.textContent
                : "";

            if (botonEnviar) {
                botonEnviar.disabled = true;
                botonEnviar.textContent = "ENVIANDO...";
            }

            const URL_GOOGLE_APPS_SCRIPT =
                "https://script.google.com/macros/s/AKfycbxxGWxVhq-ogSxtXAQHJYPza7lf24XMMZDGcE8Tg7SmTLfepyEgZPn2nGpUd43Akj1Fpw/exec";

            fetch(URL_GOOGLE_APPS_SCRIPT, {
                method: "POST",
                body: datos
            })
                .then(function (respuesta) {
                    if (!respuesta.ok) {
                        throw new Error("No se pudo completar el envío.");
                    }

                    cerrarModal();
                    formulario.reset();

                    alert(
                        "¡RECIBIMOS TU IDEA! ✨\n\n" +
                        "Gracias por confiar en GLAM. Nuestro equipo " +
                        "se comunicará contigo dentro de las próximas " +
                        "24 horas.\n\n" +
                        "Si no te llamamos dentro de ese plazo, " +
                        "recibirás un 10% de descuento en tu " +
                        "experiencia GLAM."
                    );
                })
                .catch(function (error) {
                    console.error("Error al enviar:", error);

                    alert(
                        "No pudimos confirmar el envío de tu solicitud.\n\n" +
                        "Por favor, intenta nuevamente o contáctanos " +
                        "por WhatsApp."
                    );
                })
                .finally(function () {
                    if (botonEnviar) {
                        botonEnviar.disabled = false;
                        botonEnviar.textContent =
                            textoOriginal || "ENVIAR SOLICITUD";
                    }
                });
        });
    }

    console.log("GLAM: script cargado correctamente.");
});
