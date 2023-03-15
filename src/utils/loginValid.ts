export function loginValidation(str: string):boolean {
    return /^[A-Za-z\_]*$/.test(str);
};

export function LengthValidation(str: string):boolean {
    return str.length > 5;
};