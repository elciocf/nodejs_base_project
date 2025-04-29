class User {
    cod_usuario: number;
    nome: string;
    login: string;
    senha: string;
    email: string;
    cod_tipo_usuario: number;
    created_at: Date;
    updated_at: Date;

    constructor() {
        if (!this.cod_usuario) {
            this.created_at = new Date();
            this.updated_at = new Date();
        }
    }
}

export { User };
