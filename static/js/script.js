/* ============================================================
   JS - Portafolio Damián Oyarce
   Comentarios seccionales en español: cada bloque explica su
   propósito y las funciones que agrupa.
   ============================================================ */

/* -----------------------
   1) CONFIGURACIÓN / ESTADO GLOBAL
   Map para guardar el color original de cada icono (clave: elemento icono).
   ----------------------- */
const coloresOriginales = new Map();

/* -----------------------
   2) RESALTADO DE ICONOS
   Funciones que manejan cambio visual de color al pasar/retirar el cursor.
   - resaltarIcono(element, color): guarda color original (si no existe) y aplica nuevo color.
   - restaurarIcono(element): restaura el color guardado si el enlace no está 'active'.
   ----------------------- */
function resaltarIcono(element, color) {
    const icon = element.querySelector('.icono-nav');
    if (!icon) return;

    if (!coloresOriginales.has(icon)) {
        const estiloComputado = window.getComputedStyle(icon).color;
        coloresOriginales.set(icon, estiloComputado || '');
    }
    icon.style.color = color;
}

function restaurarIcono(element) {
    const icon = element.querySelector('.icono-nav');
    if (!icon) return;

    if (!element.classList.contains('active')) {
        const colorOriginal = coloresOriginales.get(icon) || '';
        icon.style.color = colorOriginal;
    }
}

/* -----------------------
   3) NAVEGACIÓN Y GESTIÓN DE SECCIONES
   Funciones para cambiar entre secciones, gestionar la clase 'active'
   y aplicar el color de resaltado al icono activo.
   - mostrarSeccion(event, element): oculta todas las secciones y muestra la objetivo.
   - clickEnlaceNav(targetId): simula un clic en un enlace de la barra lateral.
   ----------------------- */
function mostrarSeccion(event, element) {
    if (event) event.preventDefault();

    const targetId = element.getAttribute('href');
    if (!targetId) return;

    // Ocultar todas las secciones
    document.querySelectorAll('#contenido-principal > section').forEach(section => {
        section.style.display = 'none';
    });

    // Mostrar la sección objetivo (si existe)
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Quitar 'active' y restaurar color de todos los enlaces
    document.querySelectorAll('#barra-lateral .nav-link').forEach(link => {
        link.classList.remove('active');
        const icon = link.querySelector('.icono-nav');
        if (icon && coloresOriginales.has(icon)) {
            icon.style.color = coloresOriginales.get(icon) || '';
        }
    });

    // Marcar el enlace clickeado como activo
    element.classList.add('active');

    // Aplicar color de resaltado al icono del enlace activo (si se puede extraer)
    const activeIcon = element.querySelector('.icono-nav');
    if (activeIcon) {
        const onMouseOverAttr = element.getAttribute('onmouseover');
        if (onMouseOverAttr) {
            const match = onMouseOverAttr.match(/'(#[0-9a-fA-F]{3,6})'/);
            if (match && match[1]) {
                const hoverColor = match[1];
                if (!coloresOriginales.has(activeIcon)) {
                    const estiloComputado = window.getComputedStyle(activeIcon).color;
                    coloresOriginales.set(activeIcon, estiloComputado || '');
                }
                activeIcon.style.color = hoverColor;
            }
        }
    }
}

function clickEnlaceNav(targetId) {
    const navLink = document.querySelector(`#barra-lateral .nav-link[href="${targetId}"]`);
    if (navLink) mostrarSeccion(null, navLink);
}

/* -----------------------
   4) VALIDACIÓN DE FORMULARIO
   Función para validar campos individuales al cambiar su valor.
   - validarCampo(element): añade/remueve clases is-valid/is-invalid.
   ----------------------- */
function validarCampo(element) {
    if (!element) return;
    if (element.value.trim() !== '') {
        element.classList.remove('is-invalid');
        element.classList.add('is-valid');
    } else {
        element.classList.remove('is-valid');
        element.classList.add('is-invalid');
    }
}

/* -----------------------
   5) ENVÍO SIMULADO DE FORMULARIO Y MENSAJES
   Funciones que simulan el envío, muestran una alerta y limpian el formulario.
   - enviarFormulario(event): previene submit real, muestra alerta y resetea el formulario.
   - quitarElemento(element): elimina un elemento del DOM (usado para cerrar alertas).
   ----------------------- */
function enviarFormulario(event) {
    if (event) event.preventDefault();

    const nombre = document.getElementById('nombre') ? document.getElementById('nombre').value : '';
    const contenedorAlerta = document.getElementById('contenedor-alerta');
    if (!contenedorAlerta) return;

    const alertaHtml = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>¡Gracias, ${nombre}!</strong> Tu mensaje ha sido enviado (simulación).
            <button type="button" class="btn-close" onclick="quitarElemento(this.parentElement)" aria-label="Close"></button>
        </div>
    `;

    contenedorAlerta.innerHTML = alertaHtml;

    const formulario = document.getElementById('formulario-contacto');
    if (formulario) formulario.reset();

    document.querySelectorAll('#formulario-contacto .form-control').forEach(el => {
        el.classList.remove('is-valid');
        el.classList.remove('is-invalid');
    });
}

function quitarElemento(element) {
    if (element && element.remove) element.remove();
}

/* -----------------------
   6) INICIALIZACIÓN AL CARGAR EL DOM
   - Inicializa tooltips de Bootstrap.
   - Muestra la sección que corresponda al enlace marcado como 'active' al cargar.
   - Si no hay ninguno activo, muestra la sección 'home' por defecto.
   ----------------------- */
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar tooltips de Bootstrap (si bootstrap está disponible)
    if (window.bootstrap) {
        const triggers = Array.prototype.slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        triggers.map(function (el) { return new bootstrap.Tooltip(el); });
    }

    // Mostrar la sección marcada como 'active' o 'home' por defecto
    const activeLink = document.querySelector('#barra-lateral .nav-link.active');
    if (activeLink) {
        const activeSectionId = activeLink.getAttribute('href');
        const activeSection = document.querySelector(activeSectionId);
        if (activeSection) activeSection.style.display = 'block';
        mostrarSeccion(null, activeLink);
    } else {
        const homeSection = document.getElementById('home');
        const homeLink = document.querySelector('#barra-lateral .nav-link[href="#home"]');
        if (homeSection) homeSection.style.display = 'block';
        if (homeLink) {
            homeLink.classList.add('active');
            mostrarSeccion(null, homeLink);
        }
    }
});
