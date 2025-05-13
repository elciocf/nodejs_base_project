class UserAdm {
    cod_usuario_adm: number;
    nome: string;
    login: string;
    senha?: string;
    email: string;
    created_at?: Date;
    updated_at?: Date;

    constructor() {
        if (!this.cod_usuario_adm) {
            this.created_at = new Date();
            this.updated_at = new Date();
        }
    }
}

export { UserAdm };
