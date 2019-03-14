/* 
Activité 2
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

// Element DOM contenant les liens
var linkContainer = document.getElementById("contenu");


/** Retourne un DOM element du lien.
 * @param {object} link : objet de type lien {titre,url,auteur}
 * @return {DOM ELEMENT}
 */
function createLinkElt(link) {
    var titreElt = document.createElement("a");
        titreElt.textContent = link["titre"];
        titreElt.style.color = "#428bca";
        titreElt.style.fontWeight = "bold";
        titreElt.style.textDecoration = "none";
        titreElt.style.marginRight = "5px";
        titreElt.href = link["url"];
        titreElt.setAttribute("target", "_blank");

    var urlElt = document.createElement("span");
        urlElt.textContent = link["url"];

    var auteurElt = document.createElement("span");
        auteurElt.textContent = "Ajouté par " + link["auteur"];

    var linkElt = document.createElement("div");
        linkElt.setAttribute("class", "lien");
        linkElt.appendChild(titreElt);
        linkElt.appendChild(urlElt);
        linkElt.appendChild(document.createElement("br"));
        linkElt.appendChild(auteurElt);
    
    return linkElt;
};

/** Affichage des liens contenus dans le tableau listeLiens. */
function showLinks() {
    // Création DOM des liens et ajout dans le container.
    listeLiens.forEach(function(link) {
        linkContainer.appendChild(createLinkElt(link));
    });
};

/** Ajoute un lien en tant que premier élément.
 * Insertion du lien dans le tableau listeLiens et création DOM dans linkContainer
 * @param {object} link : objet de type lien {titre,url,auteur}
 */
function appendLink(link) {
    // Insertion Object
    listeLiens.unshift(link);
    // Insertion DOM Element
    linkContainer.insertAdjacentElement('afterbegin', createLinkElt(link));
}


/** Regroupement des fonctions de gestion */
function createListeners() {
    var form = document.getElementById("form_addlink");
    var div_confirm = document.getElementById("div_confirmlink");
    var div_saisie = document.getElementById("div_newlink");
    var btn_new = document.getElementById("btn_newlink");
    /* Dictionnaire des inputs de saisie : 
        key {string} : DOMElement.id 
        value {object} : {target: DOMElement, tip: string}
    */
    var inputs = {};
    // Vérification RegEx : si la chaîne commence par "http://" ou "https://" sans tenir compte de la casse.
    var regHTTP = new RegExp('^(http|https):\/\/', 'i');

    // Interception de l'événement submit du formulaire
    form.addEventListener("submit", onSubmit);

    // Pour activer le formulaire de saisie
    btn_new.addEventListener("click", onCreateNew);

    // Recensement des inputs de type Text du formulaire avec leur contenu par défaut.
    //Array.from(form.querySelectorAll('input[type=text]')).forEach(function(elt){
    Array.from(form.getElementsByTagName('input')).forEach(function(elt){
        switch (elt.type.toLowerCase()) {
            case "text":
                /* Ajoute l'élément au dictionnaire avec son texte par défaut (tip)
                   le texte par défaut indique à l'utilisateur à quoi correspond le field.
                */
                inputs[elt.id] = {"target": elt, "tip": elt.value};
                //Sur réception du focus (pour effacer le tip si besoin)
                elt.addEventListener("focus", onFocus);
                //Sur perte du focus (pour remettre le tip si besoin et contrôler l'url)
                elt.addEventListener("blur", onBlur);
                break;
            case "submit":
                // Interception événement onclick pour gérer un Event OnBeforeSubmit
                elt.addEventListener("click", onBeforeSubmit);
                break;
            case "reset":
                // Annule la création
                elt.addEventListener("click", onCancel);
        }
    });
   
    /** Reset du contenu des inputs de saisie : remet le comportement par défaut */
    function reset_inputs() {
        for (var key in inputs) {
            inputs[key].target.value = inputs[key].tip;
            inputs[key].target.style.color = "gray";
        }
    };

    /** Affichage du formulaire de saisie */
    function onCreateNew(e) {
        // Masque le bouton de création et affiche le block de saisie
        btn_new.style.display = "none";
        div_saisie.style.display = "block";
        // focus sur le 1er élément de saisie
        for (var key in inputs) {
            inputs[key].target.focus();
            break;
        }
        // Comme le bouton est à l'intérieur du form, on empêche le submit...
        e.preventDefault();
    };
    /** Annulation création d'un nouveau lien */
    function onCancel() {
        // Masque le block de saisie et affiche le bouton de création.
        div_saisie.style.display = "none";
        btn_new.style.display = null;
        // Valeurs par défaut dans les inputs de saisie
        reset_inputs();
    };


    /** Sur réception du focus : Vérification du contenu existant */
    function onFocus() {
        // Vérification si le contenu correspond au tip. (si oui on efface pour une saisie vierge)
        if (this.value === inputs[this.id].tip) {
            this.value = null;
        }
        if (this.style.color !="black") this.style.color = "black";
    };
    /** Sur perte du focus : Vérification du contenu saisie ou non */
    function onBlur() {
        // Vérification si un contenu a été saisie, sinon on remet le tip par défaut.
        if (this.value===null || this.value === "") {
            this.value = inputs[this.id].tip;
            this.style.color = "gray";
        } else {
            // Si input url, on vérifie la présence de 'http/https'
            if (this.id === "url") {
                if (!regHTTP.test(this.value)) {
                    this.value = "http://" + this.value;
                }
            }
        }
    };

    /** Vérification des éléments saisie par l'utilisateur avant l'event submit */
    function onBeforeSubmit() {
        // Vérification des données saisie (on quitte au premier input invalide: cad aucune saisie utilisateur)
        for (var key in inputs) {
            if (inputs[key].target.value === inputs[key].tip) {
                // Mise à blanc pour que la fonctionnalité required de l'input s'active
                inputs[key].target.value = null;
                break;
            }
        }
    };

    /** Création et affichage du nouveau lien */
    function onSubmit(e) {
        // Les valeurs ont été contrôlées sur les Events onBlur() & onBeforeSubmit()
        var link = {
            titre: form.elements.titre.value,
            url: form.elements.url.value,
            auteur: form.elements.auteur.value
        };
        // Ajout du nouveau lien
        appendLink(link);

        // Affichage du message de confirmation pour une durée de 2secondes
        div_confirm.textContent = `Le lien "${link.titre}" a bien été ajouté.`;
        div_confirm.style.display = "block";
        setTimeout(function() {div_confirm.style.display="none";}, 2000);
        /* Plutôt qu'un copier/coller : on utilise la fonction d'annulation pour mettre au propre les inputs */
        onCancel();

        // Annulation de l'envoi des données
        e.preventDefault();
    };

};


// Création des événements
createListeners();
// Affichage des liens existants
showLinks();