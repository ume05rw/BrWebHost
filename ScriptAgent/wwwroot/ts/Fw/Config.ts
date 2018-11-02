/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="Util/Dump.ts" />
/* /// <reference path="Views/Root.ts" /> */

namespace Fw {
    import Dump = Fw.Util.Dump;

    export class Config {
        /**
         * @description Xhrクエリ時の基礎URL
         */
        public static XhrBaseUrl: string
            = location.protocol
            + '//' + location.hostname
            + ':' + location.port
            + '/';

        /**
         * @description ページ用div.attr識別子
         */
        public static PageIdAttribute: string = 'data-pageid';

        /**
         * @description 起動ページdiv.attr識別子
         * @see <div data-default="true"></div>
         */
        public static DefaultPageAttribute: string = 'data-default';
    }
}