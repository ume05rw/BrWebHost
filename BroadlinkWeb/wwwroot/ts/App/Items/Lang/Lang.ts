/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="Ja.ts" />
/// <reference path="En.ts" />
/// <reference path="ZhCn.ts" />

namespace App.Items.Lang {
    export const Lang = {
        Title: 'BrWebHost',

        Property: 'Property',

        RemoteControl: 'Remote Control',
        Name: 'Name',
        Color: 'Color',
        Controller: 'Controller',
        Delete: '*Delete*',
        Icon: 'Icon',
        Code: 'Code',
        IconColor: 'Icon / Color',
        Learn: 'Learn',
        Test: 'Test',
        Scene: 'Scene',
        Operation: 'Operation',
        TimerEnable: 'Timer Enable',
        Enable: 'Enable',
        StartTime: 'Start Time',

        WeekdayAction: 'Weekday Action',

        Sunday: 'Sunday',
        Monday: 'Monday',
        Tuesday: 'Tuesday',
        Wednesday: 'Wednesday',
        Thursday: 'Thursday',
        Friday: 'Friday',
        Saturday: 'Saturday',

        SelectRemote: 'Select<br/>Remote',
        SelectButton: 'Select<br/>Button',

        Wait: 'Wait:',
        Sec: 'Sec',

        Excellent: 'Excellent',
        Good: 'Good',
        Normal: 'Normal',
        Bad: 'Bad',
        Unknown: 'Unknown',
        Dark: 'Dark',
        Dim: 'Dim',
        Bright: 'Bright',
        Quiet: 'Quiet',
        Noisy: 'Noisy',

        NewRemoteControl: 'New Remote Control',
        NewScene: 'New Scene',
        NewTimer: 'New Timer',
        ToggleAssigns: 'Toggle Assigns',
        MainPanelToggleOn: 'Main-Panel Toggle ON',
        MainPanelToggleOff: 'Main-Panel Toggle OFF',
        SelectColor: 'Select Color',

        ToDaily: 'To Daily',
        ToHourly: 'To Hourly',
        Temp: 'Temp.',
        Hudimity: 'Hudimity',
        Voc: 'Voc',
        Light: 'Light',
        Brightness: 'Brightness',
        Noise: 'Noise',

        MacAddress: 'MAC Address',
        Script: 'Script',
        RemoteScript: 'Remote Script',

        SelectIcon: 'Select Icon',
        SelectRemoteControl: 'Select Remote Control',
        SelectNewOperation: 'Select New Operation',

        Tv: 'TV',
        Av: 'AV',
        Free: 'Free',
        Wol: 'WoL',
        Remote: 'Remote',
        Timer: 'Timer',

        ThisRemoteControlWillBeRemoved: 'This Remote Control will be REMOVED.<br/>Are you ok?',
        ThisButtonWillBeRemoved: 'This Button will be removed.<br/>Are you ok?',
        ThisSceneWillBeRemoved: 'This Scene will be REMOVED.<br/>Are you ok?',
        ThisTimerWillBeRemoved: 'This Timer will be REMOVED.<br/>Are you ok?',
        NoButtonsSaveOk: 'No buttons.<br/>Save OK?',
        NoOperationsSaveOk: 'No operations.<br/>Save OK?',
        SaveFailureServerOnline: 'Ouch! Save Failure.<br/>Server online?',
        SelectYourRmDevice: 'Select your Rm-Device.<br />Click Header.',
        SetRemoteControlHead: 'Set Remote Control head to Rm,<br/> and Push target Button.',
        ClickHeader: 'Click Header.',
        GoEdit: 'Go Edit.',
        SelectYourRmDevicePart: 'Select your Rm-Device,<br/>',
        ClickLearnButton: 'Click Learn-Button.',
        LearnYourRemoteControlButtonPart: 'Learn your Remote Control Button.<br/>',
        UnexpectedOperation: 'Unexpected Operation...?',
        SetMacAddressGoEdit: 'Set MAC-Address,<br/>Go Edit.',
        WriteScriptGoEdit: 'Write Script,<br/>Go Edit.',
        SelectRemoteScriptGoEdit: 'Select Remote Script,<br/>Go Edit.',
        UnexpectedControlNotFound: 'Unexpected...Control not Found.',
    };

    export function InitLang(): void {
        let lang: string = (window.navigator.languages && window.navigator.languages[0])
            || window.navigator.language
            || (window.navigator as any).userLanguage
            || (window.navigator as any).browserLanguage;

        // 言語取得できないとき、デフォルト
        if (!lang)
            return;

        const langFull = lang.toLowerCase();
        const langCode = langFull.substr(0, 2);
        switch (langCode) {
            case 'ja':
                // 日本語
                _.extend(Lang, Ja);
                break;
            case 'zh':
                // 中国語
                if (langFull === 'zh-cn') {
                    // 大陸
                    _.extend(Lang, ZhCn);
                }
                break;
            default:
                _.extend(Lang, En);
                break;
        }
    }
}
