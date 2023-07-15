export function nameValidation(str: string): boolean {
    return /^[A-Za-z\_\ \&]*$/.test(str);
}

export function phoneValidation(str: string): boolean {
    return /^[\+]?[0-9]{1,5}?[(]?[0-9]{2,3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/.test(str);
}

export function nameLengthCheck(str: string): boolean {
    return str.length > 1;
}

export function emailValidation(email: string) {
    const tst = /\S+@\S+\.com/;
    return tst.test(email);
}

export function cardLengthValidation(str: number): boolean {
    return str.toString().length === 16;
}

export function cvsLengthCheck(str: number): boolean {
    return str.toString().length === 3;
}

export function numberValidation(str: number): boolean {
    return /^[0-9]*$/.test(str.toString());
}
