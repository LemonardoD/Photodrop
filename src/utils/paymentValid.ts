export function cardLengthValidation(str: string):boolean {
    return str.length === 16;
};
  
export function cvsLengthCheck(str: string):boolean {
    return str.length === 3;
};

export function numberValidation(str: string):boolean {
    return /^[0-9]*$/.test(str);
};