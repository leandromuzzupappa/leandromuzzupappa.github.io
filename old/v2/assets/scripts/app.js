const portfolioBtn = $('#portfolioBtn');
const Home = $('.Home');
const Portfolio = $('.Portfolio > .container');
const imagePath = '/assets/images/';

portfolioBtn.click(function () {
    if ( !Home.hasClass('portfolioAbierto') ) {
        Home.addClass('portfolioAbierto');
    } else {
        Home.removeClass('portfolioAbierto');
    }
})


// Project template
function createProject(project, previewUrl, faviconUrl, title, stack, web, github, bgcolor) {
    if (project === undefined) {
        throw new Error('Falta el nombre del proyecto');
    }
    if (previewUrl === undefined) {
        throw new Error('Falta la preview del proyecto');
    }
    if (faviconUrl === undefined) {
        throw new Error('Falta el favicon del proyecto');
    }
    if (title === undefined) {
        throw new Error('Falta el titulo del proyecto');
    }
    if (stack === undefined) {
        throw new Error('Falta el stack del proyecto');
    }
    if (web === undefined) {
        throw new Error('Falta el link del proyecto');
    }
    if (github === undefined) {
        throw new Error('Falta la repo de github del proyecto');
    }


    return `<div class="Trabajos" proyecto="${project}" style="background-color: ${bgcolor};">
        <div class="preview">
            <img src="${previewUrl}" alt="${project}">
        </div>
        <div class="favicon">
            <img src="${faviconUrl}" alt="${project}">
        </div>
        <div class="bajada">
            <h4>
                ${title}
            </h4>
            <p>
                ${stack}
            </p>
        </div>
        <div class="linkcitos">
            <a href="${web}" target="_blank">Website</a> - 
            <a href="${github}" target="_blank">Github</a>
        </div>
    </div> `;
}

// Agregar proyecto al array
var items = [
    {
        project: 'redhat-open-culture',
        bgcolor: '#021E2C',
        previewUrl: imagePath + 'p-redhat-oc.jpg',
        faviconUrl: imagePath + 'f-redhat.png',
        titulo: 'Red Hat Open Culture',
        stack: 'HTML- Vanilla Js',
        web: 'https://www.redhat.com/es/open-culture/home',
        github: '#github'
    },
    {
        project: 'delusarreta-abogados',
        bgcolor: '#021E2C',
        previewUrl: imagePath + 'p-delusarreta.png',
        faviconUrl: imagePath + 'f-delusarreta.png',
        titulo: 'DELUSARRETA ABOGADOS',
        stack: 'HTML - CSS - Js',
        web: 'http://delusarreta.com.ar/',
        github: '#github'
    },
    {
        project: 'Airpostcard',
        bgcolor: '#000046',
        previewUrl: imagePath + 'p-airpostcard.jpg',
        faviconUrl: imagePath + 'f-airpostcard.png',
        titulo: 'Airpostcard',
        stack: 'Bubble Platform',
        web: 'http://airpostcard.com/',
        github: '#github'
    },
    {
        project: 'EMAIL SUMMIT',
        bgcolor: '#031427',
        previewUrl: imagePath + 'p-emailsummit.png',
        faviconUrl: imagePath + 'f-emailsummit.png',
        titulo: 'EMAIL SUMMIT',
        stack: 'HTML - SASS - jQuery',
        web: 'http://emailsummit.org/',
        github: '#github'
    },
    {
        project: 'MOBILE SUMMIT',
        bgcolor: '#05142C',
        previewUrl: imagePath + 'p-mobilesummit.png',
        faviconUrl: imagePath + 'f-mobilesummit.png',
        titulo: 'MOBILE SUMMIT',
        stack: 'HTML - SASS - jQuery',
        web: 'http://www.mobilesummit.com.ar/',
        github: '#github'
    },
    {
        project: 'Makro Cajas Navideñas',
        bgcolor: '#D51E24',
        previewUrl: imagePath + 'p-makro-cajas.jpg',
        faviconUrl: imagePath + 'f-makro-cajas.png',
        titulo: 'Makro Cajas Navideñas',
        stack: 'HTML - SASS - jQuery',
        web: 'http://mobilesummit.com.ar/',
        github: '#github'
    },
    {
        project: 'VIDT CENTRO MEDICO',
        bgcolor: '#AA2A3B',
        previewUrl: imagePath + 'p-vidt.png',
        faviconUrl: imagePath + 'f-vidt.png',
        titulo: 'VIDT CENTRO MEDICO',
        stack: 'PHP - LESS - jQuery',
        web: 'http://www.vidt.com.ar/',
        github: '#github'
    },
    {
        project: 'MASSIVE AGENCY',
        bgcolor: '#ED1B2F',
        previewUrl: imagePath + 'p-massive.png',
        faviconUrl: imagePath + 'f-massive.png',
        titulo: 'MASSIVE AGENCY',
        stack: 'PHP - SASS - Js',
        web: 'https://massive.ag/',
        github: '#github'
    },
    {
        project: 'GLOBAL BOOSTERS',
        bgcolor: '#EC3709',
        previewUrl: imagePath + 'p-globalboosters.png',
        faviconUrl: imagePath + 'f-globalboosters.png',
        titulo: 'GLOBAL BOOSTERS',
        stack: 'HTML - B4 - jQuery',
        web: 'http://globalboosters.com/',
        github: '#github'
    },
    {
        project: 'RED HAT SMART START',
        bgcolor: '#2E363D',
        previewUrl: imagePath + 'p-redhat-ss.png',
        faviconUrl: imagePath + 'f-redhat.png',
        titulo: 'RED HAT SMART START',
        stack: 'HTML - Vanilla Js',
        web: 'https://www.redhat.com/es/campaign/smart-start-consulting',
        github: '#github'
    },
    {
        project: 'ESTUDIO ABOGADOS',
        bgcolor: '#122E3C',
        previewUrl: imagePath + 'p-sabatellacaffieri.png',
        faviconUrl: imagePath + 'f-sabatellacaffieri.png',
        titulo: 'ESTUDIO ABOGADOS',
        stack: 'HTML - CSS',
        web: 'http://www.scabogados.com.ar/',
        github: '#github'
    },
    {
        project: 'PERFORMANCE S.R.L',
        bgcolor: '#1C549F',
        previewUrl: imagePath + 'p-performance.png',
        faviconUrl: imagePath + 'f-performance.png',
        titulo: 'PERFORMANCE S.R.L',
        stack: 'HTML - LESS - jQuery',
        web: 'http://www.performancesrl.com.ar/',
        github: '#github'
    },
]

// Recorro el array y creo un elemento en el html
for (let i = 0; i < items.length; i++) {
    Portfolio.append(createProject(
        items[i].project,
        items[i].previewUrl,
        items[i].faviconUrl,
        items[i].titulo,
        items[i].stack,
        items[i].web,
        items[i].github,
        items[i].bgcolor
    ));
}
