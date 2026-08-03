/**
 * SISTEMA DE LEVANTAMIENTO TÉCNICO DE CAMPO
 * Generación de Pines Dinámicos por SVG y Exportación de Etiquetas a Color
 */
const CapaVisor = (() => {
    let mapa = null;
    let capaImagenActual = null;
    let listaCasos = [];
    let imagenBaseObj = null;

    let modoActivo = false;
    let tipoSeleccionado = null;
    let herramientaSeleccionada = 'pin'; 

    let puntosLineaTemp = [];
    let lineaTemporalObj = null;

    const contadores = { W1: 0, P1: 0, P2: 0, C: 0, S2: 0 };
    const colores = {
        W1: { hex: '#6b7280', nombre: 'Paredes' },
        P1: { hex: '#8b4513', nombre: 'Escayola Grande' },
        P2: { hex: '#f97316', nombre: 'Reparación Lineal' },
        C:  { hex: '#ef4444', nombre: 'Columna' },
        S2: { hex: '#a855f7', nombre: 'Inyección Epóxico' }
    };

    const inicializarMapa = () => {
        mapa = L.map('mapa-container', {
            crs: L.CRS.Simple,
            minZoom: -2,
            maxZoom: 3,
            zoomSnap: 0.25,
            attributionControl: false
        });

        mapa.on('click', (e) => {
            if (!capaImagenActual || !modoActivo || !tipoSeleccionado) return;

            const { lat, lng } = e.latlng;

            if (herramientaSeleccionada === 'pin') {
                crearNuevoCasoPin(lat, lng, tipoSeleccionado);
                desactivarModo();
            } else if (herramientaSeleccionada === 'linea') {
                puntosLineaTemp.push([lat, lng]);

                if (puntosLineaTemp.length === 1) {
                    lineaTemporalObj = L.polyline(puntosLineaTemp, {
                        color: colores[tipoSeleccionado].hex,
                        weight: 4,
                        dashArray: '5, 5'
                    }).addTo(mapa);
                } else if (puntosLineaTemp.length === 2) {
                    mapa.removeLayer(lineaTemporalObj);
                    crearNuevoCasoLinea(puntosLineaTemp, tipoSeleccionado);
                    puntosLineaTemp = [];
                    desactivarModo();
                }
            }
        });
    };

    const cargarImagenFondo = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                imagenBaseObj = img;
                const limites = [[0, 0], [img.height, img.width]];

                limpiarTodo();
                document.getElementById('mensaje-vacio').style.display = 'none';

                capaImagenActual = L.imageOverlay(e.target.result, limites).addTo(mapa);
                mapa.fitBounds(limites);
                mapa.setMaxBounds(limites);

                document.getElementById('limpiarPinesBtn').disabled = false;
                document.getElementById('exportarImagenBtn').disabled = false;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    const setTipoHerramienta = (herramienta) => {
        herramientaSeleccionada = herramienta;
        document.getElementById('btnModoPin').classList.toggle('activo', herramienta === 'pin');
        document.getElementById('btnModoLinea').classList.toggle('activo', herramienta === 'linea');
    };

    const activarModo = (tipo) => {
        if (!capaImagenActual) {
            alert("Primero debes cargar una imagen o plano de fondo.");
            return;
        }

        modoActivo = true;
        tipoSeleccionado = tipo;
        puntosLineaTemp = [];

        document.querySelectorAll('.btn-type').forEach(b => b.classList.remove('modo-activo'));
        document.getElementById(`btnPin${tipo}`).classList.add('modo-activo');

        const ind = document.getElementById('indicador-modo');
        const txtHerramienta = herramientaSeleccionada === 'pin' ? 'UBICAR PIN' : 'TRAZAR LÍNEA (Haz 2 clics)';
        ind.innerText = `[${tipo} - ${colores[tipo].nombre}] ${txtHerramienta}`;
        ind.style.backgroundColor = colores[tipo].hex;
        ind.classList.remove('oculto');
    };

    const desactivarModo = () => {
        modoActivo = false;
        tipoSeleccionado = null;
        puntosLineaTemp = [];
        document.querySelectorAll('.btn-type').forEach(b => b.classList.remove('modo-activo'));
        document.getElementById('indicador-modo').classList.add('oculto');
    };

    // MODO 1: PIN CON ICONO SVG CREADO EN CÓDIGO
    const crearNuevoCasoPin = (y, x, tipo) => {
        contadores[tipo]++;
        const correlativo = contadores[tipo];
        const etiqueta = `${tipo}-R${correlativo}`;

        document.getElementById(`cant${tipo}`).innerText = contadores[tipo];

        const colorHex = colores[tipo].hex;
        const svgPin = `
            <svg width="28" height="42" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z" fill="${colorHex}" stroke="#ffffff" stroke-width="1.5"/>
                <circle cx="12" cy="12" r="4" fill="#ffffff"/>
            </svg>
        `;

        const customIcon = L.divIcon({
            className: 'custom-svg-pin',
            html: svgPin,
            iconSize: [28, 42],
            iconAnchor: [14, 42], 
            tooltipAnchor: [0, -42] 
        });

        const marcador = L.marker([y, x], { icon: customIcon }).addTo(mapa);

        marcador.bindTooltip(etiqueta, {
            permanent: true,
            direction: 'top',
            className: 'tooltip-estandar'
        }).openTooltip();

        const caso = {
            id: etiqueta,
            tipo: tipo,
            forma: 'pin',
            coordenadaY: Math.round(y),
            coordenadaX: Math.round(x),
            fecha: new Date().toLocaleTimeString(),
            layerRef: marcador
        };

        listaCasos.push(caso);
        asignarEventoPopup(caso);
    };

    // MODO 2: DIBUJAR LÍNEA
    const crearNuevoCasoLinea = (puntos, tipo) => {
        contadores[tipo]++;
        const correlativo = contadores[tipo];
        const etiqueta = `${tipo}-R${correlativo}`;

        document.getElementById(`cant${tipo}`).innerText = contadores[tipo];

        const linea = L.polyline(puntos, {
            color: colores[tipo].hex,
            weight: 5
        }).addTo(mapa);

        linea.bindTooltip(etiqueta, {
            permanent: true,
            direction: 'center',
            className: 'tooltip-estandar'
        }).openTooltip();

        const centroY = (puntos[0][0] + puntos[1][0]) / 2;
        const centroX = (puntos[0][1] + puntos[1][1]) / 2;

        const caso = {
            id: etiqueta,
            tipo: tipo,
            forma: 'linea',
            puntos: puntos,
            coordenadaY: Math.round(centroY),
            coordenadaX: Math.round(centroX),
            fecha: new Date().toLocaleTimeString(),
            layerRef: linea
        };

        listaCasos.push(caso);
        asignarEventoPopup(caso);
    };

    const asignarEventoPopup = (caso) => {
        const contenido = `
            <div style="text-align:center; padding: 5px;">
                <b>${caso.id}</b><br>
                <small>${colores[caso.tipo].nombre}</small>
                <div class="popup-acciones">
                    <button class="btn-pop btn-pop-del" onclick="CapaVisor.eliminarCaso('${caso.id}')">🗑️ Eliminar</button>
                </div>
            </div>
        `;
        caso.layerRef.bindPopup(contenido);
    };

    const eliminarCaso = (idEtiqueta) => {
        const index = listaCasos.findIndex(c => c.id === idEtiqueta);
        if (index !== -1) {
            const caso = listaCasos[index];
            mapa.removeLayer(caso.layerRef);

            contadores[caso.tipo] = Math.max(0, contadores[caso.tipo] - 1);
            document.getElementById(`cant${caso.tipo}`).innerText = contadores[caso.tipo];

            listaCasos.splice(index, 1);
        }
    };

    // EXPORTACIÓN A IMAGEN
    const exportarImagenConPines = () => {
        if (!imagenBaseObj || listaCasos.length === 0) return;

        const canvas = document.getElementById('canvas-exportacion');
        const ctx = canvas.getContext('2d');

        const ancho = imagenBaseObj.width;
        const alto = imagenBaseObj.height;
        canvas.width = ancho;
        canvas.height = alto;

        ctx.drawImage(imagenBaseObj, 0, 0, ancho, alto);
        const factor = Math.max(1, ancho / 1200);

        // Dibujar Líneas
        listaCasos.filter(c => c.forma === 'linea').forEach(caso => {
            ctx.beginPath();
            ctx.strokeStyle = colores[caso.tipo].hex;
            ctx.lineWidth = 5 * factor;
            const p1 = caso.puntos[0];
            const p2 = caso.puntos[1];
            ctx.moveTo(p1[1], alto - p1[0]);
            ctx.lineTo(p2[1], alto - p2[0]);
            ctx.stroke();
        });

        // Dibujar Pines (Gota simulada en Canvas)
        listaCasos.filter(c => c.forma === 'pin').forEach(caso => {
            const posX = caso.coordenadaX;
            const posY = alto - caso.coordenadaY;
            const size = 12 * factor; 

            ctx.fillStyle = colores[caso.tipo].hex;
            ctx.beginPath();
            ctx.arc(posX, posY - size, size, Math.PI, 0); // Semicirculo superior
            ctx.lineTo(posX, posY); // Punta inferior
            ctx.closePath();
            ctx.fill();

            ctx.lineWidth = 1.5 * factor;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            // Círculo interior blanco
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(posX, posY - size, size * 0.35, 0, Math.PI * 2);
            ctx.fill();
        });

        // Dibujar Etiquetas (Modificado para ser del color del pin y más grandes)
        listaCasos.forEach(caso => {
            const posX = caso.coordenadaX;
            // Se ajusta un poco más arriba la etiqueta para compensar el tamaño
            const posY = (alto - caso.coordenadaY) - (caso.forma === 'pin' ? 42 * factor : 0);
            
            // Tamaños aumentados para la etiqueta
            const anchoBadge = 75 * factor; 
            const altoBadge = 28 * factor;

            // Fondo con el color respectivo del pin
            ctx.fillStyle = colores[caso.tipo].hex;
            
            ctx.beginPath();
            ctx.roundRect(posX - (anchoBadge/2), posY - (altoBadge/2), anchoBadge, altoBadge, 6 * factor);
            ctx.fill();
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5 * factor;
            ctx.stroke();

            // Texto de la etiqueta más grande (de 11px a 14px relativos al factor)
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${14 * factor}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(caso.id, posX, posY);
        });

        const a = document.createElement('a');
        a.download = `Levantamiento_${new Date().toISOString().slice(0,10)}.jpg`;
        a.href = canvas.toDataURL('image/jpeg', 0.95);
        a.click();
    };

    const limpiarTodo = () => {
        if (capaImagenActual) mapa.removeLayer(capaImagenActual);
        listaCasos.forEach(c => {
            if (c.layerRef) mapa.removeLayer(c.layerRef);
        });

        listaCasos = [];
        Object.keys(contadores).forEach(k => {
            contadores[k] = 0;
            document.getElementById(`cant${k}`).innerText = '0';
        });

        desactivarModo();
        document.getElementById('limpiarPinesBtn').disabled = true;
        document.getElementById('exportarImagenBtn').disabled = true;
    };

    return {
        init: () => {
            inicializarMapa();
            document.getElementById('cargarImagenBtn').addEventListener('change', (e) => {
                if (e.target.files[0]) cargarImagenFondo(e.target.files[0]);
            });
            document.getElementById('exportarImagenBtn').addEventListener('click', exportarImagenConPines);
            document.getElementById('limpiarPinesBtn').addEventListener('click', limpiarTodo);
        },
        activarModo,
        setTipoHerramienta,
        eliminarCaso
    };
})();

document.addEventListener('DOMContentLoaded', CapaVisor.init);