import UserAPI from "../api/UserAPI";
// common methods for application
export class Common{
    //public user=new UserAPI();
    public removeLogCookie(){
        let currentDate = new Date();
        let timeout=currentDate.setMilliseconds(currentDate.getMilliseconds() - 10000);
        document.cookie="id= ; expires="+timeout;
      }
      /*
      public checkLogCookie(){
        var login=false;
        const cookie=document.cookie;
        const cookieArr=cookie.split(";");
          if(cookieArr[0].includes("id=")){
            var id=cookieArr[0].split("=")[1];
            if(id!=""){
              
              login=true;
            }
          }
        return login
      }
        */
}