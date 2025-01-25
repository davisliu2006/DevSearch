export function split_by_words(str: string) {
    return str.split(/[^a-zA-Z0-9]+/);
}