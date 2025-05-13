declare namespace Express {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export interface Request {
        user: {
            nome: string;
            cod_usuario: number | string;
            cod_tipo_usuario: number | string;
            login: string;
            email: string;
        };
        userAdm: {
            nome: string;
            cod_usuario_adm: number | string;
        };
    }
}
