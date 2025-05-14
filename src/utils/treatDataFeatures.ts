import dayjs from "dayjs";

// remove acentos e deixa tudo upperCase
export function textPolish(text: string): string {
    let polishedText = text;
    if (typeof text === "string") {
        polishedText = text
            .toUpperCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }
    return polishedText;
}

export function treatFileExtension(fileExtension: string): string {
    let treatedFileExtension = fileExtension.toLowerCase();
    if (fileExtension[0] !== ".") {
        treatedFileExtension = `.${treatedFileExtension}`;
    }
    if (treatedFileExtension === ".jpeg") {
        treatedFileExtension = ".jpg";
    }

    return treatedFileExtension;
}

export function ptbrDecimalToNumber(value: string) {
    let newString = value;
    if (!newString) return 0;

    const dots = newString.split(".").length - 1;
    const commas = newString.split(",").length - 1;
    if (dots !== 1) {
        newString = newString.replaceAll(".", "");
        newString = newString.replace(",", ".");
    } else if (dots === 1 && commas === 1) {
        newString = newString.replaceAll(".", "");
        newString = newString.replace(",", ".");
    } else {
        newString = newString.replace(",", ".");
    }

    const newValue = Number(newString);

    if (Number.isNaN(newValue)) return 0;

    return newValue;
}

export const valueInBRLWhitSymbol = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: "currency" as const,
    currency: "BRL" as const,
};
export const valueInBRL = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
};

export function treatData(
    data: string | number,
    type:
        | "currency"
        | "decimal"
        | "manualDecimal"
        | "date"
        | "dateTime"
        | "phone"
        | "document"
        | "cep" // para os tipos 'currency', 'decimal' e 'manualDecimal' o 'data' deve ser number
): string {
    let newData = data;
    if (!newData && type === "decimal") {
        newData = 0;
    }

    if (
        typeof newData === "string" &&
        (type === "decimal" || type === "manualDecimal" || type === "currency")
    ) {
        newData = ptbrDecimalToNumber(newData);
    }

    if (newData === undefined && newData === null) return "";

    switch (type) {
        case "currency":
            newData = newData.toLocaleString("pt-br", valueInBRLWhitSymbol);
            return newData;

        case "decimal":
            newData = newData.toLocaleString("pt-br", valueInBRL);
            return newData;

        case "manualDecimal":
            if (`${newData}`.includes(".")) {
                newData = newData.toLocaleString("pt-br", valueInBRL);
                return newData;
            }
            return `${newData}`;

        case "date":
            if (newData) {
                newData = dayjs(newData, "YYYY-MM-DD").format("DD/MM/YYYY");
                return newData;
            }
            return "";

        case "dateTime":
            if (newData) {
                newData = new Date(newData)
                    .toLocaleString("pt-br", { timeZone: "UTC" })
                    .replace(",", "");

                return newData;
            }
            return "";

        case "phone":
            if (typeof newData === "string") {
                newData = newData.replace(/\D/g, "");
                if (newData.length < 10) {
                    return newData;
                }
                newData = newData.replace(/(\d{2})(\d)/, "($1) $2");
                newData = newData.replace(/(\d)(\d{4})$/, "$1-$2");

                return newData;
            }
            return "";

        case "document":
            if (typeof newData === "string") {
                newData = newData.replace(/\D/g, "");
                // cpf
                if (newData.length < 12) {
                    newData = newData.replace(/(\d{3})(\d)/, "$1.$2");
                    newData = newData.replace(/(\d{3})(\d)/, "$1.$2");
                    newData = newData.replace(/(\d{3})(\d{2})$/, "$1-$2");
                }
                // cnpj
                else {
                    newData = newData.replace(/(\d{2})(\d)/, "$1.$2");
                    newData = newData.replace(/(\d{3})(\d)/, "$1.$2");
                    newData = newData.replace(/(\d{3})(\d)/, "$1/$2");
                    newData = newData.replace(/(\d{4})(\d{2})$/, "$1-$2");
                }

                return newData;
            }
            return "";

        case "cep":
            if (typeof newData === "string") {
                newData = newData.replace(/\D/g, "");
                newData = newData.replace(/(\d{5})(\d{1,3})$/, "$1-$2");

                return newData;
            }
            return "";

        default:
            return "";
    }
}

export function removeMask(value: string) {
    if (value) {
        let valueTreatment = value;
        valueTreatment = value.replace(/\D/g, "");

        return valueTreatment;
    }
    return value;
}
