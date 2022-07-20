export class Transit_end {
    public lectura_sensores_id: number; // El que devuelve la basse de datos al insertar un registro (es serial)
    public id: number;
    public lane: string;
    public lane_id: string;
    public time_iso: string;
    public speed: number;
    public height: number;
    public width: number;
    public length: number;
    public refl_pos: string;
    public gap: string;
    public headway: string;
    public occupancy: string;
    public class_id: string;
    public position: string;
    public direction: string;
    public wrong_way: string;
    public stop_and: string;

    public init() {
        this.lectura_sensores_id = 1;
        this.id = 1;
        this.lane = "0";
        this.lane_id = "0";
        this.time_iso = "0";
        this.speed = 0;
        this.height = 0;
        this.width = 0;
        this.length = 0;
        this.refl_pos = "0";
        this.gap =  "0";
        this.headway = "0";
        this.occupancy = "0";
        this.class_id = "0";
        this.position = "0";
        this.direction = "0";
        this.wrong_way =  "0";
        this.stop_and = "0";
}
}