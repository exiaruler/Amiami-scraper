import Projects from '../../pages/projects/projects';
import ProjectRecord from '../../pages/projects/projectRecord';
import Error from '../../pages/error';
import Home from '../../pages/home';
import Navbar from '.././navbar';
import LinkedIn from '../../assets/LI-In-Bug.png';
import GitHub from '../../assets/github-mark.png';
import Form from '../../pages/formGen/form';
import Util from '../../base/Util';
import Login from '../../pages/user/login';
import testBed from '../../pages/user/dev/testBed';
import EntryRecord from '../../pages/formGen/entryrecord';
import { ProjectStaistics } from '../../pages/projects/projectStatistics';
// guard
import GuardAuthorise from '.././GuardAuthorise';
import GuardWrapper from '.././GuardWrapper';
import GuardWrapperForm from '.././formGenComponents/GuardWrapperForm';
import TestBed from '../../pages/user/dev/testBed';
export default class navigation extends Util{
    // navbar/layout
    layout=Navbar;
    private settingId="";
    // external url outside website
    public externalLinks=[
        {
        "url":"https://www.linkedin.com/in/samuel-li-34ba34169/",
        "alt":"linkedIn",
        "image":LinkedIn,
        "status":true,
        "width":30,
        "height":25
        },
        {"url":"https://github.com/exiaruler",
        "alt":"GitHub",
        "image":GitHub,
        "status":true,
        "width":30,
        "height":28
        }
    ].filter((link)=>link.status===true);
    // pages file library
    public pages=[
        {
            path:"*",
            page:Error
        },
        {
            path:"/",
            page:Home
        },
        {
            path:"/projects",
            page:Projects
        },
        {
            path:"/project/:id",
            page:ProjectRecord
        },
        {
            path:"/project/view-statistics/:id",
            page:ProjectStaistics
        },
        {
            path:"/form/:formId/:id",
            page:Form
        },
        {
            path:"/login",
            page:Login
        },
        {
            path:"/testbed",
            page:TestBed
        },
        {
            path:"/entry/:id",
            page:EntryRecord
        }
    ];
    public guards=[
        {
            // standard
            guard:"guardwrapper",
            component:GuardWrapper
        },
        {
            // login
            guard:"guardauthorise",
            component:GuardAuthorise
        },
        {
            // used for form routes
            guard:"guardwrapperform",
            component:GuardWrapperForm
        },
    ]
    public findPage(path:string){
        let page=null;
        if(this.pages.find((pa)=>pa.path===path)!==undefined){
            page=this.pages.find((pa)=>pa.path===path)?.page;
        }
        return page;
    }
    public findGuard(guard:string){
        let comp=null;
        if(this.guards.find((gu)=>gu.guard===guard)!==undefined){
            comp=this.guards.find((gu)=>gu.guard===guard)?.component;
        }
        return comp;
    }
    // new design
    public userAccessDropdown=[
        {
            name:"Tools",
            enable:true,
            menus:[
                {
                    "component":testBed,
                    "guard":null,
                    "module":"user",
                    "url":"/testbed",
                    "name":"Test",
                    "path":"/testbed",
                    "enable":true,
                    "index":false,
                    "show":this.checkEnv()
                },
                {
                    "component":ProjectRecord,
                    "module":"project",
                    "url":"/project/:id",
                    "name":"Projects Record",
                    "path":"/project/:id",
                    "enable":true,
                    "index":false,
                    "show":false,
                    "guard":{
                        "component":GuardWrapper,
                        "api":this.getApiUrl()+"/project/get-project/",
                        "config":this.apiCallConfig("GET")
                    }
                },
            ].filter((route)=>route.enable===true)
        }
    ];
    // pages access by logged in users
    public protectedRoutes=[
        {
            "component":testBed,
            "module":"user",
            "url":"/testbed",
            "name":"Test",
            "path":"/testbed",
            "enable":this.checkEnv(),
            "index":false,
            "show":this.checkEnv()
        }
    ].filter((route)=>route.enable===true);
    // pages access for login
    public accessRoutes=[
        {
            "component":Login,
            "guard":GuardAuthorise,
            "module":"user",
            "url":"/login",
            "name":"Login",
            "path":"login",
            "enable":true,
            "index":false,
            "show":false
        }
    ].filter((route)=>route.enable===true);

    header={
        "apikey":this.getApiKey()
    };
    // validate through GuardWrapper
    public routesParam=[
        {
        "component":ProjectRecord,
        "module":"project",
        "url":"/project/:id",
        "name":"Projects Record",
        "path":"/project/:id",
        "enable":true,
        "index":false,
        "show":false,
        "guard":{
            "api":"/project/get-project/",
            "auth":false,
            "config":{
                headers:this.header}
        }
        },
        {
            "component":EntryRecord,
            "module":"formgen",
            "url":"/entry/:id",
            "name":"entry",
            "path":"/entry/:id",
            "enable":true,
            "index":false,
            "show":false,
            "guard":{
                "api":"/entry/get-entry/",
                "auth":false,
                "config":{
                    headers:this.header}
            }
        },
        {
            "component":ProjectStaistics,
            "module":"project",
            "url":"/project/view-statistics/:id",
            "name":"Project Statistics",
            "path":"/project/view-statistics/:id",
            "enable":true,
            "index":false,
            "show":true,
            "guard":{
                "api":"/project/get-project-stats/",
                "auth":false,
                "config":{
                    headers:this.header}
            }
        }
    ];
    
    public formRoute=[
        {
        "component":Form,
        "module":"formgen",
        "url":"/form/:formId/:id",
        "name":"Form Record",
        "path":"/form/:formId/:id",
        "enable":true,
        "index":false,
        "show":false,
        "guard":{
            "api":this.getApiUrl()+"/form/get-form/",
            "config":{headers:this.header,credentials: 'include'}
        }
        }
    ].filter((route)=>route.enable===true);
    // users ONLY
    public formLinks=[
        {
            "component":Form,
            "module":"formgen",
            "url":"/form/project/0",
            "name":"Add Project",
            "path":"/form/project/0",
            "enable":true,
            "index":false,
            "show":true,
            "guard":{
                "api":this.getApiUrl()+"/form/get-form/",
                "config":{headers:this.header,credentials: 'include'}
            }
        },
        {
            "component":Form,
            "module":"formgen",
            "url":"/form/setting/0",
            "name":"Settings",
            "path":"/form/setting/0",
            "enable":true,
            "index":false,
            "show":true,
            "guard":{
                "api":this.getApiUrl()+"/form/get-form/",
                "config":{headers:this.header,credentials: 'include'}
            }
        },
        {
            "component":EntryRecord,
            "module":"formgen",
            "url":"/entry/project",
            "name":"Project Entry",
            "path":"/entry/project",
            "enable":true,
            "index":false,
            "show":true,
            "guard":{
                "api":"/entry/get-entry/",
                "config":{
                    headers:this.header}
            }
        }
    ].filter((route)=>route.enable===true);
    // public routes
    public routes=[
        {"component":Home,
        "module":"nec",
        "url":"",
        "name":"Home",
        "path":"",
        "index":true,
        "enable":false,
        "show":true,
        },
        {"component":Projects,
        "module":"project",
        "url":"/projects",
        "name":"Projects",
        "path":"/projects",
        "enable":true,
        "index":false,
        "show":true},
        {"component":Error,
        "module":"nec",
        "url":"",
        "name":"",
        "path":"*",
        "enable":true,
        "index":false,
        "show":false
        },
    ]
    // error page
    error=Error;
    
} 