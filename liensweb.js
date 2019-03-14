/* 
Activité 3
*/

// Element DOM contenant les liens
var linkContainer = document.getElementById("contenu");

const dbLinks = {
    "links": [],
    // Le container
    "target": document.getElementById("contenu"),
    // L'accès aux API Restfull
    "url_get": "https://oc-jswebsrv.herokuapp.com/api/liens",
    /* => faut adresser les données dans un format FormData() */
    "url_post": "https://oc-jswebsrv.herokuapp.com/api/lien",
    

    /** Charge les données dans le tableau links en effectuant un appel ajax à l'adresse url_get */
    "refresh": function() {
        var Me = this;
        Me.links = [];
        ajaxGet(this.url_get, function(response) {
            try {
                var JsonObject = JSON.parse(response);
                Me.links = JsonObject;    
                Me.showLinks();
            } catch (err) {
                console.error(err);
            }
        });
    },

    /** Affiche les données du tableau links dans le container target */
    "showLinks": function() {
        // Clear childNodes
        this.target.innerHTML = '';
        // Append links
        for (var i=0, ii=this.links.length; i<ii; i++) {
            this.target.appendChild(this.createDOMElement(this.links[i]));
        }
    },

    /** Addresse un nouveau lien et actualise l'ensemble des liens
     * @param {object} link 
     */
    "append": function(link, callback) {
        var Me = this;
        /* Préparation des données à envoyer au serveur :
                = new FormData(document.getElementById("form_addlink")); 
        */
        var postdata = new FormData();
        for (var key in link) {
            postdata.append(key, link[key]);
        }
        ajaxPost(this.url_post, postdata, function(response) {
            /* Cela aurait été mieux de rafraichir les données : dbLinks.refresh(); */

            // Ajout du lien en cas de succès.
            link["id"] = response;
            Me.links.unshift(link);
            // Insertion DOM Element
            Me.target.insertAdjacentElement('afterbegin', Me.createDOMElement(link));
            // Retour de confirmation
            if (callback) callback(link);
        });
    },
 
    /** Retourne un DOM element du lien.
     * @param {object} link : objet de type lien {titre,url,auteur}
     * @return {DOM ELEMENT}
     */
    "createDOMElement": function(link) {
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
            linkElt.setAttribute("data-id", link["id"]);
            linkElt.appendChild(titreElt);
            linkElt.appendChild(urlElt);
            linkElt.appendChild(document.createElement("br"));
            linkElt.appendChild(auteurElt);
        
        return linkElt;
    }
}
Object.defineProperty(dbLinks, "count", {get:function(){return this.links.length;}});


/** Récupère le contenu textuel d'une requête GET
 * @param {string} url : URL cible
 * @param {function} callback : fonction de callback appelée en cas de succès
 */
function ajaxGet(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
}

/** Exécute un appel POST
 * @param {string} url : URL cible
 * @param {FormData} data : Objet FormData
 * @param {function} callback : fonction de callback appelée en cas de succès
 */
function ajaxPost(url, data, callback) {
    var req = new XMLHttpRequest();
    req.open("POST", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(data);
}


/** Regroupement des fonctions de gestion pour l'ajout d'un nouveau lien */
function createListeners() {
    var form = document.getElementById("form_addlink");
    var div_confirm = document.getElementById("div_confirmlink");
    var div_saisie = document.getElementById("div_newlink");
    var btn_new = document.getElementById("btn_newlink");
    // Référencement des inputs : Array.{DOMElement}
    var inputs = [];
    // Vérification RegEx : si la chaîne commence par "http://" ou "https://" sans tenir compte de la casse.
    var regHTTP = new RegExp('^(http|https):\/\/', 'i');

    // Interception de l'événement submit du formulaire
    form.addEventListener("submit", onSubmit);

    // Pour activer le formulaire de saisie
    btn_new.addEventListener("click", onCreateNew);

    // Recensement des inputs de type Text du formulaire avec leur contenu par défaut.
    Array.from(form.getElementsByTagName('input')).forEach(function(elt){
        switch (elt.type.toLowerCase()) {
            case "text":
                // Ajoute l'élément
                inputs.push(elt);
                if (elt.id === "url") {
                    // Sur perte du focus (pour contrôler l'url)
                    elt.addEventListener("blur", checkUrl);
                }
                break;
            case "reset":
                // Annule la création
                elt.addEventListener("click", onCancel);
        }
    });
  

    /** Affichage du formulaire de saisie */
    function onCreateNew(e) {
        // Masque le bouton de création et affiche le block de saisie
        btn_new.style.display = "none";
        div_saisie.style.display = "block";
        // focus sur le 1er élément de saisie
        inputs[0].focus();
        // Comme le bouton est à l'intérieur du form, on empêche le submit...
        e.preventDefault();
    };
    /** Annulation création d'un nouveau lien */
    function onCancel(e) {
        // Masque le block de saisie et affiche le bouton de création.
        div_saisie.style.display = "none";
        btn_new.style.display = null;
        // Reset du contenu des inputs de saisie
        form.reset();
    };

    function checkUrl() {
        if (this.value !== null && this.value !== "") {
            // On vérifie la présence de 'http/https'
            if (this.id === "url") {
                if (!regHTTP.test(this.value)) {
                    this.value = "http://" + this.value;
                }
            }
        }
    };

    /** Création et affichage du nouveau lien */
    function onSubmit(e) {
        var link = {
            titre: form.elements.titre.value,
            url: form.elements.url.value,
            auteur: form.elements.auteur.value
        };
        // Ajout du nouveau lien et affichage de confirmation en cas de succès.
        dbLinks.append(link, function() {
            // Affichage du message de confirmation pour une durée de 2secondes
            div_confirm.textContent = `Le lien "${link.titre}" a bien été ajouté.`;
            div_confirm.style.display = "block";
            setTimeout(function() {div_confirm.style.display="none";}, 2000);
        });

        /* Plutôt qu'un copier/coller : on utilise la fonction d'annulation pour mettre au propre */
        onCancel();

        // Annulation de l'envoi des données
        e.preventDefault();
    };
};


// Inscription des événements pour ajouter un nouveau lien
createListeners();
// Chargement & affichage des liens existants
dbLinks.refresh();


