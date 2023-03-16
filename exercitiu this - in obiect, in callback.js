var ar = {
    randomFnArrow: (callback) => { callback(); },
    randomFnNormal: function(callback) { callback() },
    fArrow: () => { console.log(this); },
    fNormala: function() { console.log(this); }
}

var o3 = {
    myFn() {
        ar.randomFnArrow(() => console.log(this)); // this = o3; i was expecting ar -- i need an explanation for this
        ar.randomFnNormal(() => console.log(this)); // o3; was expecting ar as well -- i need explanation for this as well
        ar.randomFnArrow(function() { console.log(this); }); //window; kind of expected this, but i'm not sure if my logic is correct
        ar.randomFnNormal(function() { console.log(this); }); //same as above
    },
    myFn2() {
        ar.fArrow(); //window; let's say i understand this one
        ar.fNormala(); //ar; i expected this
    }
}

/*
When o3.myFn() is invoked, the ar.randomFnArrow and ar.randomFnNormal properties are invoked with a callback function passed as an argument,

In case of arrow function in both ar.randomFnArrow and ar.randomFnNormal this will refer to the parent/enclosing scope of that function. In this example, it refers to o3 as they are invoked inside o3.myFn()
*/
/**
 * In cazul functiilor normale, `this` ia valoarea obiectului care executa functia (execution context...)
 * Functii arrow: `this` ia valoarea contextului lexical in care e executata functia, nu are treaba cu cine executa functia (daca obiect.functieArrow() e apelata in window => this = window, nu obiect)
 * Functii arrow folosite ca callback: daca o fn arrow e definita ca argument, `this` are valoarea din contextul lexical unde a fost definita, nu apelata!
 * 
 * var callback1 = () => { console.log(this) };
 * var def = {
 *      fnDef: function(cb) { cb() }
 * }
 * var obj = {
 *      m1: function() {
 *          def.fnDef( ()=>{console.log(this)} ); // this este obiectul in care a fost definit callbackul => obj
 *          def.fnDef( callback1 ); // this este window
 *      }
 * }
 * 
 * Functii normale folosite ca callback: returneaza window mereu*, nu conteaza in cate obiecte sau functii sunt nestuite. `this` ia valoarea contextului de executie in care e apelata functia, nu definita (* ex de mai sus,
 * daca se inlocuieste peste tot functia arrow cu fn normala, nu conteaza unde e definita functia, conteaza cum e apelata: cb() -> se creaza context nou de executie in care `this` window pt ca nu e atasata de niciun
 * obiect functia. Mai jos exemplu in care callbackul ESTE atasat de un obiect cand este apelat)
 * 
 * var callback1 = function () { console.log(this) };
 * var ob = {};
 * var def = {
 *      fnDef: function(cb) { ob.cb = cb; ob.cb(); }
 * };
 * var obj = {
 *      m1: function() {
 *          def.fnDef( ()=>{console.log(this)} ); // this este obiectul in care a fost definit callbackul => obj (pt ca e arrow function; daca era normal fn, lua valoarea de unde e APELATA, adica ob.cb())
 *          def.fnDef( callback1 ); // this este ob;
 *      }
 * } 
 */