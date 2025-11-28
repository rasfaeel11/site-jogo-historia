export abstract class Personagem {
  constructor(
    public nome: string,
    protected _classe: string,
    protected _hp: number,
    protected _hpMax: number,
    protected _mana: number,
    protected _forca: number,
    protected _qtdPot: number,
    private _inteligencia: number,
    private _manaMax: number,
    protected _velocidade: number
  ) {}

  public get hp(): number {
    return this._hp;
  }
  public set hp(valor: number) {
    this._hp = valor;
  }

  public get hpMax(): number {
    return this._hpMax;
  }

  public get forca(): number {
    return this._forca;
  }

  public get qtdPot(): number {
    return this._qtdPot;
  }
  public set qtdPot(valor: number) {
    this._qtdPot = valor;
  }

  protected get classe(): string {
    return this._classe;
  }
  protected set classe(valor: string) {
    this._classe = valor;
  }

  public get mana(): number {
    return this._mana;
  }
  public set mana(valor: number) {
    this._mana = valor;
  }

  public get inteligencia(): number {
    return this._inteligencia;
  }
  public set inteligencia(valor: number) {
    this._inteligencia = valor;
  }

  public get manaMax(): number {
    return this._manaMax;
  }
  protected set manaMax(valor: number) {
    this._manaMax = valor;
  }
  public get velocidade(): number {
    return this._velocidade;
  }
  public set velocidade(valor: number){
    this._velocidade = valor;
  }
}
