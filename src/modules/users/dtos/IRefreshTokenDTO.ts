interface IRefreshTokenDTO {
    cod_token?: string;
    cod_usuario: string;
    refresh_token: string;
    expira_em: Date;
    created_at?: Date;
    updated_at?: Date;
}

export { IRefreshTokenDTO };
