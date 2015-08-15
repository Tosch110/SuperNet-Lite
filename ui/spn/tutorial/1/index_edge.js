/**
 * Adobe Edge: symbol definitions
 */
(function($, Edge, compId){
//images folder
var im='images/';

var fonts = {};
var opts = {
    'gAudioPreloadPreference': 'auto',

    'gVideoPreloadPreference': 'auto'
};
var resources = [
];
var symbols = {
"stage": {
    version: "4.0.0",
    minimumCompatibleVersion: "4.0.0",
    build: "4.0.0.359",
    baseState: "Base State",
    scaleToFit: "none",
    centerStage: "none",
    initialState: "Base State",
    gpuAccelerate: false,
    resizeInstances: false,
    content: {
            dom: [
            {
                id: 'scene4_BG',
                type: 'image',
                rect: ['-2289px', '-221px','5130px','810px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene4_BG.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene2_base2',
                type: 'image',
                rect: ['-2290px', '-1275px','5130px','2950px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene2_base2.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'sN_logo',
                type: 'image',
                rect: ['-765px', '-655px','2080px','1710px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"sN_logo.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'tut_n1',
                type: 'image',
                rect: ['-180px', '251px','910px','100px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"tut_n1.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene2_coinbalances',
                type: 'image',
                rect: ['-1990px', '-299px','4520px','1090px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene2_coinbalances.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene2_coinnames',
                type: 'image',
                rect: ['-1738px', '-289px','3960px','990px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene2_coinnames.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene2_coinnames_O',
                type: 'image',
                rect: ['-1738px', '-289px','3960px','990px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene2_coinnames_O.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene2_coinwallets',
                type: 'image',
                rect: ['-1927px', '-300px','4380px','1040px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene2_coinwallets.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene2_coinbalances_O',
                type: 'image',
                rect: ['-1990px', '-299px','4520px','1090px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene2_coinbalances_O.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene2_coinwallets_O',
                type: 'image',
                rect: ['-1927px', '-300px','4380px','1040px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene2_coinwallets_O.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene3_bbox_BG2',
                type: 'image',
                rect: ['-1159px', '-1169px','2860px','2720px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene3_bbox_BG2.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene3_bbox_MENU_bg2',
                type: 'image',
                rect: ['-1158px', '3px','2860px','720px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene3_bbox_MENU_bg2.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene3_bbox_coinname22',
                type: 'image',
                rect: ['-94px', '-26px','530px','210px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene3_bbox_coinname22.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene3_bbox_coinADDRESS2',
                type: 'image',
                rect: ['-710px', '-72px','1900px','390px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene3_bbox_coinADDRESS2.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene3_bbox_coinBALANCE2',
                type: 'image',
                rect: ['-902px', '-16px','2330px','430px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene3_bbox_coinBALANCE2.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene3_bbox_MENU_byMAIL2',
                type: 'image',
                rect: ['121px', '103px','520px','520px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene3_bbox_MENU_byMAIL2.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene3_bbox_MENU_coinOPS2',
                type: 'image',
                rect: ['4px', '103px','520px','520px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene3_bbox_MENU_coinOPS2.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene3_bbox_MENU_fiatOPS2',
                type: 'image',
                rect: ['62px', '103px','520px','520px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene3_bbox_MENU_fiatOPS2.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene3_bbox_MENU_coinicon2',
                type: 'image',
                rect: ['-326px', '3px','1010px','720px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene3_bbox_MENU_coinicon2.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'Rectangle',
                type: 'rect',
                rect: ['0px', '327px','550px','73px','auto', 'auto'],
                fill: ["rgba(255,255,255,1.00)"],
                stroke: [0,"rgba(0,0,0,1)","none"]
            },
            {
                id: 'hamburger_icon',
                type: 'image',
                rect: ['382px', '26px','200px','140px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"hamburgerA.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'hamburger_iconCopy',
                type: 'image',
                rect: ['382px', '26px','200px','140px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"hamburgerA.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene4_bgACTIVE',
                type: 'image',
                rect: ['-454px', '-248px','860px','870px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene4_bgACTIVE.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene4_icon_BASIC',
                type: 'image',
                rect: ['-159px', '-173px','440px','560px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene4_icon_BASIC.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene4_icon_ADVANCED',
                type: 'image',
                rect: ['-133px', '-173px','560px','560px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene4_icon_ADVANCED.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene4_icon_COMMUNITY',
                type: 'image',
                rect: ['99px', '-172px','610px','560px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene4_icon_COMMUNITY.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene4_icon_HELP',
                type: 'image',
                rect: ['271px', '-173px','440px','560px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene4_icon_HELP.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene4_icon_PROJECTS',
                type: 'image',
                rect: ['-2px', '-173px','470px','560px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene4_icon_PROJECTS.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'scene4_icon_SERVICES',
                type: 'image',
                rect: ['83px', '-172px','470px','560px','auto', 'auto'],
                fill: ["rgba(0,0,0,0)",im+"scene4_icon_SERVICES.svg",'0px','0px'],
                transform: [[],[],[],['0.1','0.1']]
            },
            {
                id: 'audio_track',
                type: 'audio',
                tag: 'audio',
                rect: ['491', '143','320px','45px','auto', 'auto'],
                source: ['audio/audio_track.mp3'],
                preload: 'auto'
            }],
            symbolInstances: [

            ]
        },
    states: {
        "Base State": {
            "${_scene3_bbox_coinADDRESS2}": [
                ["style", "top", '-72px'],
                ["style", "opacity", '0.000000'],
                ["style", "left", '-710px']
            ],
            "${_scene3_bbox_MENU_bg2}": [
                ["style", "top", '3px'],
                ["style", "opacity", '0'],
                ["style", "left", '-1158px']
            ],
            "${_scene2_coinwallets}": [
                ["style", "top", '-300px'],
                ["style", "opacity", '0.000000'],
                ["style", "left", '-1927px']
            ],
            "${_scene4_BG}": [
                ["style", "top", '-221px'],
                ["style", "opacity", '0.000000'],
                ["style", "left", '-2289px']
            ],
            "${_scene3_bbox_coinname22}": [
                ["style", "top", '-26px'],
                ["style", "opacity", '0.000000'],
                ["style", "left", '-94px']
            ],
            "${_scene2_coinbalances}": [
                ["style", "top", '-299px'],
                ["style", "opacity", '0.000000'],
                ["style", "left", '-1990px']
            ],
            "${_scene4_icon_BASIC}": [
                ["style", "top", '-173px'],
                ["style", "opacity", '0'],
                ["style", "left", '-159px']
            ],
            "${_scene2_coinnames_O}": [
                ["style", "top", '-289px'],
                ["style", "opacity", '0.000000'],
                ["style", "left", '-1738px']
            ],
            "${_scene3_bbox_MENU_byMAIL2}": [
                ["style", "top", '104px'],
                ["style", "opacity", '0'],
                ["style", "left", '120px']
            ],
            "${_scene3_bbox_BG2}": [
                ["style", "top", '-1169px'],
                ["style", "opacity", '0.000000'],
                ["style", "left", '-1159px']
            ],
            "${_scene3_bbox_MENU_coinOPS2}": [
                ["style", "top", '102px'],
                ["style", "opacity", '0'],
                ["style", "left", '4px']
            ],
            "${_hamburger_icon}": [
                ["style", "top", '26px'],
                ["style", "opacity", '0.000000'],
                ["style", "left", '382px']
            ],
            "${_scene2_coinwallets_O}": [
                ["style", "top", '-300px'],
                ["style", "opacity", '0'],
                ["style", "left", '-1927px']
            ],
            "${_Rectangle}": [
                ["color", "background-color", 'rgba(255,255,255,1.00)'],
                ["style", "height", '73px'],
                ["style", "top", '327px'],
                ["style", "left", '0px'],
                ["style", "width", '550px']
            ],
            "${_scene4_icon_HELP}": [
                ["style", "top", '-173px'],
                ["style", "opacity", '0'],
                ["style", "left", '271px']
            ],
            "${_scene3_bbox_MENU_coinicon2}": [
                ["style", "top", '3px'],
                ["style", "opacity", '0'],
                ["style", "left", '-326px']
            ],
            "${_scene4_bgACTIVE}": [
                ["style", "top", '-248px'],
                ["style", "opacity", '0.000000'],
                ["style", "left", '-479px']
            ],
            "${_scene4_icon_SERVICES}": [
                ["style", "top", '-173px'],
                ["style", "opacity", '0'],
                ["style", "left", '83px']
            ],
            "${_scene4_icon_ADVANCED}": [
                ["style", "top", '-173px'],
                ["style", "opacity", '0'],
                ["style", "left", '-134px']
            ],
            "${_tut_n1}": [
                ["style", "top", '227px'],
                ["style", "opacity", '0.000000'],
                ["style", "left", '-180px']
            ],
            "${_scene4_icon_PROJECTS}": [
                ["style", "top", '-173px'],
                ["style", "opacity", '0'],
                ["style", "left", '-5px']
            ],
            "${_scene3_bbox_coinname2}": [
                ["style", "left", '253px'],
                ["style", "top", '161px']
            ],
            "${_hamburger_iconCopy}": [
                ["style", "top", '115px'],
                ["transform", "scaleY", '0'],
                ["transform", "scaleX", '0.5'],
                ["style", "opacity", '0.000000'],
                ["style", "left", '171px']
            ],
            "${_scene3_bbox_MENU_fiatOPS2}": [
                ["style", "top", '103px'],
                ["style", "opacity", '0'],
                ["style", "left", '62px']
            ],
            "${_scene4_icon_COMMUNITY}": [
                ["style", "top", '-173px'],
                ["style", "opacity", '0'],
                ["style", "left", '99px']
            ],
            "${_STAGE_bg22}": [
                ["style", "left", '-752px'],
                ["style", "top", '-501px']
            ],
            "${_scene3_bbox_coinBALANCE2}": [
                ["style", "top", '-16px'],
                ["style", "opacity", '0.000000'],
                ["style", "left", '-902px']
            ],
            "${_scene2_base2}": [
                ["style", "top", '-1275px'],
                ["style", "opacity", '0'],
                ["style", "left", '-2290px']
            ],
            "${_Stage}": [
                ["color", "background-color", 'rgba(255,255,255,1)'],
                ["style", "width", '550px'],
                ["style", "height", '400px'],
                ["style", "overflow", 'hidden']
            ],
            "${_scene2_coinbalances_O}": [
                ["style", "top", '-299px'],
                ["style", "opacity", '0.000000'],
                ["style", "left", '-1990px']
            ],
            "${_sN_logo}": [
                ["style", "top", '-681px'],
                ["style", "opacity", '0.000000'],
                ["style", "left", '-765px']
            ],
            "${_scene2_coinnames}": [
                ["style", "top", '-289px'],
                ["subproperty", "filter.hue-rotate", '100deg'],
                ["style", "opacity", '0.000000'],
                ["style", "left", '-1738px'],
                ["subproperty", "filter.sepia", '0.94520547945205']
            ]
        }
    },
    timelines: {
        "Default Timeline": {
            fromState: "Base State",
            toState: "",
            duration: 207000,
            autoPlay: true,
            timeline: [
                { id: "eid201", tween: [ "style", "${_scene3_bbox_MENU_byMAIL2}", "opacity", '0.5', { fromValue: '0'}], position: 53000, duration: 3750, easing: "easeOutCubic" },
                { id: "eid238", tween: [ "style", "${_scene3_bbox_MENU_byMAIL2}", "opacity", '1', { fromValue: '0.5'}], position: 108510, duration: 750 },
                { id: "eid260", tween: [ "style", "${_scene3_bbox_MENU_byMAIL2}", "opacity", '0', { fromValue: '1'}], position: 117000, duration: 1500 },
                { id: "eid174", tween: [ "style", "${_scene3_bbox_MENU_coinicon2}", "top", '-69px', { fromValue: '3px'}], position: 60935, duration: 750, easing: "easeOutCubic" },
                { id: "eid204", tween: [ "style", "${_scene3_bbox_MENU_byMAIL2}", "top", '103px', { fromValue: '104px'}], position: 53000, duration: 4000, easing: "easeOutCubic" },
                { id: "eid170", tween: [ "style", "${_scene3_bbox_MENU_byMAIL2}", "top", '31px', { fromValue: '103px'}], position: 60935, duration: 750, easing: "easeOutCubic" },
                { id: "eid307", tween: [ "style", "${_hamburger_iconCopy}", "opacity", '1', { fromValue: '0.000000'}], position: 119000, duration: 80, easing: "easeOutBounce" },
                { id: "eid327", tween: [ "style", "${_hamburger_iconCopy}", "opacity", '0', { fromValue: '1'}], position: 122455, duration: 45 },
                { id: "eid173", tween: [ "style", "${_scene3_bbox_MENU_coinicon2}", "left", '-327px', { fromValue: '-326px'}], position: 60935, duration: 750, easing: "easeOutCubic" },
                { id: "eid404", tween: [ "style", "${_scene4_icon_SERVICES}", "opacity", '1', { fromValue: '0'}], position: 123802, duration: 37, easing: "easeOutBounce" },
                { id: "eid500", tween: [ "style", "${_scene4_icon_SERVICES}", "opacity", '0', { fromValue: '1'}], position: 193872, duration: 1500, easing: "swing" },
                { id: "eid299", tween: [ "style", "${_scene2_base2}", "opacity", '1', { fromValue: '0'}], position: 11000, duration: 1000 },
                { id: "eid302", tween: [ "style", "${_scene2_base2}", "opacity", '0', { fromValue: '1'}], position: 53000, duration: 1000 },
                { id: "eid384", tween: [ "style", "${_scene4_icon_ADVANCED}", "opacity", '1', { fromValue: '0'}], position: 123302, duration: 37, easing: "easeOutBounce" },
                { id: "eid494", tween: [ "style", "${_scene4_icon_ADVANCED}", "opacity", '0', { fromValue: '1'}], position: 193872, duration: 1500, easing: "swing" },
                { id: "eid40", tween: [ "style", "${_hamburger_icon}", "opacity", '1', { fromValue: '0.000000'}], position: 11000, duration: 1000 },
                { id: "eid158", tween: [ "style", "${_hamburger_icon}", "opacity", '0', { fromValue: '1'}], position: 53000, duration: 1000 },
                { id: "eid405", tween: [ "style", "${_scene4_icon_COMMUNITY}", "top", '-99px', { fromValue: '-173px'}], position: 124089, duration: 1500, easing: "easeOutBounce" },
                { id: "eid9", tween: [ "style", "${_sN_logo}", "opacity", '1', { fromValue: '0.000000'}], position: 1000, duration: 1000 },
                { id: "eid14", tween: [ "style", "${_sN_logo}", "opacity", '1', { fromValue: '1'}], position: 3000, duration: 0 },
                { id: "eid20", tween: [ "style", "${_sN_logo}", "opacity", '0', { fromValue: '1'}], position: 9000, duration: 1000 },
                { id: "eid504", tween: [ "style", "${_sN_logo}", "opacity", '1', { fromValue: '0'}], position: 196000, duration: 1551 },
                { id: "eid507", tween: [ "style", "${_sN_logo}", "opacity", '0', { fromValue: '1'}], position: 205000, duration: 2000 },
                { id: "eid177", tween: [ "style", "${_scene3_bbox_MENU_bg2}", "left", '-1159px', { fromValue: '-1158px'}], position: 60935, duration: 750, easing: "easeOutCubic" },
                { id: "eid411", tween: [ "style", "${_scene4_bgACTIVE}", "opacity", '1', { fromValue: '0.000000'}], position: 125950, duration: 102, easing: "easeOutBounce" },
                { id: "eid496", tween: [ "style", "${_scene4_bgACTIVE}", "opacity", '0', { fromValue: '1'}], position: 193872, duration: 1500, easing: "swing" },
                { id: "eid172", tween: [ "style", "${_scene3_bbox_MENU_fiatOPS2}", "top", '31px', { fromValue: '103px'}], position: 60935, duration: 750, easing: "easeOutCubic" },
                { id: "eid329", tween: [ "transform", "${_hamburger_iconCopy}", "scaleY", '0.5', { fromValue: '0'}], position: 119000, duration: 1000, easing: "easeOutBounce" },
                { id: "eid313", tween: [ "style", "${_hamburger_iconCopy}", "left", '171px', { fromValue: '171px'}], position: 120000, duration: 0 },
                { id: "eid408", tween: [ "style", "${_scene4_icon_HELP}", "opacity", '1', { fromValue: '0'}], position: 124302, duration: 37, easing: "easeOutBounce" },
                { id: "eid492", tween: [ "style", "${_scene4_icon_HELP}", "opacity", '0', { fromValue: '1'}], position: 193872, duration: 1500, easing: "swing" },
                { id: "eid406", tween: [ "style", "${_scene4_icon_COMMUNITY}", "opacity", '1', { fromValue: '0'}], position: 124052, duration: 37, easing: "easeOutBounce" },
                { id: "eid493", tween: [ "style", "${_scene4_icon_COMMUNITY}", "opacity", '0', { fromValue: '1'}], position: 193872, duration: 1500, easing: "swing" },
                { id: "eid200", tween: [ "style", "${_scene3_bbox_MENU_coinOPS2}", "opacity", '0.5', { fromValue: '0'}], position: 53000, duration: 3750, easing: "easeOutCubic" },
                { id: "eid226", tween: [ "style", "${_scene3_bbox_MENU_coinOPS2}", "opacity", '1', { fromValue: '0.5'}], position: 77500, duration: 750 },
                { id: "eid229", tween: [ "style", "${_scene3_bbox_MENU_coinOPS2}", "opacity", '0.5', { fromValue: '1'}], position: 90000, duration: 750 },
                { id: "eid264", tween: [ "style", "${_scene3_bbox_MENU_coinOPS2}", "opacity", '0', { fromValue: '0.5'}], position: 117000, duration: 1500 },
                { id: "eid422", tween: [ "style", "${_scene4_bgACTIVE}", "top", '-248px', { fromValue: '-248px'}], position: 126052, duration: 0, easing: "easeOutBounce" },
                { id: "eid423", tween: [ "style", "${_scene4_bgACTIVE}", "top", '-248px', { fromValue: '-248px'}], position: 126552, duration: 0, easing: "easeOutBounce" },
                { id: "eid439", tween: [ "style", "${_scene4_bgACTIVE}", "top", '-248px', { fromValue: '-248px'}], position: 135607, duration: 0, easing: "easeOutQuart" },
                { id: "eid449", tween: [ "style", "${_scene4_bgACTIVE}", "top", '-248px', { fromValue: '-248px'}], position: 145054, duration: 0, easing: "easeOutQuart" },
                { id: "eid450", tween: [ "style", "${_scene4_bgACTIVE}", "top", '-248px', { fromValue: '-248px'}], position: 146054, duration: 0, easing: "easeOutQuart" },
                { id: "eid455", tween: [ "style", "${_scene4_bgACTIVE}", "top", '-248px', { fromValue: '-248px'}], position: 155000, duration: 0, easing: "swing" },
                { id: "eid467", tween: [ "style", "${_scene4_bgACTIVE}", "top", '-248px', { fromValue: '-248px'}], position: 163461, duration: 0, easing: "swing" },
                { id: "eid473", tween: [ "style", "${_scene4_bgACTIVE}", "top", '-248px', { fromValue: '-248px'}], position: 178564, duration: 0, easing: "swing" },
                { id: "eid197", tween: [ "style", "${_scene3_bbox_MENU_fiatOPS2}", "opacity", '0.5', { fromValue: '0'}], position: 53000, duration: 3750, easing: "easeOutCubic" },
                { id: "eid232", tween: [ "style", "${_scene3_bbox_MENU_fiatOPS2}", "opacity", '1', { fromValue: '0.5'}], position: 91750, duration: 750 },
                { id: "eid235", tween: [ "style", "${_scene3_bbox_MENU_fiatOPS2}", "opacity", '0.5', { fromValue: '1'}], position: 107000, duration: 750 },
                { id: "eid266", tween: [ "style", "${_scene3_bbox_MENU_fiatOPS2}", "opacity", '0', { fromValue: '0.5'}], position: 117000, duration: 1500 },
                { id: "eid213", tween: [ "style", "${_scene3_bbox_coinname22}", "opacity", '1', { fromValue: '0.000000'}], position: 53000, duration: 1500, easing: "easeOutCubic" },
                { id: "eid263", tween: [ "style", "${_scene3_bbox_coinname22}", "opacity", '0', { fromValue: '1'}], position: 117000, duration: 1500 },
                { id: "eid196", tween: [ "style", "${_scene3_bbox_MENU_coinicon2}", "opacity", '0.5', { fromValue: '0'}], position: 53000, duration: 3750, easing: "easeOutCubic" },
                { id: "eid220", tween: [ "style", "${_scene3_bbox_MENU_coinicon2}", "opacity", '1', { fromValue: '0.5'}], position: 66000, duration: 750 },
                { id: "eid223", tween: [ "style", "${_scene3_bbox_MENU_coinicon2}", "opacity", '0.5', { fromValue: '1'}], position: 76250, duration: 750 },
                { id: "eid270", tween: [ "style", "${_scene3_bbox_MENU_coinicon2}", "opacity", '0', { fromValue: '0.5'}], position: 117000, duration: 1500 },
                { id: "eid13", tween: [ "style", "${_tut_n1}", "opacity", '1', { fromValue: '0.000000'}], position: 2000, duration: 1000 },
                { id: "eid19", tween: [ "style", "${_tut_n1}", "opacity", '0', { fromValue: '1'}], position: 9000, duration: 1000 },
                { id: "eid497", tween: [ "style", "${_hamburger_iconCopy}", "top", '115px', { fromValue: '115px'}], position: 120000, duration: 0, easing: "swing" },
                { id: "eid85", tween: [ "style", "${_scene2_coinwallets_O}", "opacity", '1', { fromValue: '0'}], position: 27000, duration: 1000 },
                { id: "eid91", tween: [ "style", "${_scene2_coinwallets_O}", "opacity", '0', { fromValue: '1'}], position: 42250, duration: 1000 },
                { id: "eid199", tween: [ "style", "${_scene3_bbox_MENU_byMAIL2}", "left", '121px', { fromValue: '120px'}], position: 53000, duration: 4000, easing: "easeOutCubic" },
                { id: "eid169", tween: [ "style", "${_scene3_bbox_MENU_byMAIL2}", "left", '120px', { fromValue: '121px'}], position: 60935, duration: 750, easing: "easeOutCubic" },
                { id: "eid398", tween: [ "style", "${_scene4_icon_PROJECTS}", "top", '-99px', { fromValue: '-173px'}], position: 123589, duration: 1500, easing: "easeOutBounce" },
                { id: "eid426", tween: [ "style", "${_scene4_icon_ADVANCED}", "left", '-135px', { fromValue: '-134px'}], position: 123339, duration: 1500, easing: "easeOutQuart" },
                { id: "eid533", tween: [ "style", "${_scene4_icon_ADVANCED}", "left", '-135px', { fromValue: '-135px'}], position: 124839, duration: 0, easing: "swing" },
                { id: "eid534", tween: [ "style", "${_scene4_icon_ADVANCED}", "left", '-135px', { fromValue: '-135px'}], position: 126294, duration: 0, easing: "swing" },
                { id: "eid535", tween: [ "style", "${_scene4_icon_ADVANCED}", "left", '-135px', { fromValue: '-135px'}], position: 127559, duration: 0, easing: "swing" },
                { id: "eid536", tween: [ "style", "${_scene4_icon_ADVANCED}", "left", '-135px', { fromValue: '-135px'}], position: 128849, duration: 0, easing: "swing" },
                { id: "eid538", tween: [ "style", "${_scene4_icon_ADVANCED}", "left", '-135px', { fromValue: '-135px'}], position: 130204, duration: 0, easing: "swing" },
                { id: "eid539", tween: [ "style", "${_scene4_icon_ADVANCED}", "left", '-135px', { fromValue: '-135px'}], position: 164520, duration: 0, easing: "swing" },
                { id: "eid357", tween: [ "style", "${_scene4_BG}", "opacity", '1', { fromValue: '0.000000'}], position: 123052, duration: 1000 },
                { id: "eid501", tween: [ "style", "${_scene4_BG}", "opacity", '0', { fromValue: '1'}], position: 193872, duration: 1500, easing: "swing" },
                { id: "eid407", tween: [ "style", "${_scene4_icon_HELP}", "top", '-99px', { fromValue: '-173px'}], position: 124339, duration: 1500, easing: "easeOutBounce" },
                { id: "eid317", tween: [ "transform", "${_hamburger_iconCopy}", "scaleX", '0.5', { fromValue: '0.5'}], position: 120000, duration: 0 },
                { id: "eid323", tween: [ "transform", "${_hamburger_iconCopy}", "scaleX", '0', { fromValue: '0.5'}], position: 122250, duration: 250, easing: "easeOutCirc" },
                { id: "eid420", tween: [ "style", "${_scene4_bgACTIVE}", "left", '-368px', { fromValue: '-479px'}], position: 126052, duration: 500, easing: "easeOutQuart" },
                { id: "eid437", tween: [ "style", "${_scene4_bgACTIVE}", "left", '-285px', { fromValue: '-368px'}], position: 135607, duration: 1000, easing: "swing" },
                { id: "eid448", tween: [ "style", "${_scene4_bgACTIVE}", "left", '-200px', { fromValue: '-285px'}], position: 145054, duration: 1000, easing: "swing" },
                { id: "eid454", tween: [ "style", "${_scene4_bgACTIVE}", "left", '-112px', { fromValue: '-200px'}], position: 155000, duration: 1000, easing: "swing" },
                { id: "eid465", tween: [ "style", "${_scene4_bgACTIVE}", "left", '-26px', { fromValue: '-112px'}], position: 163461, duration: 1000, easing: "swing" },
                { id: "eid472", tween: [ "style", "${_scene4_bgACTIVE}", "left", '61px', { fromValue: '-26px'}], position: 178564, duration: 1000, easing: "swing" },
                { id: "eid217", tween: [ "style", "${_scene3_bbox_MENU_bg2}", "opacity", '1', { fromValue: '0'}], position: 53000, duration: 3750, easing: "easeOutCubic" },
                { id: "eid267", tween: [ "style", "${_scene3_bbox_MENU_bg2}", "opacity", '0', { fromValue: '1'}], position: 117000, duration: 1500 },
                { id: "eid380", tween: [ "style", "${_scene4_icon_ADVANCED}", "top", '-99px', { fromValue: '-173px'}], position: 123339, duration: 1500, easing: "easeOutBounce" },
                { id: "eid175", tween: [ "style", "${_scene3_bbox_MENU_coinOPS2}", "left", '3px', { fromValue: '4px'}], position: 60935, duration: 750, easing: "easeOutCubic" },
                { id: "eid104", tween: [ "style", "${_scene2_coinbalances_O}", "opacity", '1', { fromValue: '0.000000'}], position: 43250, duration: 1000 },
                { id: "eid109", tween: [ "style", "${_scene2_coinbalances_O}", "opacity", '0', { fromValue: '1'}], position: 51000, duration: 1000 },
                { id: "eid212", tween: [ "style", "${_scene3_bbox_BG2}", "opacity", '1', { fromValue: '0.000000'}], position: 53000, duration: 1500, easing: "easeOutCubic" },
                { id: "eid268", tween: [ "style", "${_scene3_bbox_BG2}", "opacity", '0', { fromValue: '1'}], position: 117000, duration: 1500 },
                { id: "eid198", tween: [ "style", "${_scene3_bbox_MENU_coinOPS2}", "top", '103px', { fromValue: '102px'}], position: 53000, duration: 4000, easing: "easeOutCubic" },
                { id: "eid176", tween: [ "style", "${_scene3_bbox_MENU_coinOPS2}", "top", '31px', { fromValue: '103px'}], position: 60935, duration: 750, easing: "easeOutCubic" },
                { id: "eid215", tween: [ "style", "${_scene3_bbox_coinBALANCE2}", "opacity", '1', { fromValue: '0.000000'}], position: 53000, duration: 1500, easing: "easeOutCubic" },
                { id: "eid261", tween: [ "style", "${_scene3_bbox_coinBALANCE2}", "opacity", '0', { fromValue: '1'}], position: 117000, duration: 1500 },
                { id: "eid43", tween: [ "style", "${_tut_n1}", "top", '227px', { fromValue: '227px'}], position: 3000, duration: 0 },
                { id: "eid171", tween: [ "style", "${_scene3_bbox_MENU_fiatOPS2}", "left", '61px', { fromValue: '62px'}], position: 60935, duration: 750, easing: "easeOutCubic" },
                { id: "eid399", tween: [ "style", "${_scene4_icon_PROJECTS}", "opacity", '1', { fromValue: '0'}], position: 123552, duration: 37, easing: "easeOutBounce" },
                { id: "eid499", tween: [ "style", "${_scene4_icon_PROJECTS}", "opacity", '0', { fromValue: '1'}], position: 193872, duration: 1500, easing: "swing" },
                { id: "eid369", tween: [ "style", "${_scene4_icon_BASIC}", "opacity", '1', { fromValue: '0'}], position: 123004, duration: 48 },
                { id: "eid495", tween: [ "style", "${_scene4_icon_BASIC}", "opacity", '0', { fromValue: '1'}], position: 193872, duration: 1500, easing: "swing" },
                { id: "eid66", tween: [ "style", "${_scene2_coinnames_O}", "opacity", '1', { fromValue: '0.000000'}], position: 23000, duration: 1046 },
                { id: "eid72", tween: [ "style", "${_scene2_coinnames_O}", "opacity", '0', { fromValue: '1'}], position: 26000, duration: 1000 },
                { id: "eid34", tween: [ "style", "${_scene2_coinnames}", "opacity", '1', { fromValue: '0.000000'}], position: 11000, duration: 1000 },
                { id: "eid65", tween: [ "style", "${_scene2_coinnames}", "opacity", '0', { fromValue: '1'}], position: 23000, duration: 1046 },
                { id: "eid71", tween: [ "style", "${_scene2_coinnames}", "opacity", '1', { fromValue: '0.000000'}], position: 26000, duration: 1000 },
                { id: "eid134", tween: [ "style", "${_scene2_coinnames}", "opacity", '0', { fromValue: '1'}], position: 53000, duration: 1000 },
                { id: "eid35", tween: [ "style", "${_scene2_coinbalances}", "opacity", '1', { fromValue: '0.000000'}], position: 11000, duration: 1000 },
                { id: "eid103", tween: [ "style", "${_scene2_coinbalances}", "opacity", '0', { fromValue: '1'}], position: 43250, duration: 1000 },
                { id: "eid110", tween: [ "style", "${_scene2_coinbalances}", "opacity", '1', { fromValue: '0.000000'}], position: 51000, duration: 1000 },
                { id: "eid135", tween: [ "style", "${_scene2_coinbalances}", "opacity", '0', { fromValue: '1'}], position: 53000, duration: 1000 },
                { id: "eid364", tween: [ "style", "${_scene4_icon_BASIC}", "top", '-99px', { fromValue: '-173px'}], position: 123052, duration: 1500, easing: "easeOutBounce" },
                { id: "eid214", tween: [ "style", "${_scene3_bbox_coinADDRESS2}", "opacity", '1', { fromValue: '0.000000'}], position: 53000, duration: 1500, easing: "easeOutCubic" },
                { id: "eid262", tween: [ "style", "${_scene3_bbox_coinADDRESS2}", "opacity", '0', { fromValue: '1'}], position: 117000, duration: 1500 },
                { id: "eid178", tween: [ "style", "${_scene3_bbox_MENU_bg2}", "top", '-69px', { fromValue: '3px'}], position: 60935, duration: 750, easing: "easeOutCubic" },
                { id: "eid403", tween: [ "style", "${_scene4_icon_SERVICES}", "top", '-99px', { fromValue: '-173px'}], position: 123839, duration: 1500, easing: "easeOutBounce" },
                { id: "eid33", tween: [ "style", "${_scene2_coinwallets}", "opacity", '1', { fromValue: '0.000000'}], position: 11000, duration: 1000 },
                { id: "eid92", tween: [ "style", "${_scene2_coinwallets}", "opacity", '0', { fromValue: '1'}], position: 27000, duration: 1000 },
                { id: "eid96", tween: [ "style", "${_scene2_coinwallets}", "opacity", '1', { fromValue: '0.000000'}], position: 42250, duration: 1000 },
                { id: "eid133", tween: [ "style", "${_scene2_coinwallets}", "opacity", '0', { fromValue: '1'}], position: 53000, duration: 1000 },
                { id: "eid552", trigger: [ function executeMediaFunction(e, data) { this._executeMediaAction(e, data); }, ['play', '${_audio_track}', [] ], ""], position: 0 }            ]
        }
    }
}
};


Edge.registerCompositionDefn(compId, symbols, fonts, resources, opts);

/**
 * Adobe Edge DOM Ready Event Handler
 */
$(window).ready(function() {
     Edge.launchComposition(compId);
});
})(jQuery, AdobeEdge, "EDGE-107524829");
