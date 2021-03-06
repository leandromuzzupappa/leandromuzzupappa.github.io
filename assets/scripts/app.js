const cargarProyectos = document.querySelector('#proyectos');
const linkIcon = '<svg width="25" height="25" viewBox="0 0 25 25"><g id="Group_8" data-name="Group 8" transform="translate(-1411 -2870)"><rect id="Rectangle_20" data-name="Rectangle 20" class="cls-1" width="25" height="25"transform="translate(1411 2870)" /><path id="Icon_awesome-external-link-alt" data-name="Icon awesome-external-link-alt" class="cls-2"d="M18.506.741V4.694a.776.776,0,0,1-1.316.524l-1.147-1.1L8.218,11.636a.793.793,0,0,1-1.09,0l-.727-.7a.721.721,0,0,1,0-1.048l7.824-7.521-1.147-1.1A.739.739,0,0,1,13.623,0h4.112A.757.757,0,0,1,18.506.741ZM13.077,8.363l-.514.494a.727.727,0,0,0-.226.524v4.454H2.056V3.953h8.482a.787.787,0,0,0,.545-.217l.514-.494a.738.738,0,0,0-.545-1.265H1.542A1.513,1.513,0,0,0,0,3.459V14.33a1.513,1.513,0,0,0,1.542,1.482H12.851a1.513,1.513,0,0,0,1.542-1.482V8.887A.775.775,0,0,0,13.077,8.363Z"transform="translate(1414 2875)" /></g></svg>';
const githubIcon = '<svg width="25" height="25" viewBox="0 0 25 25"><g id="Group_8" data-name="Group 8" transform="translate(-1412 -2870)"><rect id="Rectangle_20" data-name="Rectangle 20" class="cls-1" width="25" height="25"transform="translate(1412 2870)" /><path id="Icon_awesome-github" data-name="Icon awesome-github" class="cls-2"d="M5.96,14.153c0,.07-.083.126-.187.126s-.2-.045-.2-.126.083-.126.187-.126S5.96,14.073,5.96,14.153ZM4.842,14c-.025.07.047.15.154.171a.171.171,0,0,0,.223-.07c.022-.07-.047-.15-.154-.181A.187.187,0,0,0,4.842,14Zm1.588-.059c-.1.024-.176.091-.165.171s.1.115.212.091.176-.091.165-.161S6.534,13.926,6.43,13.937ZM8.794.563A8.495,8.495,0,0,0,0,9.078a8.772,8.772,0,0,0,6.089,8.348c.46.08.621-.2.621-.422S6.7,15.595,6.7,14.862c0,0-2.515.524-3.043-1.04,0,0-.41-1.016-1-1.277,0,0-.823-.548.057-.537a1.907,1.907,0,0,1,1.387.9,1.93,1.93,0,0,0,2.619.729A1.919,1.919,0,0,1,7.3,12.46c-2.008-.216-4.034-.5-4.034-3.857A2.607,2.607,0,0,1,4.11,6.548,3.21,3.21,0,0,1,4.2,4.178c.751-.227,2.479.942,2.479.942a8.726,8.726,0,0,1,4.512,0s1.728-1.173,2.479-.942a3.209,3.209,0,0,1,.093,2.37A2.679,2.679,0,0,1,14.692,8.6c0,3.368-2.116,3.637-4.124,3.857a2.033,2.033,0,0,1,.611,1.619c0,1.176-.011,2.632-.011,2.918,0,.227.165.5.621.422a8.689,8.689,0,0,0,6.028-8.341C17.817,4.238,13.776.563,8.794.563ZM3.492,12.6c-.047.035-.036.115.025.181s.14.08.187.035.036-.115-.025-.181S3.538,12.555,3.492,12.6ZM3.1,12.317c-.025.045.011.1.083.136a.109.109,0,0,0,.154-.024c.025-.045-.011-.1-.083-.136S3.129,12.282,3.1,12.317ZM4.268,13.56c-.057.045-.036.15.047.216s.187.091.233.035.025-.15-.047-.216S4.314,13.5,4.268,13.56Zm-.41-.513c-.057.035-.057.126,0,.206s.154.115.2.08a.156.156,0,0,0,0-.216C4.009,13.036,3.916,13,3.858,13.047Z"transform="translate(1416 2873.438)" /></g></svg>';

console.log('Buenas! Los proyectos los traigo de un json -> scripts/proyectos.js');
console.log('lnmuzzupappa@gmail.com -- github.com/leandromuzzupappa');


window.addEventListener('load', () => {

    proyectos.map(proyecto => {
        let web = proyecto.links.web != '' ? `<a href="${proyecto.links.web}" target="_blank">${linkIcon}</a>` : '';
        let github = proyecto.links.github != '' ? `<a href="${proyecto.links.github}" target="_blank">${githubIcon}</a>` : '';

        cargarProyectos.innerHTML += `
        <tr>
            <td>${proyecto.ano}</td>
            <td>${proyecto.titulo}</td>
            <td>${proyecto.lugar}</td>
            <td>${proyecto.stack}</td>
            <td>${ web + github }</td>
        </tr>
        `;
    })
})