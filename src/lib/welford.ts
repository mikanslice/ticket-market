export class Welford {
    private _n: number;
    private _mean: number;
    private _m2: number;

    get count() { return this._n; }
    get mean() { return this._mean; }
    get variance() {
        if (this._n < 2) {
            return 0;
        }
        return this._m2 / this._n;
    }

    constructor() {
        this._n = 0;
        this._mean = 0;
        this._m2 = 0;
    }

    add(value: number) {
        this._n += 1;
        const delta = value - this._mean;
        this._mean += delta / this._n;
        this._m2 += delta * (value - this._mean);
    }

    standardDeviation() {
        if (this._n < 2) {
            return 0;
        }
        return Math.sqrt(this._m2 / this._n);
    }

    clone() {
        const newWelford = new Welford();
        newWelford._n = this._n;
        newWelford._mean = this._mean;
        newWelford._m2 = this._m2;
        return newWelford;
    }
}