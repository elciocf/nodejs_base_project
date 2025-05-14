import { treatFileExtension } from "@utils/treatDataFeatures";
import * as fs from "fs";
import multer from "multer";

export const storage = multer.diskStorage({
    destination: async (request, file, callback) => {
        const folder = `./files/users/avatar`;

        if (fs.existsSync(folder)) {
            return callback(null, folder);
        }

        fs.mkdirSync(folder, { recursive: true });

        return callback(null, folder);
    },
    filename: async (request, file, callback) => {
        const { cod_usuario } = request.user;
        const formatFile = treatFileExtension(
            file.originalname.split(".").pop()
        );

        const fileName = `${cod_usuario}${formatFile}`;

        return callback(null, fileName);
    },
});
