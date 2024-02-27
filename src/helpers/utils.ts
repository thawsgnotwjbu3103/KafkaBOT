export class Utils {
    public static createArray(startNum: number, endNum: number): string[] {
        return Array.from({ length: endNum - startNum + 1 }, (_, i) => (startNum + i).toString());
    }
}
