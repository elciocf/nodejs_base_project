class UserType {
    cod_tipo_usuario: number;
    descricao: string;
    created_at: Date;
    updated_at: Date;

    constructor() {
        if (!this.cod_tipo_usuario) {
            this.created_at = new Date();
            this.updated_at = new Date();
        }
    }
}

export { UserType };
