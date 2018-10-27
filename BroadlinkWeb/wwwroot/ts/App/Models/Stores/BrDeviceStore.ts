/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/BrDevice.ts" />
/// <reference path="../Entities/ControlSet.ts" />
/// <reference path="../Entities/Control.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import BrDevice = App.Models.Entities.BrDevice;
    import ControlSet = App.Models.Entities.ControlSet;
    import Control = App.Models.Entities.Control;
    import Xhr = Fw.Util.Xhr;

    export class BrDeviceStore extends Fw.Models.StoreBase<BrDevice> {

        private static _instance: BrDeviceStore = null;
        public static get Instance(): BrDeviceStore {
            if (BrDeviceStore._instance === null)
                BrDeviceStore._instance = new BrDeviceStore();

            return BrDeviceStore._instance;
        }

        protected constructor() {
            super();

            this.SetClassName('BrDeviceStore');
            this.EnableLog = true;
        }

        public Get(id: number): BrDevice {
            const entity = _.find(this.List, (br: Entities.BrDevice) => {
                return (br.Id === id);
            });
            return entity;
        }

        public async GetList(): Promise<BrDevice[]> {
            this.Log('GetList');

            const params = new Xhr.Params(
                'BrDevices',
                Xhr.MethodType.Get
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                for (let i = 0; i < res.Values.length; i++)
                    this.Merge(res.Values[i] as BrDevice);

                return _.values(this.List);
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }

        public async Exec(controlSet: ControlSet, control: Control): Promise<boolean> {
            this.Log('Exec');

            // 渡し値がヘン
            if (
                !controlSet
                || !controlSet.BrDeviceId
                || !control
                || !control.Code
                || control.Code === ''
            ) {
                return false;
            }

            let result = false;

            if (controlSet.IsBrDevice) {
                // Broadlinkデバイスのとき
                // デバイス種類別処理を行う。

                // 対応するデバイスを取得
                const pairedDev = this.Get(controlSet.BrDeviceId);

                switch (pairedDev.DeviceType) {
                    case App.Items.BrDeviceType.A1:
                        // コマンドは一つだけ - 現在の値を取得
                        const res1 = await Stores.A1s.Get(controlSet);
                        result = (res1 !== null);
                        break;

                    case App.Items.BrDeviceType.Sp2:
                        // コマンドはControlごとに。
                        const res2 = await Stores.Sp2s.Set(controlSet, control);
                        result = (res2 !== null);
                        break;

                    case App.Items.BrDeviceType.Rm2Pro:
                        // コマンドは一つだけ - 現在の値を取得
                        const res3 = await Stores.Rm2Pros.GetTemperature(controlSet);
                        result = (res3 !== null);
                        break;


                    // 以降、未対応。
                    case App.Items.BrDeviceType.Rm:
                    case App.Items.BrDeviceType.Dooya:
                    case App.Items.BrDeviceType.Hysen:
                    case App.Items.BrDeviceType.Mp1:
                    case App.Items.BrDeviceType.S1c:
                    case App.Items.BrDeviceType.Sp1:
                    case App.Items.BrDeviceType.Unknown:
                    default:
                        result = false;
                        break;
                }

            } else {
                // Brデバイスでないとき
                // リモコンコードを実行する。
                result = await Stores.Rms.Exec(controlSet, control);
            }

            // コマンド送信成功、かつトグルがアサインされているとき
            if (
                result === true
                && (control.IsAssignToggleOn || control.IsAssignToggleOff)
            ) {
                if (control.IsAssignToggleOn && control.IsAssignToggleOff) {
                    // On/Off 両方アサインされているボタンのとき

                    // 一旦Onにし、しばらく置いてOffに戻す。
                    const changed = (controlSet.ToggleState !== true);
                    controlSet.ToggleState = true;
                    if (changed)
                        controlSet.DispatchChanged();

                    _.delay(() => {
                        const changed2 = (controlSet.ToggleState !== false);
                        controlSet.ToggleState = false;
                        if (changed2)
                            controlSet.DispatchChanged();

                        Stores.ControlSets.UpdateHeader(controlSet);

                    }, 1000);

                } else if (control.IsAssignToggleOn) {
                    // Onだけがアサインされているボタンのとき
                    // トグルをOnにする。
                    const changed3 = (controlSet.ToggleState !== true);
                    controlSet.ToggleState = true;
                    if (changed3)
                        controlSet.DispatchChanged();

                    Stores.ControlSets.UpdateHeader(controlSet);

                } else if (control.IsAssignToggleOff) {
                    // Offだけがアサインされているボタンのとき
                    // トグルをOffにする。
                    const changed4 = (controlSet.ToggleState !== false);
                    controlSet.ToggleState = false;
                    if (changed4)
                        controlSet.DispatchChanged();

                    Stores.ControlSets.UpdateHeader(controlSet);

                } else {
                    // ここには来ない
                    throw new Error('そんなばかなー！');
                }
            }

            return result;
        }

        /**
         * Broadlinkデバイス検出
         * ※UIからは、基本的に使わないでくれたまへ。
         */
        public async Discover(): Promise<BrDevice[]> {
            this.Log('Discover');
            const params = new Xhr.Params(
                'BrDevices/Discover',
                Xhr.MethodType.Get
            );
            const res = await Xhr.Query.Invoke(params);
            if (res.Succeeded) {
                for (let i = 0; i < res.Values.length; i++)
                    this.Merge(res.Values[i] as BrDevice);
                Dump.Log(res.Values);
                return res.Values as BrDevice[];
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }

        protected GetNewEntity(): BrDevice {
            return new BrDevice();
        }
        public Write(entity: BrDevice): void {
            throw new Error('Only Server can add BrDevices.');
        }
    }

    export const BrDevices: BrDeviceStore = BrDeviceStore.Instance;
}
