/*
# Symbol
Un "symbol" es un valor que está garantizado de ser único e irrepetible 
en el programa.
Se crean usando la función "Symbol()" (noten la mayúscula). Se usan
principalmente para servir de identificadores.

La manera en que se usan es asignando un Symbol a una variable, y 
asegurándonos de que todos los que quieran compartir ese identificador
lo hagan usando dicha variable.

Opcionalmente, le podemos pasar a Symbol un parámetro que es una 
descripción.
Funcionalmente, esto no tiene impacto alguno. Pero puede ser útil para
fines depurativos.
*/
// export const GLOBAL_FEEDBACK_PROVIDER_KEY = 'global-feedback';
export const GLOBAL_FEEDBACK_PROVIDER_KEY = Symbol('Global Feedback'); // Noten que no hay un "new".