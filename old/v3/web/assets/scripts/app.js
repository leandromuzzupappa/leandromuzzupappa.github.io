'use strict'

// mostrar el tamaño de la pantalla
const screenRes = () => {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let screen = document.querySelector('#screenRes');
    screen.innerHTML = `${w} x ${h}`;
}
window.addEventListener('load', () => screenRes());
window.addEventListener('resize', () => screenRes());

const overlay = document.querySelector('.overlay');

// Scrollnav
const menuDesktop = document.querySelector('#menuDesktop');
window.addEventListener('scroll', () => {
    window.pageYOffset > menuDesktop.clientHeight ? menuDesktop.classList.add('scrolled') : menuDesktop.classList.remove('scrolled');
});


// Abrir y cerrar menu mobile
const mmbtn = document.querySelector('#mmbtn');
const toggleMenuMobile = () => {
    let menuMobile = document.querySelector('#menuMobile');

    mmbtn.classList.toggle('open');
    mmbtn.classList.contains('open') ?
        (
            menuMobile.style.right = '0%',
            Object.assign(overlay.style, {
                transition: 'all .3s',
                opacity: .2,
                pointerEvents: 'none',
            })) :
        (
            menuMobile.style.right = '-100%',
            Object.assign(overlay.style, {
                transition: 'all .3s',
                opacity: 0,
                pointerEvents: 'none',
            })
        );
};
// eventos del menu mobile
mmbtn.addEventListener('click', () => {
    toggleMenuMobile();
});

// recorrer items del menu mobile y cerrarlo si se clickean
const mmItems = document.querySelectorAll('#menuMobile .mm-items ul li');
mmItems.forEach(mmItem => {
    mmItem.addEventListener('click', () => {
        toggleMenuMobile();
    })
});

// Abrir y cerra popups
const openPopup = id => {
    let popup = document.getElementById(id);
    Object.assign(popup.style, {
        transition: 'all .3s',
        top: '40px',
        opacity: 1,
        pointerEvents: 'all',
    });
    Object.assign(overlay.style, {
        transition: 'all .2s',
        opacity: 1,
        pointerEvents: 'all',
    });
};
const closePopup = id => {
    let popup = document.getElementById(id);

    if (popup === null) {
        popup = document.querySelector('.msgPop');
    }

    Object.assign(popup.style, {
        transition: 'all .3s',
        top: '-100%',
        opacity: 0,
        pointerEvents: 'none',
    });
    Object.assign(overlay.style, {
        transition: 'all .2s',
        opacity: 0,
        pointerEvents: 'none',
    });
};
overlay.addEventListener('click', () => {
    closePopup();
});

// Trae las lineas de los titulos y les aplica left correspondiente
const titleLineas = document.querySelectorAll('.title .linea');
titleLineas.forEach(linea => {
    let textWidth = linea.previousElementSibling.clientWidth + 20;
    linea.style.left = `${textWidth}px`;
})