/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="./Dump.ts" />
/// <reference path="../ObjectBase.ts" />

namespace Fw.Util {
    import Dump = Fw.Util.Dump;

    export class DelayedOnceExecuter extends Fw.ObjectBase {
        public static MonitorInterval: number = 10000;
        public static DelayThreshold: number = 3000;
        public static SuppressThreshold: number = 100;

        private _delay: number;
        public get Delay(): number {
            return this._delay;
        }
        public set Delay(value: number) {
            this._delay = value;
        }

        private _timeout: number;
        public get Timeout(): number {
            return this._timeout;
        }
        public set Timeout(value: number) {
            this._timeout;
        }

        public Name: string = '';


        private _object: IObject;
        private _startTime: Date;
        private _timer: number;
        private _callback: (passing: any) => any;

        private _isActive: boolean;
        private _suppressCount: number;
        private _timeoutExecStartTime: Date;

        constructor(
            iobject: IObject,
            callback: (passing: any) => void,
            delay: number = 100,
            timeout: number = -1,
            isMonitor: boolean = false
        ) {
            super();

            this.SetClassName('DelayedOnceExecuter');
            this._object = iobject;
            this._callback = callback;
            this._delay = delay;
            this._timeout = timeout;
            this._startTime = null;
            this._timer = null;

            this._isActive = false;
            this._suppressCount = 0;
            this._timeoutExecStartTime = null;

            //this.EnableLog = true;


            if (isMonitor) {
                //this.EnableLog = true;

                setInterval(() => {
                    if (!this._isActive)
                        return;

                    if (this._startTime || this._timeoutExecStartTime) {
                        const now = new Date();
                        const elapsed = (this._timeoutExecStartTime)
                            ? now.getTime() - this._timeoutExecStartTime.getTime()
                            : now.getTime() - this._startTime.getTime();

                        if (DelayedOnceExecuter.DelayThreshold < elapsed) {
                            // Delay閾値より長い時間の間、一度も実行されていない。
                            // 無限ループの可能性がある。
                            this.EnableLog = true;
                            this._object.EnableLog = true;
                            this.Log('＊＊＊無限ループの可能性があります＊＊＊');
                            this.Log(`${this.Name}: 経過時間(msec) = ` + elapsed);
                            this.Log(`${this._object.ObjectIdentifier}`);
                        }
                    }

                    if (DelayedOnceExecuter.SuppressThreshold < this._suppressCount) {
                        // Suppress閾値より多くの回数分、実行が抑制されている。
                        // 呼び出し回数が多すぎる可能性がある。
                        this.EnableLog = true;
                        this._object.EnableLog = true;
                        this.Log('＊＊＊呼び出し回数が多すぎます＊＊＊');
                        this.Log(`${this.Name}: 抑制回数 = ` + this._suppressCount);
                        this.Log(`${this._object.ObjectIdentifier}`);
                    }
                }, DelayedOnceExecuter.MonitorInterval);
            }
        }

        public Exec(passingValues?: any): void {

            this._isActive = true;

            if (this._timer === null) {
                // これから開始するとき
                this._startTime = new Date();
                this._suppressCount = 0;
            } else {
                // 既に開始中のとき
                clearInterval(this._timer);
                this._timer = null;
                this._suppressCount++;
            }

            const now = new Date();
            const elapsed = (now.getTime() - this._startTime.getTime());

            if (0 < this._timeout && elapsed > this._timeout) {
                // タイムアウト実行が連続するときの、最初の開始時間を保持しておく。
                if (this._timeoutExecStartTime === null)
                    this._timeoutExecStartTime = this._startTime;

                this.Log(`Timeout Exec: ${this._object.ObjectIdentifier}`);
                this.InnerExec(passingValues);
            } else {
                this._timer = setTimeout(() => {
                    this._timeoutExecStartTime = null;
                    this.InnerExec(passingValues);
                }, this._delay);
            }
        }

        private InnerExec(passingValues?: any): void {
            //this.Log(`InnerExec: ${this._object.ObjectIdentifier}: suppressed[${this._suppressCount}]`);
            try {
                this._callback(passingValues);
            } catch (e) {
                this.Log(`Callback FAILED!!: ${this._object.ObjectIdentifier}`);
                Dump.ErrorLog(e);
            }

            if (this._timer) {
                clearInterval(this._timer);
                this._timer = null;
            }

            this._startTime = null;
            this._suppressCount = 0;
            this._isActive = false;
        }
    }
}
