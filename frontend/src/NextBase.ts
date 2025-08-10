import Util from "./base/Util";

export class NextBase extends Util{
    // override encrypt key in next.js
    encryptKey=process.env.NEXT_PUBLIC_API_ENCRYPTKEY||'';
    // application URL
    baseURL="http://localhost:3000";

}