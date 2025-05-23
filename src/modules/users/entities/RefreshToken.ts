class RefreshToken {
    cod_token: number;
    cod_usuario: number;
    refresh_token: string;
    expira_em: Date;
    created_at?: Date;
    updated_at?: Date;

    constructor() {
        if (!this.cod_token) {
            this.created_at = new Date();
            this.updated_at = new Date();
        }
    }
}

export { RefreshToken };
