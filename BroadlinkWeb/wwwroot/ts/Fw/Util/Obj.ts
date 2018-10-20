/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Util {
    export class Obj {
        public static FormatSilializable(value: any): any {
            switch (typeof value) {
                case 'boolean':
                case 'number':
                case 'string':
                    return value;

                case 'undefined':
                case 'function':
                case 'symbol':
                    // 値がundefined, function のときは、undefined を返す。
                    // symbol型はサポート外、undefined を返す。
                    return undefined;

                case 'object':
                    if (
                        value instanceof jQuery
                        || value instanceof HTMLElement
                    ) {
                        // 値がundefined, JQueryオブジェクト, HTML要素のときは undefined を返す。
                        return undefined;
                    } else if (value === null) {
                        // 値がnull のとき、そのまま nullを返す。
                        // ※意図的にnullがセットされたものと看做す。
                        return null;
                    } else if (value instanceof Array) {
                        // 値が単純配列のとき
                        const ary = [];
                        _.each(value, (v, k: any) => {

                            // 項目名が'_'で始まるものは除外
                            if (typeof k === 'string' && k.substr(0, 1) === '_')
                                return;

                            // 整形後の値を取得
                            const tmpValue = Obj.FormatSilializable(v);

                            // 値がundefinedのとき、除外
                            if (tmpValue === undefined)
                                return;

                            ary.push(tmpValue);
                        });

                        return ary;
                    } else {
                        // 値がobjectのとき

                        const obj = {};
                        let exists = false;
                        _.each(value as any, (v, k: any) => {

                            // 項目名が'_'で始まるものは除外
                            if (typeof k === 'string' && k.substr(0, 1) === '_')
                                return;

                            // 整形後の値を取得
                            const tmpValue = Obj.FormatSilializable(v);

                            // 値がundefinedのとき、除外
                            if (tmpValue === undefined)
                                return;

                            obj[k] = tmpValue;
                            exists = true;
                        });

                        // 値が1つでもある場合は整形済みオブジェクトを、
                        // 1件も無い場合は undefined を返す。
                        return (exists)
                            ? obj
                            : undefined;
                    }
                default:
                    Fw.Util.Dump.Log('想定外の渡し値');
                    Fw.Util.Dump.Log(value);
                    throw new Error('想定外の渡し値');
            }
        }

        public static Mirror(value: any): any {
            switch (typeof value) {
                case 'boolean':
                case 'number':
                case 'string':
                case 'undefined':
                case 'function':
                case 'symbol':
                    // 配列orオブジェクト以外のとき、例外
                    throw new Error('for Array/Object only');

                case 'object':
                    if (value === null) {
                        // 値がnull のとき、例外
                        throw new Error('for Array/Object only');

                    } else if (value instanceof Array) {
                        // 値が単純配列のとき

                        const result = [];
                        _.each(value, (v) => { result.push(v); });

                        return result;
                    } else {
                        // 値がobjectのとき

                        const result = {};
                        _.each(value as any, (v, k: any) => { result[k] = v; });
                        return result;
                    }
                default:
                    Fw.Util.Dump.Log('想定外の渡し値');
                    Fw.Util.Dump.Log(value);
                    throw new Error('想定外の渡し値');
            }
        }
    }
}
