import { supabase } from "./supabase";

/**
 * 
 * @param {string} filename 
 * @param {File|Blob} file 
 * @param {string} bucket 
 */
export async function uploadFile(filename, file, bucket = 'avatars') {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .upload(filename, file, {
            // "Upsert" => update or insert.
            upsert: true,
        });

    if(error) {
        console.error('[storage.js uploadFile] Error al subir el archivo.', error);
        throw new Error(error.message);
    }
}

export async function deleteFile(filename, bucket = 'avatars') {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .remove(filename);
        
    if(error) {
        console.error('[storage.js deleteFile] Error al eliminar el archivo.', error);
        throw new Error(error.message);
    }
}

/**
 * 
 * @param {string} filename 
 * @param {string} bucket 
 * @returns 
 */
export function getFileURL(filename, bucket = 'avatars') {
    return supabase.storage.from(bucket).getPublicUrl(filename).data.publicUrl;
}