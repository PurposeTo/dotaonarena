import { TroopsSpawner } from "../troops/TroopsSpawner";
import { WaveBuilder } from "../wavebuilding/WaveBuilder";
import { WavesProperties } from "./WavesProperties";


export class Invade {

    private readonly troopsShop: WaveBuilder;
    private readonly spawner: TroopsSpawner;
    private readonly wavesProps: WavesProperties;

    // 0 по умолчанию. Число увеличивается в начале волны.
    private waveNumber: number = 0;

    private onWaveDefeated: Runnable = () => { };

    constructor(troopsShop: WaveBuilder, spawner: TroopsSpawner, wavesProps: WavesProperties) {
        this.troopsShop = troopsShop;
        this.spawner = spawner;
        this.wavesProps = wavesProps;


        this.spawner.listenOnAllMobsKilled(() => this.onWaveDefeated());
    }

    public listenOnWaveDefeated(action: Runnable) {
        this.onWaveDefeated = action;
    }

    public StartNewWave() {
        this.waveNumber++;

        let waveLvl = this.wavesProps.GetWaveLvl(this.waveNumber);

        // минимальная стоимость одного юнита
        let minUnitCost = this.wavesProps.GetMinUnitCost(this.waveNumber);
        // стоимость волны
        let waveCost = this.wavesProps.GetWaveCost(this.waveNumber);
        waveCost = Math.max(minUnitCost, waveCost)

        print("Start wave №" + this.waveNumber + ". WaveLvl: " + waveLvl + ", minUnitCost: " + minUnitCost + ", waveCost: " + waveCost);

        // todo: выбирать для волны случайную стратегию составления
        let troops = this.troopsShop.Build(this.waveNumber, waveCost, minUnitCost)
            .map(it => it.format());

        // Удаляем прошлое событие и подписываемся заново
        this.spawner.listenOnUnitSpawned(unit => this.ConfigureMob(unit, waveLvl));
        this.spawner.SpawnAll(troops);
    }

    private ConfigureMob(unit: CDOTA_BaseNPC_Creature, plusLvl: number): void {
        if (plusLvl == 0) return;

        // fixme todo Если у существа уже максимальный уровень, то при вызова метода происходит ошибка и игра ломается.
        // Нужно узнать, какой может быть максимальный уровень существа и апнуть его до максимального уровня
        unit.CreatureLevelUp(plusLvl);
    }

}
