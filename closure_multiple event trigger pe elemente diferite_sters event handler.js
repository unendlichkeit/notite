/**
Cand se sterge un event handler cu removeEventListener('event', sameEventHandler), functia data indica catre o referinta. Referinta trebuie sa fie aceeasi folosita si la atasarea
handlerului (cand s-a facut addEventListener('event', sameEventHandler))

Daca handlerul care se ataseaza pt un event pt fiecare element dintr-o lista de elemente trebuie sa primeasca si niste valor din interiorul unui scope, handlerul trebuie 
creat in interiorul scopului (unde poate primi parametrii pt ca are acces la variabilele din interior), dar ca sa se poata folosi aceasi functie pt handle, ea se defineste in afara
scopului si se inglobeaza intr-un closure care capteaza variabilele din scope

**/
const listaElemente = document.querySelectorAll('.nisteDIVs');
let eventHandlerReference;
function eventHandlerWrapper(param1) {
    //functia care creaza closure pt parametrii dati in interiorul unui scope independent de functia asta
    return function enterHandler(e) {
        console.log('keypress event on currentSlide: ', param1);
        //aici se folosesc parametrii necesari
    }
}
function scopeEnclosure() {
    let someVar = 'something private';
    for(const elem of listaElemente) {
        let i = 0;
        //inainte sa fie creata referinta noua si adaugata in arrayul care stocheaza referintele, se sterge handlerul atasat ulterior ca sa nu se ataseze de fiecare data
        //cand scopeEnclosure() e apelata. Atentie la 'i'.
        elem.removeEventListener('click', eventHandlerReference[i]);
        eventHandlerReference[i] = eventHandlerWrapper(someVar);
        elem.addEventListener('click', eventHandlerReference[i]);
        i++;
    }
}
/**
Daca scopeEnclosure e apelata de mai multe ori, handlerul o sa se ataseze de mai multe ori pe fiecare element in parte. Asta se evita daca inainte de adaugat handlerul, 
se sterge ce a fost deja atasat, dar aici e nevoie de referinta aceluiasi handler folosit in executia anterioara a codului. Un fel de a obtine asta, e sa salvezi fiecare referinta
pt fiecare element in parte intr-un array si din el se va folosi referinta de care e nevoie in fiecare loop al for-ului.
**/