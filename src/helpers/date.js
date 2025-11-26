/**
 * Transformamos una fecha al formato: DD/MM/YY H:m:s
 * 
 * @param {Date|string|number} date 
 * @returns {string}
 */
export function formatDate(date) {
    if(typeof date == 'string') {
        date = new Date(date);
    }

    return Intl.DateTimeFormat('es-AR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(date).replace(',', '');
}

/**
 * 
 * @param {Date|string|number} date 
 * @returns {string}
 */
export function formatDateForFilenames(date) {
    return formatDate(date)
        .replaceAll(':', '')
        .replaceAll('/', '')
        .replace(' ', '');
}