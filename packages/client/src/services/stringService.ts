declare global {
    interface String {
        pascalToWords: () => string;
    }
}
export default function register() {
    String.prototype.pascalToWords = function() {
        const res = this.replace(/([A-Z])/g, " $1");
        return res.charAt(0).toUpperCase() + res.slice(1);
    };
}
