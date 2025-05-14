interface IRefreshTokenDTO {
    cod_token?: number;
    cod_usuario: number;
    refresh_token: string;
    expira_em: Date;
    created_at?: Date;
    updated_at?: Date;
}

export { IRefreshTokenDTO };
