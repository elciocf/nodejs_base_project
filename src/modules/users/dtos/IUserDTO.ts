interface IUserDTO {
    cod_usuario?: string | number;
    nome: string;
    login: string;
    senha?: string;
    email: string;
    cod_tipo_usuario: number;
    created_at?: Date;
    updated_at?: Date;
}

export { IUserDTO };
