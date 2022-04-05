export interface Token {
    usuario_id: string;
    tipo_usuario_id: string;
    nombre_completo: string;
    estado: boolean;
    contrasena: string;
    img?: string;
    access_token?: string,
    expires_in?: number
}