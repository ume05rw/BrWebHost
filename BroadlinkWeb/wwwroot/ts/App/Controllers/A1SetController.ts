/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../../lib/chartjs/index.d.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../Models/Entities/ControlSet.ts" />
/// <reference path="../Models/Stores/A1Store.ts" />
/// <reference path="../Items/Color.ts" />
/// <reference path="../Items/OperationType.ts" />
/// <reference path="../Items/ChartType.ts" />
/// <reference path="../Views/Controls/ButtonView.ts" />
/// <reference path="ControlSetController.ts" />
/// <reference path="../../Fw/Events/EntityEvents.ts" />
/// <reference path="../Views/Controls/ButtonView.ts" />
/// <reference path="../Items/Lang/Lang.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Controls = App.Views.Controls;
    import Entities = App.Models.Entities;
    import Stores = App.Models.Stores;
    import Util = Fw.Util;
    import OperationType = App.Items.OperationType;
    import EntityEvents = Fw.Events.EntityEvents;
    import Color = App.Items.Color;
    import ChartType = App.Items.ChartType;
    import Lang = App.Items.Lang.Lang;

    export class A1SetController extends ControlSetController {

        private _btnChartChange: Controls.PropertyButtonView;
        private _canvasDiv: Fw.Views.HtmlView;
        private _chart: Chart;
        private _chartType: ChartType;

        constructor() {
            super('A1Set');

            this.SetClassName('A1SetController');

            this._canvasDiv = new Fw.Views.HtmlView('div');
            this._btnChartChange = new Controls.PropertyButtonView();
            this._chart = null;
            this._chartType = ChartType.Hourly;

            this._canvasDiv.SetAnchor(280, 5, null, null);
            this._canvasDiv.SetSize(250, 230);
            this._canvasDiv.HasBorder = true;
            this._canvasDiv.Color = Color.ButtonColors[0];
            this._canvasDiv.BorderRadius = 5;
            this._canvasDiv.InnerHtml = '<canvas id="a1chart" witdh="250" height="260"></canvas>';
            this._page.ButtonPanel.Add(this._canvasDiv);

            this._btnChartChange.SetAnchor(520, 5, null, null);
            this._btnChartChange.SetSize(250, 30);
            this._btnChartChange.Text = Lang.ToDaily;
            this._page.ButtonPanel.Add(this._btnChartChange);

            this._btnChartChange.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, () => {
                if (this._chartType === ChartType.Hourly) {
                    this._chartType = ChartType.Daily;
                    this._btnChartChange.Text = Lang.ToHourly;
                    this.SetChart();
                } else if (this._chartType === ChartType.Daily) {
                    this._chartType = ChartType.Hourly;
                    this._btnChartChange.Text = Lang.ToDaily;
                    this.SetChart();
                } else {
                    // グラフタイプが追加された？
                    alert('Not Implements!');
                    throw new Error('Not Implements!');
                }
            });
        }

        public SetEntity(entity: Entities.ControlSet): void {
            // View側削除処理、ButtonPanel.Childrenを削除操作するため、要素退避しておく。
            const buttons = Util.Obj.Mirror(this._page.ButtonPanel.Children);
            _.each(buttons, (btn: Fw.Views.IView) => {
                // Canvasを削除させないようにする。
                if (btn instanceof Controls.ControlButtonView) {
                    this._page.ButtonPanel.Remove(btn);
                    btn.Dispose();
                }
            });
            this._page.ButtonPanel.InnerLength = this._page.ButtonPanel.Size.Height;


            if (this._controlSet) {
                this._controlSet.RemoveEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);
            }

            this._controlSet = entity;

            if (!this._controlSet)
                return


            this._controlSet.AddEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);

            _.each(this._controlSet.Controls, (control) => {
                const btn = new Controls.ControlButtonView();
                btn.Control = control;
                btn.SetLeftTop(control.PositionLeft, control.PositionTop);
                btn.SetColor(control.Color);
                btn.SetImage(control.IconUrl);

                this._page.ButtonPanel.Add(btn);
            });

            this.SetChart();

            // ひとまず現在保持中のcontrol値を表示
            this.ApplyFromEntity();

            // 現在の値を取得して表示更新
            Stores.A1s.Get(this._controlSet).then(() => {
                this.ApplyFromEntity();
            });
        }

        private async SetChart(): Promise<boolean> {
            if (this._chart)
                this._chart.destroy();

            let values: Array<Entities.A1Values>;
            switch (this._chartType) {
                case ChartType.Hourly:
                    values = await Stores.A1s.GetHourly(this._controlSet);
                    break;
                case ChartType.Daily:
                    values = await Stores.A1s.GetDaily(this._controlSet);
                    break;
                default:
                    // グラフタイプが追加された？
                    alert('Not Implements!');
                    throw new Error('Not Implements!');
            }

            const labels = new Array<string>();
            const temperatures = new Array<number>();
            const humidities = new Array<number>();
            const vocs = new Array<number>();
            const lights = new Array<number>();
            const noises = new Array<number>();

            _.each(values, (val: Entities.A1Values) => {
                switch (this._chartType) {
                    case ChartType.Hourly:
                        const hour = (val.RecordedDate)
                            ? val.RecordedDate.getHours()
                            : 0;
                        //labels.push(((hour % 4) === 0) ? hour.toString() : '');
                        labels.push(hour.toString());
                        break;
                    case ChartType.Daily:
                        const day = (val.RecordedDate)
                            ? val.RecordedDate.getDate()
                            : 0;
                        //labels.push(((day % 4) === 0) ? day.toString() : '');
                        labels.push(day.toString());
                        break;
                    default:
                        // グラフタイプが追加された？
                        alert('Not Implements!');
                        throw new Error('Not Implements!');
                }

                temperatures.push(val.Temperature);
                humidities.push(val.Humidity);
                vocs.push(3 - val.Voc);
                lights.push(val.Light);
                noises.push(val.Noise);
            });


            const canvas = this._canvasDiv.Elem.find('#a1chart')[0] as HTMLCanvasElement;
            this._chart = new Chart(canvas, {
                type: 'line',

                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: Lang.Temp,
                            data: temperatures,
                            fill: true,
                            backgroundColor: Color.GetRgba(Color.ButtonHoverColors[5], 0.7),
                            borderColor: Color.GetRgba(Color.ButtonColors[5], 0.7),
                            borderWidth: 2
                        },
                        {
                            label: Lang.Hudimity,
                            data: humidities,
                            fill: true,
                            backgroundColor: Color.GetRgba(Color.ButtonHoverColors[1], 0.7),
                            borderColor: Color.GetRgba(Color.ButtonColors[1], 0.7),
                            borderWidth: 2
                        },
                        {
                            label: Lang.Voc,
                            data: vocs,
                            fill: true,
                            backgroundColor: Color.GetRgba(Color.ButtonHoverColors[2], 0.7),
                            borderColor: Color.GetRgba(Color.ButtonColors[2], 0.7),
                            borderWidth: 2
                        },
                        {
                            label: Lang.Brightness,
                            data: lights,
                            fill: true,
                            backgroundColor: Color.GetRgba(Color.ButtonHoverColors[4], 0.7),
                            borderColor: Color.GetRgba(Color.ButtonColors[4], 0.7),
                            borderWidth: 2
                        },
                        {
                            label: Lang.Noise,
                            data: noises,
                            fill: true,
                            backgroundColor: Color.GetRgba(Color.ButtonHoverColors[7], 0.7),
                            borderColor: Color.GetRgba(Color.ButtonColors[7], 0.7),
                            borderWidth: 2
                        },
                    ]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

            this._canvasDiv.Refresh();

            return true;
        }

        protected async OnButtonClicked(e: Fw.Events.EventObject) {
            return;
        }

        protected ApplyFromEntity(): void {
            if (!this._controlSet)
                return;

            this._page.HeaderBar.Text = this._controlSet.Name;
            this._page.HeaderLeftLabel.Text = this._controlSet.Name;
            this._page.Refresh();

            _.each(this._page.ButtonPanel.Children, (view) => {

                if (view instanceof Controls.ControlButtonView) {
                    const btn = view as Controls.ControlButtonView;
                    const control = btn.Control;

                    if (btn.Color !== control.Color)
                        btn.SetColor(control.Color);

                    if (btn.ImageSrc !== control.IconUrl)
                        btn.SetImage(control.IconUrl);

                    if (this._controlSet.OperationType === OperationType.BroadlinkDevice
                        && (control.Value)
                        && control.Value !== ''
                    ) {
                        // センサ値をボタンに表示する。
                        btn.HoverEnable = false;
                        btn.BackgroundColor = '#FFFFFF';

                        switch (control.Code) {
                            case 'Temp':
                                btn.Name = Lang.Temp + '<br/>' + control.Value;
                                break;
                            case 'Humidity':
                                btn.Name = Lang.Hudimity + '<br/>' + control.Value;
                                break;
                            case 'Voc':
                                btn.Name = Lang.Voc + '<br/>' + control.Value;
                                break;
                            case 'Light':
                                btn.Name = Lang.Brightness + '<br/>' + control.Value;
                                break;
                            case 'Noise':
                                btn.Name = Lang.Noise + '<br/>' + control.Value;
                                break;
                            default:
                                break;
                        }
                    }
                }
            });
        }

    }
}
