/* 
Activité 1
*/

// Liste des liens Web à afficher. Un lien est défini par :
// - son titre
// - son URL
// - son auteur (la personne qui l'a publié)
var listeLiens = [
    {
        titre: "So Foot",
        url: "http://sofoot.com",
        auteur: "yann.usaille"
    },
    {
        titre: "Guide d'autodéfense numérique",
        url: "http://guide.boum.org",
        auteur: "paulochon"
    },
    {
        titre: "L'encyclopédie en ligne Wikipedia",
        url: "http://Wikipedia.org",
        auteur: "annie.zette"
    }
];

// TODO : compléter ce fichier pour ajouter les liens à la page web
function addLinks() {
    var container = document.getElementById("contenu");

    listeLiens.forEach(function(link) {
        var linkElt = document.createElement("div");
            linkElt.setAttribute("class", "lien");

        var titreElt = document.createElement("a");
            titreElt.textContent = link["titre"] + " ";
            titreElt.style.color = "#428bca";
            titreElt.style.fontWeight = "bold";
            titreElt.style.textDecoration = "none";
            titreElt.href = link["url"];

        var urlElt = document.createElement("span");
            urlElt.textContent = link["url"];

        var auteurElt = document.createElement("span");
          auteurElt.textContent = "Ajouté par " + link["auteur"];

        linkElt.appendChild(titreElt);
        linkElt.appendChild(urlElt);
        linkElt.appendChild(document.createElement("br"));
        linkElt.appendChild(auteurElt);

        container.appendChild(linkElt);
    });
    
};
addLinks();