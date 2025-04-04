import { ILiquidation, ILiquidationResponse } from "../interface/common";
import getConfig from "./config";
const config = getConfig();
const {
  LIQUIDATION_API_URL,
  HISTORY_API_URL,
  LIQUIDATION_RESULT_API_URL,
  DASH_BOARD_API_URL,
} = config;
const liquidations = [
  {
    accountId: "davidnvg1511.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "3969477752786",
        balance: "4439916837644",
        tokenBalance: "4",
        value: "0.00000443814087090894",
        adjustedValue: "0.000004216233827363493",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "46802900924052505",
        balance: "52142403838485997",
        tokenBalance: "52142403838485997",
        value: "0.00000038849219403902",
        adjustedValue: "0.00000051798959205203",
      },
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "474618758615",
        balance: "546003496226",
        tokenBalance: "1",
        value: "0.00000054578509482751",
        adjustedValue: "0.00000057451062613422",
      },
      {
        tokenId: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
        shares: "797232007741",
        balance: "896678924763",
        tokenBalance: "896678924763",
        value: "0.00000089640992108557",
        adjustedValue: "0.00000094358939061639",
      },
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "1972231421572",
        balance: "2279864500268",
        tokenBalance: "3",
        value: "0.000002279864500268",
        adjustedValue: "0.00000239985736870316",
      },
    ],
    healthFactor: "95.05",
    collateralSum: "0.00000443814087090894",
    borrowedSum: "0.0000041105517102201",
    gapSum: "0.00000032758916068884",
    adjustedCollateralSum: "0.000004216233827363493",
    adjustedBorrowedSum: "0.0000044359469775058",
    adjustedGapSum: "-0.000000219713150142307",
  },
  {
    accountId: "godlike.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "209464115841083047000",
        balance: "217288458284393155028",
        tokenBalance: "217288458284393155028",
        value: "0.00161892938729369964",
        adjustedValue: "0.00121419704047027473",
      },
      {
        tokenId: "meta-pool.near",
        shares: "1631624268022160473",
        balance: "1633832619042854828",
        tokenBalance: "1633832619042854828",
        value: "0.00001572057407716844",
        adjustedValue: "0.000011004401854017908",
      },
      {
        tokenId: "aurora",
        shares: "95",
        balance: "96",
        tokenBalance: "96",
        value: "0.00000000000029133984",
        adjustedValue: "0.00000000000021850488",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "meta-pool.near",
        shares: "13930555798871991102",
        balance: "14152370032148608064",
        tokenBalance: "14152370032148608064",
        value: "0.00013617268921233069",
        adjustedValue: "0.00019453241316047241",
      },
      {
        tokenId: "aurora",
        shares: "2242144514",
        balance: "2321953404",
        tokenBalance: "2321953404",
        value: "0.00000704664097092516",
        adjustedValue: "0.00000939552129456688",
      },
      {
        tokenId: "wrap.near",
        shares: "96412004878310272355",
        balance: "107411156017883259738",
        tokenBalance: "107411156017883259738",
        value: "0.00080027755902684102",
        adjustedValue: "0.00106703674536912136",
      },
    ],
    healthFactor: "96.40",
    collateralSum: "0.00163464996166220792",
    borrowedSum: "0.00094349688921009687",
    gapSum: "0.00069115307245211105",
    adjustedCollateralSum: "0.001225201442542797518",
    adjustedBorrowedSum: "0.00127096467982416065",
    adjustedGapSum: "-0.000045763237281363132",
  },
  {
    accountId: "whendacha.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "2414241858221",
        balance: "2713883693526",
        tokenBalance: "2",
        value: "0.000002713883693526",
        adjustedValue: "0.0000025781895088497",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "2160825997671",
        balance: "2497876481158",
        tokenBalance: "3",
        value: "0.000002497876481158",
        adjustedValue: "0.00000262934366437684",
      },
    ],
    healthFactor: "98.05",
    collateralSum: "0.000002713883693526",
    borrowedSum: "0.000002497876481158",
    gapSum: "0.000000216007212368",
    adjustedCollateralSum: "0.0000025781895088497",
    adjustedBorrowedSum: "0.00000262934366437684",
    adjustedGapSum: "-0.00000005115415552714",
  },
  {
    accountId: "ekongmusk.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "23658896176451862642",
        balance: "24542652827427457210",
        tokenBalance: "24542652827427457210",
        value: "0.00018285748915603101",
        adjustedValue: "0.0001371431168670232575",
      },
      {
        tokenId: "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near",
        shares: "7211316395827594845",
        balance: "7265125785578211885",
        tokenBalance: "726512578",
        value: "456886.4696556440693033637",
        adjustedValue: "342664.852241733051977522775",
      },
      {
        tokenId: "aurora",
        shares: "24",
        balance: "24",
        tokenBalance: "24",
        value: "0.00000000000007283496",
        adjustedValue: "0.00000000000005462622",
      },
      {
        tokenId: "meta-pool.near",
        shares: "4673901884954583965807578994",
        balance: "4680227860977713660773539968",
        tokenBalance: "4680227860977713660773539968",
        value: "45032.68445554146307259692",
        adjustedValue: "31522.879118879024150817844",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "aurora",
        shares: "1006527088",
        balance: "1042354310",
        tokenBalance: "1042354310",
        value: "0.0000031633264364449",
        adjustedValue: "0.00000421776858192653",
      },
      {
        tokenId: "meta-pool.near",
        shares: "2381543004222234182096967421",
        balance: "2419463970415099294794751230",
        tokenBalance: "2419463970415099294794751230",
        value: "23279.84037693704390458562",
        adjustedValue: "33256.91482419577700655089",
      },
      {
        tokenId: "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near",
        shares: "3959873036862485269",
        balance: "4086176007388238194",
        tokenBalance: "408617601",
        value: "256969.88400574871601375828",
        adjustedValue: "342626.51200766495468501104",
      },
    ],
    healthFactor: "99.55",
    collateralSum: "501919.15429404302160482659",
    borrowedSum: "280249.7243858490863547888",
    gapSum: "221669.42990819393525003779",
    adjustedCollateralSum: "374187.7314977551930499900965",
    adjustedBorrowedSum: "375883.42683607850027348846",
    adjustedGapSum: "-1695.6953383233072234983635",
  },
  {
    accountId: "crypto622.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
        shares: "1",
        balance: "1",
        tokenBalance: "1",
        value: "0.000000000000000001",
        adjustedValue: "0.00000000000000000095",
      },
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "203105470056926",
        balance: "227176332123412",
        tokenBalance: "227",
        value: "0.00022708546159056264",
        adjustedValue: "0.000215731188511034508",
      },
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "3698665301627457",
        balance: "4157722398739318",
        tokenBalance: "4157",
        value: "0.004157722398739318",
        adjustedValue: "0.0039498362788023521",
      },
      {
        tokenId: "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near",
        shares: "17456394169",
        balance: "17586650264",
        tokenBalance: "1",
        value: "0.00110598257887533168",
        adjustedValue: "0.00082948693415649876",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "351683771012",
        balance: "406540194057",
        tokenBalance: "1",
        value: "0.000000406540194057",
        adjustedValue: "0.00000042793704637579",
      },
      {
        tokenId: "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near",
        shares: "53657691055",
        balance: "55369141324",
        tokenBalance: "6",
        value: "0.00348203351931000888",
        adjustedValue: "0.00464271135908001184",
      },
      {
        tokenId: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
        shares: "1285113594604519",
        balance: "1445418980947873",
        tokenBalance: "1445418980947873",
        value: "0.00144498535525358864",
        adjustedValue: "0.00152103721605640909",
      },
    ],
    healthFactor: "81.03",
    collateralSum: "0.00549079043920521332",
    borrowedSum: "0.00492742541475765452",
    gapSum: "0.0005633650244475588",
    adjustedCollateralSum: "0.004995054401469886318",
    adjustedBorrowedSum: "0.00616417651218279672",
    adjustedGapSum: "-0.001169122110712910402",
  },
  {
    accountId: "jen.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "meta-pool.near",
        shares: "46589154433531681680148",
        balance: "46652211357091229558786",
        tokenBalance: "46652211357091229558786",
        value: "0.44888291245679610169",
        adjustedValue: "0.314218038719757271183",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "meta-pool.near",
        shares: "22645488384282093775754",
        balance: "23006069233722487711070",
        tokenBalance: "23006069233722487711070",
        value: "0.22136209755995440451",
        adjustedValue: "0.31623156794279200644",
      },
    ],
    healthFactor: "99.36",
    collateralSum: "0.44888291245679610169",
    borrowedSum: "0.22136209755995440451",
    gapSum: "0.22752081489684169718",
    adjustedCollateralSum: "0.314218038719757271183",
    adjustedBorrowedSum: "0.31623156794279200644",
    adjustedGapSum: "-0.002013529223034735257",
  },
  {
    accountId: "iliketurtles.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "48318187987964095189125",
        balance: "50123070163319087626173",
        tokenBalance: "50123070163319087626173",
        value: "0.37344694655882519427",
        adjustedValue: "0.2800852099191188957025",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "26032988244734672527481",
        balance: "29002958350428236427127",
        tokenBalance: "29002958350428236427127",
        value: "0.21608944148570061832",
        adjustedValue: "0.28811925531426749109",
      },
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "25494145110375",
        balance: "29328576064208",
        tokenBalance: "30",
        value: "0.00002931684463378232",
        adjustedValue: "0.00003085983645661297",
      },
    ],
    healthFactor: "97.20",
    collateralSum: "0.37344694655882519427",
    borrowedSum: "0.21611875833033440064",
    gapSum: "0.15732818822849079363",
    adjustedCollateralSum: "0.2800852099191188957025",
    adjustedBorrowedSum: "0.28815011515072410406",
    adjustedGapSum: "-0.0080649052316052083575",
  },
  {
    accountId: "nodeasy.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "66810314504022094",
        balance: "74728278823713561",
        tokenBalance: "74728",
        value: "0.07469838751218407558",
        adjustedValue: "0.070963468136574871801",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "59749667498033351",
        balance: "68736278876598420",
        tokenBalance: "68737",
        value: "0.06870878436504778063",
        adjustedValue: "0.07232503617373450593",
      },
    ],
    healthFactor: "98.12",
    collateralSum: "0.07469838751218407558",
    borrowedSum: "0.06870878436504778063",
    gapSum: "0.00598960314713629495",
    adjustedCollateralSum: "0.070963468136574871801",
    adjustedBorrowedSum: "0.07232503617373450593",
    adjustedGapSum: "-0.001361568037159634129",
  },
  {
    accountId: "colibri.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "5214963642396284703",
        balance: "5409763888747203293",
        tokenBalance: "5409763888747203293",
        value: "0.00004030598682949991",
        adjustedValue: "0.0000302294901221249325",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "meta-pool.near",
        shares: "2486428290673762040",
        balance: "2526019330173977019",
        tokenBalance: "2526019330173977019",
        value: "0.00002430510539300099",
        adjustedValue: "0.00003472157913285856",
      },
    ],
    healthFactor: "87.06",
    collateralSum: "0.00004030598682949991",
    borrowedSum: "0.00002430510539300099",
    gapSum: "0.00001600088143649892",
    adjustedCollateralSum: "0.0000302294901221249325",
    adjustedBorrowedSum: "0.00003472157913285856",
    adjustedGapSum: "-0.0000044920890107336275",
  },
  {
    accountId:
      "68d637a77f62f1ced6b493d579d6735d73454d1a62e3a78b6d1e8f2e9deb51ae",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "47209292776962862",
        balance: "52804259640101286",
        tokenBalance: "52804",
        value: "0.05278313793624524549",
        adjustedValue: "0.0501439810394329832155",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "42281805103159996",
        balance: "48877015855004272",
        tokenBalance: "48878",
        value: "0.048877015855004272",
        adjustedValue: "0.05144949037368870737",
      },
    ],
    healthFactor: "97.46",
    collateralSum: "0.05278313793624524549",
    borrowedSum: "0.048877015855004272",
    gapSum: "0.00390612208124097349",
    adjustedCollateralSum: "0.0501439810394329832155",
    adjustedBorrowedSum: "0.05144949037368870737",
    adjustedGapSum: "-0.0013055093342557241545",
  },
  {
    accountId:
      "fc3e6d27230075de4ec7d1896e845a2480ccdb0bee9fbb22af5abf40ba25bde4",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "996272672679812498624909",
        balance: "1033487536555936886491281",
        tokenBalance: "1033487536555936886491281",
        value: "7.70010223986366336649",
        adjustedValue: "5.7750766798977475248675",
      },
      {
        tokenId: "meta-pool.near",
        shares: "4",
        balance: "4",
        tokenBalance: "4",
        value: "0",
        adjustedValue: "0",
      },
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "32741090089816",
        balance: "36804726171268",
        tokenBalance: "36",
        value: "0.000036804726171268",
        adjustedValue: "0.0000349644898627046",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "meta-pool.near",
        shares: "400230676048914428787734",
        balance: "406603491450060204366568",
        tokenBalance: "406603491450060204366568",
        value: "3.91229813438333428039",
        adjustedValue: "5.58899733483333468627",
      },
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "379045749921236221",
        balance: "438170155779078386",
        tokenBalance: "438171",
        value: "0.438170155779078386",
        adjustedValue: "0.46123174292534566947",
      },
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "10123472505351",
        balance: "11646087057310",
        tokenBalance: "12",
        value: "0.00001164142862248708",
        adjustedValue: "0.00001225413539209166",
      },
      {
        tokenId: "wrap.near",
        shares: "108912741126773289034",
        balance: "121338037148680489085",
        tokenBalance: "121338037148680489085",
        value: "0.00090404117957995885",
        adjustedValue: "0.00120538823943994513",
      },
    ],
    healthFactor: "95.43",
    collateralSum: "7.70013904458983463449",
    borrowedSum: "4.35138397277061511232",
    gapSum: "3.34875507181921952217",
    adjustedCollateralSum: "5.7751116443876102294675",
    adjustedBorrowedSum: "6.05144672013351239253",
    adjustedGapSum: "-0.2763350757459021630625",
  },
  {
    accountId:
      "d054f3db4bb9b0e58f8b702e3127cafd7898fc5ece95aef1d20b68e59ddbb5fc",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "135899422156685152418196",
        balance: "140975822057127267957282",
        tokenBalance: "140975822057127267957282",
        value: "1.05035445981883242264",
        adjustedValue: "0.78776584486412431698",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "73473949719062804708215",
        balance: "81856215794759432948374",
        tokenBalance: "81856215794759432948374",
        value: "0.60987792140043463113",
        adjustedValue: "0.81317056186724617484",
      },
    ],
    healthFactor: "96.88",
    collateralSum: "1.05035445981883242264",
    borrowedSum: "0.60987792140043463113",
    gapSum: "0.44047653841839779151",
    adjustedCollateralSum: "0.78776584486412431698",
    adjustedBorrowedSum: "0.81317056186724617484",
    adjustedGapSum: "-0.02540471700312185786",
  },
  {
    accountId: "arseniy2474.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "6361813498133447542",
        balance: "7151405255877833838",
        tokenBalance: "7151405",
        value: "7.151405255877833838",
        adjustedValue: "6.7938349930839421461",
      },
      {
        tokenId: "wrap.near",
        shares: "2546939182817915461445951",
        balance: "2642077790539015128116264",
        tokenBalance: "2642077790539015128116264",
        value: "19.68506478618998611354",
        adjustedValue: "14.763798589642489585155",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "954938316536",
        balance: "1103891736032",
        tokenBalance: "2",
        value: "0.000001103891736032",
        adjustedValue: "0.00000116199130108632",
      },
      {
        tokenId: "wrap.near",
        shares: "1984612826891068939066440",
        balance: "2211027125235578662312299",
        tokenBalance: "2211027125235578662312299",
        value: "16.47347869928020238142",
        adjustedValue: "21.96463826570693650856",
      },
    ],
    healthFactor: "98.15",
    collateralSum: "26.83647004206781995154",
    borrowedSum: "16.47347980317193841342",
    gapSum: "10.36299023889588153812",
    adjustedCollateralSum: "21.557633582726431731255",
    adjustedBorrowedSum: "21.96463942769823759488",
    adjustedGapSum: "-0.407005844971805863625",
  },
  {
    accountId: "boshop966.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "49731405628888725155367",
        balance: "51589077269995981847519",
        tokenBalance: "51589077269995981847519",
        value: "0.38436957910783206235",
        adjustedValue: "0.2882771843308740467625",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "26111463905725967001642",
        balance: "29090386897080508642243",
        tokenBalance: "29090386897080508642243",
        value: "0.21674083661538803769",
        adjustedValue: "0.28898778215385071692",
      },
    ],
    healthFactor: "99.75",
    collateralSum: "0.38436957910783206235",
    borrowedSum: "0.21674083661538803769",
    gapSum: "0.16762874249244402466",
    adjustedCollateralSum: "0.2882771843308740467625",
    adjustedBorrowedSum: "0.28898778215385071692",
    adjustedGapSum: "-0.0007105978229766701575",
  },
  {
    accountId: "dimon4ikp1.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "5620144472343691605",
        balance: "6317684529749845840",
        tokenBalance: "6317684",
        value: "6.31768452974984584",
        adjustedValue: "6.001800303262353548",
      },
      {
        tokenId: "wrap.near",
        shares: "2808226372912731473616499",
        balance: "2913125127106380921138203",
        tokenBalance: "2913125127106380921138203",
        value: "21.70453007201880169103",
        adjustedValue: "16.2783975540141012682725",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "2217577903447897362263366",
        balance: "2470569992499331930721917",
        tokenBalance: "2470569992499331930721917",
        value: "18.40722878611552248304",
        adjustedValue: "24.54297171482069664405",
      },
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "1120472623866",
        balance: "1295246455732",
        tokenBalance: "2",
        value: "0.000001295246455732",
        adjustedValue: "0.00000136341732182316",
      },
    ],
    healthFactor: "90.78",
    collateralSum: "28.02221460176864753103",
    borrowedSum: "18.40723008136197821504",
    gapSum: "9.61498452040666931599",
    adjustedCollateralSum: "22.2801978572764548162725",
    adjustedBorrowedSum: "24.54297307823801846721",
    adjustedGapSum: "-2.2627752209615636509375",
  },
  {
    accountId: "tanyaorlihat7.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "18914826461033328466735",
        balance: "19621372682053784160002",
        tokenBalance: "19621372682053784160002",
        value: "0.14619099930490992426",
        adjustedValue: "0.109643249478682443195",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "9941405006182009536954",
        balance: "11075568913889556422941",
        tokenBalance: "11075568913889556422941",
        value: "0.08251963374982552908",
        adjustedValue: "0.11002617833310070544",
      },
    ],
    healthFactor: "99.65",
    collateralSum: "0.14619099930490992426",
    borrowedSum: "0.08251963374982552908",
    gapSum: "0.06367136555508439518",
    adjustedCollateralSum: "0.109643249478682443195",
    adjustedBorrowedSum: "0.11002617833310070544",
    adjustedGapSum: "-0.000382928854418262245",
  },
  {
    accountId: "catchfire.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "23166958315874128616783947",
        balance: "24032339073362984980725816",
        tokenBalance: "24032339073362984980725816",
        value: "179.0553454999982558974",
        adjustedValue: "134.29150912499869192305",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "12505727764955549037464205",
        balance: "13932442103804915929314341",
        tokenBalance: "13932442103804915929314341",
        value: "103.80505313860890662295",
        adjustedValue: "138.4067375181452088306",
      },
    ],
    healthFactor: "97.03",
    collateralSum: "179.0553454999982558974",
    borrowedSum: "103.80505313860890662295",
    gapSum: "75.25029236138934927445",
    adjustedCollateralSum: "134.29150912499869192305",
    adjustedBorrowedSum: "138.4067375181452088306",
    adjustedGapSum: "-4.11522839314651690755",
  },
  {
    accountId: "alekstae.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "33533034607215775484220654",
        balance: "34785630761343119442248622",
        tokenBalance: "34785630761343119442248622",
        value: "259.17382055046304571642",
        adjustedValue: "194.380365412847284287315",
      },
      {
        tokenId: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
        shares: "30779942071580",
        balance: "34203220013196",
        tokenBalance: "34203220013196",
        value: "0.00003419295904719204",
        adjustedValue: "0.000032483311094832438",
      },
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "6146043946879",
        balance: "6908855627009",
        tokenBalance: "6",
        value: "0.000006908855627009",
        adjustedValue: "0.00000656341284565855",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "17635058449383525262908561",
        balance: "19646951817691754074977692",
        tokenBalance: "19646951817691754074977692",
        value: "146.38157921289418291103",
        adjustedValue: "195.17543895052557721471",
      },
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "12440567723102",
        balance: "14381075367141",
        tokenBalance: "15",
        value: "0.000014381075367141",
        adjustedValue: "0.00001513797407067474",
      },
      {
        tokenId: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
        shares: "35719997597434",
        balance: "40175718896377",
        tokenBalance: "40175718896377",
        value: "0.00004016366618070809",
        adjustedValue: "0.00004227754334811378",
      },
    ],
    healthFactor: "99.59",
    collateralSum: "259.17386165227771991746",
    borrowedSum: "146.38163375763573076012",
    gapSum: "112.79222789464198915734",
    adjustedCollateralSum: "194.380404459571224778303",
    adjustedBorrowedSum: "195.17549636604299600323",
    adjustedGapSum: "-0.795091906471771224927",
  },
  {
    accountId:
      "71d90681a427894120ef26855a7ccc9ffd19baa83e5cee31ab558d8729366af4",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "33879201922050",
        balance: "37894365059506",
        tokenBalance: "37",
        value: "0.0000378792073134822",
        adjustedValue: "0.00003598524694780809",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "30320524571475",
        balance: "34880864110219",
        tokenBalance: "35",
        value: "0.00003486691176457491",
        adjustedValue: "0.00003670201238376306",
      },
    ],
    healthFactor: "98.05",
    collateralSum: "0.0000378792073134822",
    borrowedSum: "0.00003486691176457491",
    gapSum: "0.00000301229554890729",
    adjustedCollateralSum: "0.00003598524694780809",
    adjustedBorrowedSum: "0.00003670201238376306",
    adjustedGapSum: "-0.00000071676543595497",
  },
  {
    accountId: "tolstuy.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "4122817659117740677979",
        balance: "4276821780858274168473",
        tokenBalance: "4276821780858274168473",
        value: "0.03186488836046265752",
        adjustedValue: "0.02389866627034699314",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "2257640888819692579406",
        balance: "2515203558389217918663",
        tokenBalance: "2515203558389217918663",
        value: "0.01873977563213470702",
        adjustedValue: "0.02498636750951294269",
      },
    ],
    healthFactor: "95.65",
    collateralSum: "0.03186488836046265752",
    borrowedSum: "0.01873977563213470702",
    gapSum: "0.0131251127283279505",
    adjustedCollateralSum: "0.02389866627034699314",
    adjustedBorrowedSum: "0.02498636750951294269",
    adjustedGapSum: "-0.00108770123916594955",
  },
  {
    accountId:
      "6838542ea288fd6b552f5a619a3652b7def9f625d26731609e8067bb05a8470b",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
        shares: "90855360",
        balance: "100960094",
        tokenBalance: "100960094",
        value: "0.00000000010092980597",
        adjustedValue: "0.0000000000958833156715",
      },
      {
        tokenId: "wrap.near",
        shares: "29527100261044085715435503",
        balance: "30630058363784886202667614",
        tokenBalance: "30630058363784886202667614",
        value: "228.2123128452156731416",
        adjustedValue: "171.1592346339117548562",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
        shares: "56665187265907",
        balance: "63733616683367",
        tokenBalance: "63733616683367",
        value: "0.00006371449659836199",
        adjustedValue: "0.00006706789115617052",
      },
      {
        tokenId: "wrap.near",
        shares: "15534305289720903393617142",
        balance: "17306534504802266456169961",
        tokenBalance: "17306534504802266456169961",
        value: "128.94406598147976645834",
        adjustedValue: "171.92542130863968861112",
      },
    ],
    healthFactor: "99.55",
    collateralSum: "228.21231284531660294757",
    borrowedSum: "128.94412969597636482033",
    gapSum: "99.26818314934023812724",
    adjustedCollateralSum: "171.1592346340076381718715",
    adjustedBorrowedSum: "171.92548837653084478164",
    adjustedGapSum: "-0.7662537425232066097685",
  },
  {
    accountId: "lemon-free.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "208986044477",
        balance: "234924192184",
        tokenBalance: "0",
        value: "0.000000234924192184",
        adjustedValue: "0.0000002231779825748",
      },
      {
        tokenId: "wrap.near",
        shares: "34366349914163790751178996",
        balance: "35650073807277033715643551",
        tokenBalance: "35650073807277033715643551",
        value: "265.61443990849826740177",
        adjustedValue: "199.2108299313737005513275",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "18702021232322775878718077",
        balance: "20835638912086417558718277",
        tokenBalance: "20835638912086417558718277",
        value: "155.23801127839106266299",
        adjustedValue: "206.98401503785475021732",
      },
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "685194101878",
        balance: "792072214031",
        tokenBalance: "1",
        value: "0.000000792072214031",
        adjustedValue: "0.00000083376022529579",
      },
    ],
    healthFactor: "96.24",
    collateralSum: "265.61444014342245958577",
    borrowedSum: "155.23801207046327669399",
    gapSum: "110.37642807295918289178",
    adjustedCollateralSum: "199.2108301545516831261275",
    adjustedBorrowedSum: "206.98401587161497551311",
    adjustedGapSum: "-7.7731857170632923869825",
  },
  {
    accountId:
      "6079691ffd71b421f2e38c346b3537cae319a99a6265da06bfb79b8c09978ec0",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "57199276719364364378463",
        balance: "59335903925245817774505",
        tokenBalance: "59335903925245817774505",
        value: "0.44208808578543648991",
        adjustedValue: "0.3315660643390773674325",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "30866342536743363821361",
        balance: "34387725243347038818621",
        tokenBalance: "34387725243347038818621",
        value: "0.25620918569808144742",
        adjustedValue: "0.34161224759744192989",
      },
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "613293564894",
        balance: "708956470093",
        tokenBalance: "1",
        value: "0.000000708956470093",
        adjustedValue: "0.00000074626996851895",
      },
    ],
    healthFactor: "97.06",
    collateralSum: "0.44208808578543648991",
    borrowedSum: "0.25620989465455154042",
    gapSum: "0.18587819113088494949",
    adjustedCollateralSum: "0.3315660643390773674325",
    adjustedBorrowedSum: "0.34161299386741044884",
    adjustedGapSum: "-0.0100469295283330814075",
  },
  {
    accountId:
      "b6bc614ba3dd36894a4cea9862dc08db6605a13ee97c5d9280f5b8fb4ba842a2",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "316211575885725082460",
        balance: "355457940793465220052",
        tokenBalance: "355457940",
        value: "355.457940793465220052",
        adjustedValue: "337.6850437537919590494",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "282198964953810358310",
        balance: "326216992170997431632",
        tokenBalance: "326216993",
        value: "326.216992170997431632",
        adjustedValue: "343.38630754841834908632",
      },
    ],
    healthFactor: "98.34",
    collateralSum: "355.457940793465220052",
    borrowedSum: "326.216992170997431632",
    gapSum: "29.24094862246778842",
    adjustedCollateralSum: "337.6850437537919590494",
    adjustedBorrowedSum: "343.38630754841834908632",
    adjustedGapSum: "-5.70126379462639003692",
  },
  {
    accountId:
      "c93d52c30859eca7091275d4a1fa995e535ed48ab5f43b47f4e48309f2fc2e2e",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "41585176921941749147096404",
        balance: "43138553563551172623787440",
        tokenBalance: "43138553563551172623787440",
        value: "321.40810718059436675079",
        adjustedValue: "241.0560803854457750630925",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "23092996654974880148675604",
        balance: "25727558199404136811516315",
        tokenBalance: "25727558199404136811516315",
        value: "191.68574512048046172788",
        adjustedValue: "255.58099349397394897051",
      },
    ],
    healthFactor: "94.32",
    collateralSum: "321.40810718059436675079",
    borrowedSum: "191.68574512048046172788",
    gapSum: "129.72236206011390502291",
    adjustedCollateralSum: "241.0560803854457750630925",
    adjustedBorrowedSum: "255.58099349397394897051",
    adjustedGapSum: "-14.5249131085281739074175",
  },
  {
    accountId: "eimd.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "4376163108887067474260344",
        balance: "4539630720579042297348607",
        tokenBalance: "4539630720579042297348607",
        value: "33.82297264674621254063",
        adjustedValue: "25.3672294850596594054725",
      },
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "18776576857848",
        balance: "21107017750206",
        tokenBalance: "21",
        value: "0.000021107017750206",
        adjustedValue: "0.0000200516668626957",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "144242719748631",
        balance: "165937455817429",
        tokenBalance: "166",
        value: "0.00016587108083510203",
        adjustedValue: "0.00017460113772116003",
      },
      {
        tokenId: "wrap.near",
        shares: "2461796827385353365814363",
        balance: "2742650600870406327736884",
        tokenBalance: "2742650600870406327736884",
        value: "20.43439256684504938544",
        adjustedValue: "27.24585675579339918059",
      },
    ],
    healthFactor: "93.10",
    collateralSum: "33.82299375376396274663",
    borrowedSum: "20.43455843792588448747",
    gapSum: "13.38843531583807825916",
    adjustedCollateralSum: "25.3672495367265221011725",
    adjustedBorrowedSum: "27.24603135693112034062",
    adjustedGapSum: "-1.8787818202045982394475",
  },
  {
    accountId:
      "056b9f93e4b278a235e39ea3ab95fd787e19b18618d5fc27dcc24d633256ee26",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "aurora",
        shares: "16286696973868092",
        balance: "16492602714338921",
        tokenBalance: "16492602714338921",
        value: "50.05158579144861406159",
        adjustedValue: "37.5386893435864605461925",
      },
      {
        tokenId: "wrap.near",
        shares: "623732760452066",
        balance: "647031733124744",
        tokenBalance: "647031733124744",
        value: "0.00000000482077463082",
        adjustedValue: "0.000000003615580973115",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "aurora",
        shares: "9115744541690344",
        balance: "9440218473375889",
        tokenBalance: "9440218473375889",
        value: "28.64908062081641417831",
        adjustedValue: "38.19877416108855223775",
      },
    ],
    healthFactor: "98.27",
    collateralSum: "50.05158579626938869241",
    borrowedSum: "28.64908062081641417831",
    gapSum: "21.4025051754529745141",
    adjustedCollateralSum: "37.5386893472020415193075",
    adjustedBorrowedSum: "38.19877416108855223775",
    adjustedGapSum: "-0.6600848138865107184425",
  },
  {
    accountId: "leva.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "64351914353879113456",
        balance: "71978523591397087984",
        tokenBalance: "71978523",
        value: "71.94973218196052914881",
        adjustedValue: "68.3522455728625026913695",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "57788061304039139032",
        balance: "66479638529589174791",
        tokenBalance: "66479639",
        value: "66.45304667417733912108",
        adjustedValue: "69.95057544650246223272",
      },
    ],
    healthFactor: "97.72",
    collateralSum: "71.94973218196052914881",
    borrowedSum: "66.45304667417733912108",
    gapSum: "5.49668550778319002773",
    adjustedCollateralSum: "68.3522455728625026913695",
    adjustedBorrowedSum: "69.95057544650246223272",
    adjustedGapSum: "-1.5983298736399595413505",
  },
  {
    accountId:
      "8b546893118b8abef780e7c2f5ac4803bdc05e476f253b72f98e3a59782d5bc6",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "40957186756658953215",
        balance: "45811190899307349665",
        tokenBalance: "45811190",
        value: "45.79286642294762672513",
        adjustedValue: "43.5032231018002453888735",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "36691935721640052088",
        balance: "42415226115390387649",
        tokenBalance: "42415227",
        value: "42.415226115390387649",
        adjustedValue: "44.64760643725303963053",
      },
    ],
    healthFactor: "97.44",
    collateralSum: "45.79286642294762672513",
    borrowedSum: "42.415226115390387649",
    gapSum: "3.37764030755723907613",
    adjustedCollateralSum: "43.5032231018002453888735",
    adjustedBorrowedSum: "44.64760643725303963053",
    adjustedGapSum: "-1.1443833354527942416565",
  },
  {
    accountId:
      "042bcd53a5bbf333b5d28810cf01ed114c9c7f5acbecc35f152ee6f114744de5",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "4929287466268304084517881",
        balance: "5113416537649966732054520",
        tokenBalance: "5113416537649966732054520",
        value: "38.09802125541484213385",
        adjustedValue: "28.5735159415611316003875",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "2710070210090229248035641",
        balance: "3019248220414364071633666",
        tokenBalance: "3019248220414364071633666",
        value: "22.49521079101926095211",
        adjustedValue: "29.99361438802568126948",
      },
    ],
    healthFactor: "95.27",
    collateralSum: "38.09802125541484213385",
    borrowedSum: "22.49521079101926095211",
    gapSum: "15.60281046439558118174",
    adjustedCollateralSum: "28.5735159415611316003875",
    adjustedBorrowedSum: "29.99361438802568126948",
    adjustedGapSum: "-1.4200984464645496690925",
  },
  {
    accountId:
      "9dfebbb409741128b9df2cb08b170c6c1abe3f75ab30d5f60fca3c47441a6974",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "2694247018964933298571713",
        balance: "2794888177564350143029693",
        tokenBalance: "2794888177564350143029693",
        value: "20.82359385576094717566",
        adjustedValue: "15.617695391820710381745",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "1503171344501146148388159",
        balance: "1674660453432255964218409",
        tokenBalance: "1674660453432255964218409",
        value: "12.47722517434236628701",
        adjustedValue: "16.63630023245648838268",
      },
    ],
    healthFactor: "93.88",
    collateralSum: "20.82359385576094717566",
    borrowedSum: "12.47722517434236628701",
    gapSum: "8.34636868141858088865",
    adjustedCollateralSum: "15.617695391820710381745",
    adjustedBorrowedSum: "16.63630023245648838268",
    adjustedGapSum: "-1.018604840635778000935",
  },
  {
    accountId:
      "5425c4c71d117711be4679af4926a0bde495dfcfbcc99c17014570223897c1c4",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "2283334581926027382128474",
        balance: "2368626478391939879621199",
        tokenBalance: "2368626478391939879621199",
        value: "17.64768843990698726711",
        adjustedValue: "13.2357663299302404503325",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "1196482463197062770192848",
        balance: "1332983010666890644329425",
        tokenBalance: "1332983010666890644329425",
        value: "9.93152321927473543464",
        adjustedValue: "13.24203095903298057952",
      },
    ],
    healthFactor: "99.95",
    collateralSum: "17.64768843990698726711",
    borrowedSum: "9.93152321927473543464",
    gapSum: "7.71616522063225183247",
    adjustedCollateralSum: "13.2357663299302404503325",
    adjustedBorrowedSum: "13.24203095903298057952",
    adjustedGapSum: "-0.0062646291027401291875",
  },
  {
    accountId:
      "fbd403ae0662302381060252616b9cb1ae2d5db1f28695eba592813e1c1dbac6",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "172220435663413750742",
        balance: "192630985663482031448",
        tokenBalance: "192630985",
        value: "192.55393326921663863542",
        adjustedValue: "182.926236605755806703649",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "154250883310071891704",
        balance: "178311281904833686789",
        tokenBalance: "178311282",
        value: "178.311281904833686789",
        adjustedValue: "187.69608621561440714632",
      },
    ],
    healthFactor: "97.46",
    collateralSum: "192.55393326921663863542",
    borrowedSum: "178.311281904833686789",
    gapSum: "14.24265136438295184642",
    adjustedCollateralSum: "182.926236605755806703649",
    adjustedBorrowedSum: "187.69608621561440714632",
    adjustedGapSum: "-4.769849609858600442671",
  },
  {
    accountId: "hetongxue.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
        shares: "69935611425540",
        balance: "77713697406655",
        tokenBalance: "77713697406655",
        value: "0.000077690383297433",
        adjustedValue: "0.00007380586413256135",
      },
      {
        tokenId: "aurora",
        shares: "3265178165172759",
        balance: "3306458415486730",
        tokenBalance: "3306458415486730",
        value: "10.0344069347349733367",
        adjustedValue: "7.525805201051230002525",
      },
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "6678178265334274",
        balance: "7507035401212707",
        tokenBalance: "7507",
        value: "0.007507035401212707",
        adjustedValue: "0.00713168363115207165",
      },
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "10489276601664896",
        balance: "11732403781770555",
        tokenBalance: "11732",
        value: "0.01172771082025784678",
        adjustedValue: "0.011141325279244954441",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "88813499145709",
        balance: "102171437949625",
        tokenBalance: "103",
        value: "0.00010213056937444515",
        adjustedValue: "0.00010750586249941595",
      },
      {
        tokenId: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
        shares: "76398009643991",
        balance: "85927916185531",
        tokenBalance: "85927916185531",
        value: "0.00008590213781067534",
        adjustedValue: "0.00009042330295860562",
      },
      {
        tokenId: "aurora",
        shares: "1804881190882738",
        balance: "1869125739811532",
        tokenBalance: "1869125739811532",
        value: "5.67240410392263919828",
        adjustedValue: "7.56320547189685226437",
      },
    ],
    healthFactor: "99.75",
    collateralSum: "10.05371937133974132348",
    borrowedSum: "5.67259213662982431877",
    gapSum: "4.38112723470991700471",
    adjustedCollateralSum: "7.544152015825759589966",
    adjustedBorrowedSum: "7.56340340106231028594",
    adjustedGapSum: "-0.019251385236550695974",
  },
  {
    accountId:
      "0f0516783df81d1ea2873b75b50087e4bd45ac769e18d223309da431656cb6b3",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "2373377715798632387052391",
        balance: "2462033092024594053772264",
        tokenBalance: "2462033092024594053772264",
        value: "18.34362375543844045704",
        adjustedValue: "13.75771781657883034278",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "1271829919258689048057568",
        balance: "1416926471533626075909886",
        tokenBalance: "1416926471533626075909886",
        value: "10.55695236880843444117",
        adjustedValue: "14.07593649174457925489",
      },
    ],
    healthFactor: "97.74",
    collateralSum: "18.34362375543844045704",
    borrowedSum: "10.55695236880843444117",
    gapSum: "7.78667138663000601587",
    adjustedCollateralSum: "13.75771781657883034278",
    adjustedBorrowedSum: "14.07593649174457925489",
    adjustedGapSum: "-0.31821867516574891211",
  },
  {
    accountId:
      "7a1e988ab3ea3ab3ab688732f1b829500ff7e3fb54f09c0853bf75f6beab4220",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "312832958531396984942672",
        balance: "324518550525400001016214",
        tokenBalance: "324518550525400001016214",
        value: "2.41785791254454524757",
        adjustedValue: "1.8133934344084089356775",
      },
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "2247646005549080583",
        balance: "2526610920322100857",
        tokenBalance: "2526610",
        value: "2.526610920322100857",
        adjustedValue: "2.40028037430599581415",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "315152735224",
        balance: "364310965408",
        tokenBalance: "1",
        value: "0.000000364310965408",
        adjustedValue: "0.00000038348522674526",
      },
      {
        tokenId: "wrap.near",
        shares: "428882425284620089029938",
        balance: "477811421448182001127133",
        tokenBalance: "477811421448182001127133",
        value: "3.5599817766418248176",
        adjustedValue: "4.74664236885576642347",
      },
      {
        tokenId: "aurora",
        shares: "24988540324",
        balance: "25878004689",
        tokenBalance: "25878004689",
        value: "0.00007853430985013031",
        adjustedValue: "0.00010471241313350708",
      },
    ],
    healthFactor: "88.77",
    collateralSum: "4.94446883286664610457",
    borrowedSum: "3.56006067526264035591",
    gapSum: "1.38440815760400574866",
    adjustedCollateralSum: "4.2136738087144047498275",
    adjustedBorrowedSum: "4.74674746475412667581",
    adjustedGapSum: "-0.5330736560397219259825",
  },
  {
    accountId:
      "41ab7a014e3b850ad38875047a8e556abdddfd0122154791c80a1a853f8321aa",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "114139820043349510230667",
        balance: "118403409703329809791816",
        tokenBalance: "118403409703329809791816",
        value: "0.88217644433562908083",
        adjustedValue: "0.6616323332517218106225",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "61366070163736340992588",
        balance: "68367010362257458580365",
        tokenBalance: "68367010362257458580365",
        value: "0.5093752474050354209",
        adjustedValue: "0.67916699654004722787",
      },
    ],
    healthFactor: "97.42",
    collateralSum: "0.88217644433562908083",
    borrowedSum: "0.5093752474050354209",
    gapSum: "0.37280119693059365993",
    adjustedCollateralSum: "0.6616323332517218106225",
    adjustedBorrowedSum: "0.67916699654004722787",
    adjustedGapSum: "-0.0175346632883254172475",
  },
  {
    accountId:
      "fbdea5d648655e942b1c63cb42dca4b3c361056821fca6d4da9bfefc48129d31",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "87952946300826",
        balance: "98869160913034",
        tokenBalance: "98",
        value: "0.000098869160913034",
        adjustedValue: "0.0000939257028673823",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "79186728692508",
        balance: "91538452163207",
        tokenBalance: "92",
        value: "0.000091538452163207",
        adjustedValue: "0.00009635626543495474",
      },
    ],
    healthFactor: "97.48",
    collateralSum: "0.000098869160913034",
    borrowedSum: "0.000091538452163207",
    gapSum: "0.000007330708749827",
    adjustedCollateralSum: "0.0000939257028673823",
    adjustedBorrowedSum: "0.00009635626543495474",
    adjustedGapSum: "-0.00000243056256757244",
  },
  {
    accountId:
      "5e3c2c0dfa6d4c12144c51a053f0f53c17ef93d56a003c81ebb146a906a6c2f9",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "1571943849309953787629189",
        balance: "1630662388899749261177819",
        tokenBalance: "1630662388899749261177819",
        value: "12.14941319473647184533",
        adjustedValue: "9.1120598960523538839975",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "838133945224402881245818",
        balance: "933752348247611164895977",
        tokenBalance: "933752348247611164895977",
        value: "6.95701524585365174517",
        adjustedValue: "9.27602032780486899356",
      },
    ],
    healthFactor: "98.23",
    collateralSum: "12.14941319473647184533",
    borrowedSum: "6.95701524585365174517",
    gapSum: "5.19239794888282010016",
    adjustedCollateralSum: "9.1120598960523538839975",
    adjustedBorrowedSum: "9.27602032780486899356",
    adjustedGapSum: "-0.1639604317525151095625",
  },
  {
    accountId:
      "3935ad65b2f21621377e2eb8a8e268524d67569582c35228babb46f9a148a7f7",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "6056884469348448996832941",
        balance: "6283133906095427470470560",
        tokenBalance: "6283133906095427470470560",
        value: "46.81311748075459191149",
        adjustedValue: "35.1098381105659439336175",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "3218510597938011790544040",
        balance: "3585693964321897938876685",
        tokenBalance: "3585693964321897938876685",
        value: "26.71557145057673278339",
        adjustedValue: "35.62076193410231037785",
      },
    ],
    healthFactor: "98.57",
    collateralSum: "46.81311748075459191149",
    borrowedSum: "26.71557145057673278339",
    gapSum: "20.0975460301778591281",
    adjustedCollateralSum: "35.1098381105659439336175",
    adjustedBorrowedSum: "35.62076193410231037785",
    adjustedGapSum: "-0.5109238235363664442325",
  },
  {
    accountId: "dysis.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "203857100020261816216710",
        balance: "211471997462975988371376",
        tokenBalance: "211471997462975988371376",
        value: "1.57559326429764889896",
        adjustedValue: "1.18169494822323667422",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "meta-pool.near",
        shares: "87043526783329675091699",
        balance: "88429508321604001842031",
        tokenBalance: "88429508321604001842031",
        value: "0.85085988611964154532",
        adjustedValue: "1.21551412302805935046",
      },
      {
        tokenId: "wrap.near",
        shares: "6302692027556367138",
        balance: "7021733834484603924",
        tokenBalance: "7021733834484603924",
        value: "0.00005231613010721099",
        adjustedValue: "0.00006975484014294799",
      },
    ],
    healthFactor: "97.21",
    collateralSum: "1.57559326429764889896",
    borrowedSum: "0.85091220224974875631",
    gapSum: "0.72468106204790014265",
    adjustedCollateralSum: "1.18169494822323667422",
    adjustedBorrowedSum: "1.21558387786820229845",
    adjustedGapSum: "-0.03388892964496562423",
  },
  {
    accountId: "thang20091992.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
        shares: "125441638226014814018",
        balance: "139392983296798845848",
        tokenBalance: "139392983296798845848",
        value: "139.35116540180980619425",
        adjustedValue: "132.3836071317193158845375",
      },
      {
        tokenId: "wrap.near",
        shares: "491514697660517271354659",
        balance: "509874784279523888067625",
        tokenBalance: "509874784279523888067625",
        value: "3.79887306775302068044",
        adjustedValue: "2.84915480081476551033",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
        shares: "8069518172776715454",
        balance: "9076111857352724219",
        tokenBalance: "9076111857352724219",
        value: "9.07338902379551840173",
        adjustedValue: "9.55093581452159831761",
      },
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "105210040953838508999",
        balance: "121620939012892140265",
        tokenBalance: "121620940",
        value: "121.620939012892140265",
        adjustedValue: "128.02204106620225291053",
      },
    ],
    healthFactor: "98.30",
    collateralSum: "143.15003846956282687469",
    borrowedSum: "130.69432803668765866673",
    gapSum: "12.45571043287516820796",
    adjustedCollateralSum: "135.2327619325340813948675",
    adjustedBorrowedSum: "137.57297688072385122814",
    adjustedGapSum: "-2.3402149481897698332725",
  },
  {
    accountId:
      "24fa154db7ebda55b1378a0ec66c316484ef437ee086a72afdf619b618fa39c1",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "36947736915335181449781559",
        balance: "38327886183242443732328843",
        tokenBalance: "38327886183242443732328843",
        value: "285.56574879686615127209",
        adjustedValue: "214.1743115976496134540675",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "19688634395006057189791303",
        balance: "21934809710163160823189170",
        tokenBalance: "21934809710163160823189170",
        value: "163.42749322654164602925",
        adjustedValue: "217.903324302055528039",
      },
    ],
    healthFactor: "98.29",
    collateralSum: "285.56574879686615127209",
    borrowedSum: "163.42749322654164602925",
    gapSum: "122.13825557032450524284",
    adjustedCollateralSum: "214.1743115976496134540675",
    adjustedBorrowedSum: "217.903324302055528039",
    adjustedGapSum: "-3.7290127044059145849325",
  },
  {
    accountId:
      "41875482c17baf84fdc17025cf12df26e8ed8ff69dedf1fccf1fe03dfacbc229",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "30995202449896853883209202",
        balance: "32153000180997063350887282",
        tokenBalance: "32153000180997063350887282",
        value: "239.55914314853672020212",
        adjustedValue: "179.66935736140254015159",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "16266384814021789320875939",
        balance: "18122133227196123984063195",
        tokenBalance: "18122133227196123984063195",
        value: "135.02076582254744135566",
        adjustedValue: "180.02768776339658847421",
      },
    ],
    healthFactor: "99.80",
    collateralSum: "239.55914314853672020212",
    borrowedSum: "135.02076582254744135566",
    gapSum: "104.53837732598927884646",
    adjustedCollateralSum: "179.66935736140254015159",
    adjustedBorrowedSum: "180.02768776339658847421",
    adjustedGapSum: "-0.35833040199404832262",
  },
  {
    accountId:
      "da84cceeeabc04cd50ef7dcac1922f4953ed46cfd1e44632d5174e23815d0558",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "3022709784425990532423",
        balance: "3135620372309389287348",
        tokenBalance: "3135620372309389287348",
        value: "0.02336225314592833582",
        adjustedValue: "0.017521689859446251865",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "1608630091641617580414",
        balance: "1792150448136266139323",
        tokenBalance: "1792150448136266139323",
        value: "0.0133525961288840645",
        adjustedValue: "0.01780346150517875267",
      },
    ],
    healthFactor: "98.42",
    collateralSum: "0.02336225314592833582",
    borrowedSum: "0.0133525961288840645",
    gapSum: "0.01000965701704427132",
    adjustedCollateralSum: "0.017521689859446251865",
    adjustedBorrowedSum: "0.01780346150517875267",
    adjustedGapSum: "-0.000281771645732500805",
  },
  {
    accountId:
      "9c768408037e93d1a5db46d78e25a4d82c1a57cc6e248f0fd8165dab3d415158",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "1672437837646029515139",
        balance: "1880011217835907071268",
        tokenBalance: "1880011217",
        value: "1880.011217835907071268",
        adjustedValue: "1786.0106569441117177046",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "1481524240444616152341",
        balance: "1712615712907980969950",
        tokenBalance: "1712615713",
        value: "1712.61571290798096995",
        adjustedValue: "1802.753382008401021",
      },
    ],
    healthFactor: "99.07",
    collateralSum: "1880.011217835907071268",
    borrowedSum: "1712.61571290798096995",
    gapSum: "167.395504927926101318",
    adjustedCollateralSum: "1786.0106569441117177046",
    adjustedBorrowedSum: "1802.753382008401021",
    adjustedGapSum: "-16.7427250642893032954",
  },
  {
    accountId: "shenle.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "17782561989818209949",
        balance: "19989631465032892510",
        tokenBalance: "19989631",
        value: "19.98963146503289251",
        adjustedValue: "18.9901498917812478845",
      },
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "85933563405410936",
        balance: "96117902365034091",
        tokenBalance: "96117",
        value: "0.09607945520408807736",
        adjustedValue: "0.091275482443883673492",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "107278400133954466",
        balance: "124011925494990460",
        tokenBalance: "124012",
        value: "0.12401192549499046",
        adjustedValue: "0.13053886894209522105",
      },
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "15745507075236670550",
        balance: "18113700221219550890",
        tokenBalance: "18113701",
        value: "18.10645474113106306964",
        adjustedValue: "19.05942604329585586278",
      },
    ],
    healthFactor: "99.43",
    collateralSum: "20.08571092023698058736",
    borrowedSum: "18.23046666662605352964",
    gapSum: "1.85524425361092705772",
    adjustedCollateralSum: "19.081425374225131557992",
    adjustedBorrowedSum: "19.18996491223795108383",
    adjustedGapSum: "-0.108539538012819525838",
  },
  {
    accountId:
      "8d667f10800f183fce9884d5777e9c8e7c31767f9ab53467f4b73d146114a18f",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "10069220073915613015328680",
        balance: "10445346675262169995682030",
        tokenBalance: "10445346675262169995682030",
        value: "77.82409993870832376983",
        adjustedValue: "58.3680749540312428273725",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "5559238878760132994150398",
        balance: "6193463929112022752163104",
        tokenBalance: "6193463929112022752163104",
        value: "46.14502235024203671727",
        adjustedValue: "61.52669646698938228969",
      },
    ],
    healthFactor: "94.87",
    collateralSum: "77.82409993870832376983",
    borrowedSum: "46.14502235024203671727",
    gapSum: "31.67907758846628705256",
    adjustedCollateralSum: "58.3680749540312428273725",
    adjustedBorrowedSum: "61.52669646698938228969",
    adjustedGapSum: "-3.1586215129581394623175",
  },
  {
    accountId:
      "9ad21c41a160b22289502c3752f75d28b476c2283fce1ee7a47e898cf412fc30",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
        shares: "1090113220980",
        balance: "1211353232886",
        tokenBalance: "1211353232886",
        value: "0.00000121098982691613",
        adjustedValue: "0.0000011504403355703235",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "959884093619",
        balance: "1109608966513",
        tokenBalance: "2",
        value: "0.000001109608966513",
        adjustedValue: "0.00000116800943843474",
      },
    ],
    healthFactor: "98.50",
    collateralSum: "0.00000121098982691613",
    borrowedSum: "0.000001109608966513",
    gapSum: "0.00000010138086040313",
    adjustedCollateralSum: "0.0000011504403355703235",
    adjustedBorrowedSum: "0.00000116800943843474",
    adjustedGapSum: "-0.0000000175691028644165",
  },
  {
    accountId: "lennyhognon3.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "80734531292504905705646",
        balance: "83750296629188877131683",
        tokenBalance: "83750296629188877131683",
        value: "0.62398996006543464796",
        adjustedValue: "0.46799247004907598597",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "42963885231071129961805",
        balance: "47865414535396715012662",
        tokenBalance: "47865414535396715012662",
        value: "0.35662605753742676487",
        adjustedValue: "0.47550141004990235316",
      },
    ],
    healthFactor: "98.42",
    collateralSum: "0.62398996006543464796",
    borrowedSum: "0.35662605753742676487",
    gapSum: "0.26736390252800788309",
    adjustedCollateralSum: "0.46799247004907598597",
    adjustedBorrowedSum: "0.47550141004990235316",
    adjustedGapSum: "-0.00750894000082636719",
  },
  {
    accountId: "pi_314.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
        shares: "62298215991014800",
        balance: "69226887530036802",
        tokenBalance: "69226887530036802",
        value: "0.06920611946377779096",
        adjustedValue: "0.065745813490588901412",
      },
      {
        tokenId: "meta-pool.near",
        shares: "20574361209399445568787217",
        balance: "20602207946217100279638260",
        tokenBalance: "20602207946217100279638260",
        value: "198.23238463770631718065",
        adjustedValue: "138.762669246394422026455",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "meta-pool.near",
        shares: "9944090815370031942427483",
        balance: "10102429140968136181492128",
        tokenBalance: "10102429140968136181492128",
        value: "97.2045629514813095247",
        adjustedValue: "138.86366135925901360671",
      },
      {
        tokenId: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
        shares: "42008765160767",
        balance: "47248948874625",
        tokenBalance: "47248948874625",
        value: "0.00004723477418996261",
        adjustedValue: "0.00004972081493680275",
      },
      {
        tokenId: "aaaaaa20d9e0e2461697782ef11675f668207961.factory.bridge.near",
        shares: "9469693568331",
        balance: "14400896384816",
        tokenBalance: "14400896384816",
        value: "0.00000333899183578344",
        adjustedValue: "0.0000083474795894586",
      },
    ],
    healthFactor: "99.97",
    collateralSum: "198.30159075717009497161",
    borrowedSum: "97.20461352524733527075",
    gapSum: "101.09697723192275970086",
    adjustedCollateralSum: "138.828415059885010927867",
    adjustedBorrowedSum: "138.86371942755353986806",
    adjustedGapSum: "-0.035304367668528940193",
  },
  {
    accountId:
      "17f31c2e4ef704eab374d54e509d77ac013f5c545f87a2a4a299d500844765ba",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "6814599582928558491030",
        balance: "7069152781870395856788",
        tokenBalance: "7069152781870395856788",
        value: "0.05266942971660357137",
        adjustedValue: "0.0395020722874526785275",
      },
      {
        tokenId: "meta-pool.near",
        shares: "1325688235638301",
        balance: "1327482512069260",
        tokenBalance: "1327482512069260",
        value: "0.00000001277290398288",
        adjustedValue: "0.000000008941032788016",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "meta-pool.near",
        shares: "2923326635716616461049",
        balance: "2969874344629357735020",
        tokenBalance: "2969874344629357735020",
        value: "0.02857583395658921719",
        adjustedValue: "0.04082261993798459599",
      },
    ],
    healthFactor: "96.77",
    collateralSum: "0.05266944248950755425",
    borrowedSum: "0.02857583395658921719",
    gapSum: "0.02409360853291833706",
    adjustedCollateralSum: "0.0395020812284854665435",
    adjustedBorrowedSum: "0.04082261993798459599",
    adjustedGapSum: "-0.0013205387094991294465",
  },
  {
    accountId:
      "9507eae4ba5344dc1ec50391380a80e7b85940018213352d378a4d1955c98a5b",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "32279130037112759074435288",
        balance: "33484887721040458082207030",
        tokenBalance: "33484887721040458082207030",
        value: "249.48250445438403698729",
        adjustedValue: "187.1118783407880277404675",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "17066573116408297664868218",
        balance: "19013610908837596657130685",
        tokenBalance: "19013610908837596657130685",
        value: "141.66280943738539765362",
        adjustedValue: "188.88374591651386353816",
      },
    ],
    healthFactor: "99.06",
    collateralSum: "249.48250445438403698729",
    borrowedSum: "141.66280943738539765362",
    gapSum: "107.81969501699863933367",
    adjustedCollateralSum: "187.1118783407880277404675",
    adjustedBorrowedSum: "188.88374591651386353816",
    adjustedGapSum: "-1.7718675757258357976925",
  },
  {
    accountId: "microinvest.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "linear-protocol.near",
        shares: "3550378599394863070",
        balance: "3551076643721799330",
        tokenBalance: "3551076643721799330",
        value: "0.00003209960221325883",
        adjustedValue: "0.000022469721549281181",
      },
      {
        tokenId: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
        shares: "5141768752836",
        balance: "5713625045207",
        tokenBalance: "5713625045207",
        value: "0.00000571191095769344",
        adjustedValue: "0.000005426315409808768",
      },
      {
        tokenId: "meta-pool.near",
        shares: "38664222375727019",
        balance: "38716553158384040",
        tokenBalance: "38716553158384040",
        value: "0.00000037252680283466",
        adjustedValue: "0.000000260768761984262",
      },
      {
        tokenId: "aurora",
        shares: "38128576976372230",
        balance: "38610620259182469",
        tokenBalance: "38610620259182469",
        value: "117.17512425636436509651",
        adjustedValue: "87.8813431922732738223825",
      },
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "25436329313750",
        balance: "28450892999392",
        tokenBalance: "28",
        value: "0.00002843951264219224",
        adjustedValue: "0.000027017537010082628",
      },
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "93977532945378",
        balance: "105641484654838",
        tokenBalance: "105",
        value: "0.000105641484654838",
        adjustedValue: "0.0001003594104220961",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "8293875631102578719515737",
        balance: "9240081362582409228172994",
        tokenBalance: "9240081362582409228172994",
        value: "68.84415020005649819543",
        adjustedValue: "91.79220026674199759391",
      },
    ],
    healthFactor: "95.74",
    collateralSum: "117.17529652140163591368",
    borrowedSum: "68.84415020005649819543",
    gapSum: "48.33114632134513771825",
    adjustedCollateralSum: "87.8814987260264270753215",
    adjustedBorrowedSum: "91.79220026674199759391",
    adjustedGapSum: "-3.9107015407155705185885",
  },
  {
    accountId:
      "5ad67e00f74efa118cd6f37f67fa8038704107c4ccdee19bfe2e5eae02eb24e4",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "124675177247157162963208386",
        balance: "129332305639030447447363314",
        tokenBalance: "129332305639030447447363314",
        value: "963.60327639416025175133",
        adjustedValue: "722.7024572956201888134975",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "65947336267718436551863239",
        balance: "73470929618737557746780358",
        tokenBalance: "73470929618737557746780358",
        value: "547.40250821736604774816",
        adjustedValue: "729.87001095648806366421",
      },
    ],
    healthFactor: "99.02",
    collateralSum: "963.60327639416025175133",
    borrowedSum: "547.40250821736604774816",
    gapSum: "416.20076817679420400317",
    adjustedCollateralSum: "722.7024572956201888134975",
    adjustedBorrowedSum: "729.87001095648806366421",
    adjustedGapSum: "-7.1675536608678748507125",
  },
  {
    accountId:
      "9f55587c7839017879a95196b719b8529fde49007cc65412e3b194de02f68c72",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "46434726529009397879548",
        balance: "48169253706447617693875",
        tokenBalance: "48169253706447617693875",
        value: "0.35888984166525862039",
        adjustedValue: "0.2691673812489439652925",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "meta-pool.near",
        shares: "31897067870070",
        balance: "32404960286965",
        tokenBalance: "32404960286965",
        value: "0.00000000031179728739",
        adjustedValue: "0.00000000044542469627",
      },
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "961601533145",
        balance: "1106230610449",
        tokenBalance: "2",
        value: "0.00000110578811820482",
        adjustedValue: "0.00000116398749284718",
      },
      {
        tokenId: "linear-protocol.near",
        shares: "22507556569768570000645",
        balance: "22604653256678117030766",
        tokenBalance: "22604653256678117030766",
        value: "0.20433250264841617109",
        adjustedValue: "0.29190357521202310156",
      },
    ],
    healthFactor: "92.21",
    collateralSum: "0.35888984166525862039",
    borrowedSum: "0.2043336087483316633",
    gapSum: "0.15455623291692695709",
    adjustedCollateralSum: "0.2691673812489439652925",
    adjustedBorrowedSum: "0.29190473964494064501",
    adjustedGapSum: "-0.0227373583959966797175",
  },
  {
    accountId: "salamandre.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "meta-pool.near",
        shares: "17777930180597126",
        balance: "17801992037870029",
        tokenBalance: "17801992037870029",
        value: "0.00000017128898718918",
        adjustedValue: "0.000000119902291032426",
      },
      {
        tokenId: "wrap.near",
        shares: "581576242048583503",
        balance: "603300496135779406",
        tokenBalance: "603300496135779406",
        value: "0.00000449495067650924",
        adjustedValue: "0.00000337121300738193",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "65500125374547285",
        balance: "72972698728508348",
        tokenBalance: "72972698728508348",
        value: "0.00000054369038914662",
        adjustedValue: "0.00000072492051886216",
      },
      {
        tokenId: "meta-pool.near",
        shares: "202781139529174610",
        balance: "206009994403096061",
        tokenBalance: "206009994403096061",
        value: "0.00000198220756514715",
        adjustedValue: "0.00000283172509306736",
      },
    ],
    healthFactor: "98.16",
    collateralSum: "0.00000466623966369842",
    borrowedSum: "0.00000252589795429377",
    gapSum: "0.00000214034170940465",
    adjustedCollateralSum: "0.000003491115298414356",
    adjustedBorrowedSum: "0.00000355664561192952",
    adjustedGapSum: "-0.000000065530313515164",
  },
  {
    accountId: "blissedkong.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "2975026832107036512781512",
        balance: "3086156266468489868877322",
        tokenBalance: "3086156266468489868877322",
        value: "22.99371587895013061706",
        adjustedValue: "17.245286909212597962795",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "1571622843290919026198755",
        balance: "1750921232631344243381527",
        tokenBalance: "1750921232631344243381527",
        value: "13.04541373584309341974",
        adjustedValue: "17.39388498112412455965",
      },
    ],
    healthFactor: "99.15",
    collateralSum: "22.99371587895013061706",
    borrowedSum: "13.04541373584309341974",
    gapSum: "9.94830214310703719732",
    adjustedCollateralSum: "17.245286909212597962795",
    adjustedBorrowedSum: "17.39388498112412455965",
    adjustedGapSum: "-0.148598071911526596855",
  },
  {
    accountId: "tusya.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "1435363587737800433947798",
        balance: "1488980295287075116668449",
        tokenBalance: "1488980295287075116668449",
        value: "11.09379658806588186425",
        adjustedValue: "8.3203474410494113981875",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "796337998970144646243247",
        balance: "887188116856535091506802",
        tokenBalance: "887188116856535091506802",
        value: "6.61008378345130035278",
        adjustedValue: "8.81344504460173380371",
      },
    ],
    healthFactor: "94.41",
    collateralSum: "11.09379658806588186425",
    borrowedSum: "6.61008378345130035278",
    gapSum: "4.48371280461458151147",
    adjustedCollateralSum: "8.3203474410494113981875",
    adjustedBorrowedSum: "8.81344504460173380371",
    adjustedGapSum: "-0.4930976035523224055225",
  },
  {
    accountId:
      "05fa4595ad715619d0f4a2f1f88610389933c67009e0b103a25d32317c403e36",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "1935383769505556812513",
        balance: "2175592488752389646667",
        tokenBalance: "2175592488",
        value: "2175.592488752389646667",
        adjustedValue: "2066.81286431477016433365",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "1703936360426845938876",
        balance: "1969720173992214778644",
        tokenBalance: "1969720174",
        value: "1969.720173992214778644",
        adjustedValue: "2073.38965683391029330947",
      },
    ],
    healthFactor: "99.68",
    collateralSum: "2175.592488752389646667",
    borrowedSum: "1969.720173992214778644",
    gapSum: "205.872314760174868023",
    adjustedCollateralSum: "2066.81286431477016433365",
    adjustedBorrowedSum: "2073.38965683391029330947",
    adjustedGapSum: "-6.57679251914012897582",
  },
  {
    accountId:
      "9345b3ac35a96e9c9efc6effa5ed50e92ff59a5b31e7b4f2d6f19400c3232899",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "linear-protocol.near",
        shares: "756351868593737206",
        balance: "756500575869949801",
        tokenBalance: "756500575869949801",
        value: "0.00000683831130551882",
        adjustedValue: "0.000004786817913863174",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "linear-protocol.near",
        shares: "369777929477420130",
        balance: "371373136479709975",
        tokenBalance: "371373136479709975",
        value: "0.00000335699032989469",
        adjustedValue: "0.00000479570047127813",
      },
    ],
    healthFactor: "99.81",
    collateralSum: "0.00000683831130551882",
    borrowedSum: "0.00000335699032989469",
    gapSum: "0.00000348132097562413",
    adjustedCollateralSum: "0.000004786817913863174",
    adjustedBorrowedSum: "0.00000479570047127813",
    adjustedGapSum: "-0.000000008882557414956",
  },
  {
    accountId:
      "710e337fc96fbd0da739eb802b03a4dcb4b51a8317d99cd42e39f311623ecda4",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "19277425535349486902989752",
        balance: "19997516316571506356107306",
        tokenBalance: "19997516316571506356107306",
        value: "148.99349506824766525681",
        adjustedValue: "111.7451213011857489426075",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "aaaaaa20d9e0e2461697782ef11675f668207961.factory.bridge.near",
        shares: "667246227586790",
        balance: "1014704828334823",
        tokenBalance: "1014704828334823",
        value: "0.00023526946149771206",
        adjustedValue: "0.00058817365374428015",
      },
      {
        tokenId: "wrap.near",
        shares: "10680507370065941571610804",
        balance: "11898991675614358648815519",
        tokenBalance: "11898991675614358648815519",
        value: "88.65462737833234054886",
        adjustedValue: "118.20616983777645406515",
      },
    ],
    healthFactor: "94.53",
    collateralSum: "148.99349506824766525681",
    borrowedSum: "88.65486264779383826092",
    gapSum: "60.33863242045382699589",
    adjustedCollateralSum: "111.7451213011857489426075",
    adjustedBorrowedSum: "118.2067580114301983453",
    adjustedGapSum: "-6.4616367102444494026925",
  },
  {
    accountId:
      "a2254578818ad84ccabf9e85cb661833db3f08c980509e7fd0e3ba408f97252c",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "557369384720507",
        balance: "623425515931200",
        tokenBalance: "623",
        value: "0.00062317614572482752",
        adjustedValue: "0.000592017338438586144",
      },
      {
        tokenId: "linear-protocol.near",
        shares: "573779011190046433757",
        balance: "573891822590989582631",
        tokenBalance: "573891822590989582631",
        value: "0.00518763774112899123",
        adjustedValue: "0.003631346418790293861",
      },
      {
        tokenId: "meta-pool.near",
        shares: "18097400311927149334331",
        balance: "18121894561757843724488",
        tokenBalance: "18121894561757843724488",
        value: "0.17436705728377779653",
        adjustedValue: "0.122056940098644457571",
      },
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "413245810696846149",
        balance: "464535507596065463",
        tokenBalance: "464535",
        value: "0.464535507596065463",
        adjustedValue: "0.44130873221626218985",
      },
      {
        tokenId: "wrap.near",
        shares: "450126053303513958668310",
        balance: "466940104576975949298377",
        tokenBalance: "466940104576975949298377",
        value: "3.47898394316121700784",
        adjustedValue: "2.60923795737091275588",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "aurora",
        shares: "106137169764544",
        balance: "109915110734037",
        tokenBalance: "109915110734037",
        value: "0.33356927890454814723",
        adjustedValue: "0.44475903853939752964",
      },
      {
        tokenId: "wrap.near",
        shares: "28879873122861573793603",
        balance: "32174629722633398915702",
        tokenBalance: "32174629722633398915702",
        value: "0.23972029621145240196",
        adjustedValue: "0.31962706161526986928",
      },
      {
        tokenId: "4691937a7508860f876c9c0a2a617e7d9e945d4b.factory.bridge.near",
        shares: "1571523306182418513",
        balance: "1951843871121332013",
        tokenBalance: "1951843871121332013",
        value: "0.58906648030441800152",
        adjustedValue: "1.17813296060883600304",
      },
      {
        tokenId: "aaaaaa20d9e0e2461697782ef11675f668207961.factory.bridge.near",
        shares: "44435012684856336",
        balance: "67573888100518417",
        tokenBalance: "67573888100518417",
        value: "0.01566768169498620017",
        adjustedValue: "0.03916920423746550043",
      },
      {
        tokenId: "meta-pool.near",
        shares: "111900019245257801351043",
        balance: "113681787132403796737739",
        tokenBalance: "113681787132403796737739",
        value: "1.09383478760927609183",
        adjustedValue: "1.56262112515610870261",
      },
    ],
    healthFactor: "89.63",
    collateralSum: "4.12369732192791408612",
    borrowedSum: "2.27185852472468084271",
    gapSum: "1.85183879720323324341",
    adjustedCollateralSum: "3.176826993443048283306",
    adjustedBorrowedSum: "3.544309390157077605",
    adjustedGapSum: "-0.367482396714029321694",
  },
  {
    accountId:
      "f3ff09992bcdb90a76b0f48cc6575924c1592bd7d1c67c6891cdf77f71009318",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "usdt.tether-token.near",
        shares: "53380689541324958381",
        balance: "55216941062201396132",
        tokenBalance: "55216941",
        value: "55.19485428577651557355",
        adjustedValue: "52.4351115714876897948725",
      },
      {
        tokenId: "wrap.near",
        shares: "4985949935804516938418483",
        balance: "5172195582445644629294679",
        tokenBalance: "5172195582445644629294679",
        value: "38.53596040656951987502",
        adjustedValue: "28.901970304927139906265",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "usdt.tether-token.near",
        shares: "28640280321737028580",
        balance: "30010379401094698299",
        tokenBalance: "30010380",
        value: "29.99837524933426041968",
        adjustedValue: "31.57723710456237938914",
      },
      {
        tokenId: "wrap.near",
        shares: "4646853952969711917714609",
        balance: "5176989686758757389974644",
        tokenBalance: "5176989686758757389974644",
        value: "38.57167936016479780975",
        adjustedValue: "51.42890581355306374633",
      },
    ],
    healthFactor: "97.99",
    collateralSum: "93.73081469234603544857",
    borrowedSum: "68.57005460949905822943",
    gapSum: "25.16076008284697721914",
    adjustedCollateralSum: "81.3370818764148297011375",
    adjustedBorrowedSum: "83.00614291811544313547",
    adjustedGapSum: "-1.6690610417006134343325",
  },
  {
    accountId:
      "156c476ecaf01363ad30347e7fb2ebab45744fe649bcf23bf7333c5b31f566c6",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
        shares: "97830194596059650",
        balance: "109972316545129991",
        tokenBalance: "109972",
        value: "0.109972316545129991",
        adjustedValue: "0.10447370071787349145",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "aurora",
        shares: "1752710986733",
        balance: "1815098542942",
        tokenBalance: "1815098542942",
        value: "0.00550844290713495218",
        adjustedValue: "0.00734459054284660291",
      },
      {
        tokenId: "wrap.near",
        shares: "9645601279283795639796",
        balance: "10746018456966289561549",
        tokenBalance: "10746018456966289561549",
        value: "0.08006428511547303701",
        adjustedValue: "0.10675238015396404935",
      },
    ],
    healthFactor: "91.57",
    collateralSum: "0.109972316545129991",
    borrowedSum: "0.08557272802260798919",
    gapSum: "0.02439958852252200181",
    adjustedCollateralSum: "0.10447370071787349145",
    adjustedBorrowedSum: "0.11409697069681065226",
    adjustedGapSum: "-0.00962326997893716081",
  },
  {
    accountId:
      "dcd48a45a6a5f26a220d51d65bdffddaf95f371641cbc972bf21a9967a5e1120",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "aurora",
        shares: "488184436",
        balance: "494356342",
        tokenBalance: "494356342",
        value: "0.00000150026768313818",
        adjustedValue: "0.000001125200762353635",
      },
      {
        tokenId: "wrap.near",
        shares: "60907",
        balance: "63182",
        tokenBalance: "63182",
        value: "0.00000000000000000047",
        adjustedValue: "0.0000000000000000003525",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "aurora",
        shares: "271124280",
        balance: "280774920",
        tokenBalance: "280774920",
        value: "0.0000008520929194668",
        adjustedValue: "0.0000011361238926224",
      },
      {
        tokenId: "wrap.near",
        shares: "719",
        balance: "802",
        tokenBalance: "802",
        value: "0.00000000000000000001",
        adjustedValue: "0.00000000000000000001",
      },
    ],
    healthFactor: "99.04",
    collateralSum: "0.00000150026768313865",
    borrowedSum: "0.00000085209291946681",
    gapSum: "0.00000064817476367184",
    adjustedCollateralSum: "0.0000011252007623539875",
    adjustedBorrowedSum: "0.00000113612389262241",
    adjustedGapSum: "-0.0000000109231302684225",
  },
  {
    accountId:
      "7a9477e5fee5ff1de0e10214faf0c10a26333a2f447277f234a84856dc5b6460",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "aurora",
        shares: "273491694529630",
        balance: "276949332991566",
        tokenBalance: "276949332991566",
        value: "0.84048306626947458114",
        adjustedValue: "0.630362299702105935855",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
        shares: "595759300067449073",
        balance: "685364105065708186",
        tokenBalance: "685365",
        value: "0.68508995942368190273",
        adjustedValue: "0.72114732570913884498",
      },
    ],
    healthFactor: "87.41",
    collateralSum: "0.84048306626947458114",
    borrowedSum: "0.68508995942368190273",
    gapSum: "0.15539310684579267841",
    adjustedCollateralSum: "0.630362299702105935855",
    adjustedBorrowedSum: "0.72114732570913884498",
    adjustedGapSum: "-0.090785026007032909125",
  },
  {
    accountId: "willstan.near",
    position: "REGULAR",
    collateralAssets: [
      {
        tokenId: "wrap.near",
        shares: "249676503158811521760434",
        balance: "259002942930695258821493",
        tokenBalance: "259002942930695258821493",
        value: "1.92972732659943809538",
        adjustedValue: "1.447295494949578571535",
      },
    ],
    borrowedAssets: [
      {
        tokenId: "wrap.near",
        shares: "131722631518116059120617",
        balance: "146750190942886227216092",
        tokenBalance: "146750190942886227216092",
        value: "1.0933769726390681245",
        adjustedValue: "1.45783596351875749933",
      },
    ],
    healthFactor: "99.28",
    collateralSum: "1.92972732659943809538",
    borrowedSum: "1.0933769726390681245",
    gapSum: "0.83635035396036997088",
    adjustedCollateralSum: "1.447295494949578571535",
    adjustedBorrowedSum: "1.45783596351875749933",
    adjustedGapSum: "-0.010540468569178927795",
  },
];
export async function getLiquidations(): Promise<ILiquidationResponse> {
  const defaultResponse: ILiquidationResponse = {
    timestamp: 0,
    data: [],
  };
  try {
    const liquidationsResponse = await fetch(
      `${LIQUIDATION_API_URL}/liquidation/liquidatable-list-quick`
    );
    const liquidationsData = await liquidationsResponse.json();

    const parsedData = JSON.parse(liquidationsData.data);
    return {
      timestamp: parsedData.timestamp,
      data: parsedData.data,
    };
  } catch (error) {
    console.error("Error fetching liquidations:", error);
    return defaultResponse;
  }
}
export async function getLiquidationDetail(
  accountId: string,
  position: string
): Promise<ILiquidation[]> {
  const liquidationDetail = await fetch(
    `${LIQUIDATION_API_URL}/liquidation/account/${accountId}/${position}`
  )
    .then((res) => res.json())
    .catch(() => {
      return {};
    });
  try {
    return liquidationDetail.data;
  } catch (error) {
    return [];
  }
}

export async function calcByRepayRatio(
  accountId: string,
  position: string,
  selectedCollateralTokenId: string,
  selectedBorrowedTokenId: string,
  repayRatio: number
): Promise<any> {
  const requestData = {
    accountId: accountId,
    position: position,
    collateralToken: selectedCollateralTokenId,
    borrowedToken: selectedBorrowedTokenId,
    repayRatio: repayRatio,
  };

  try {
    const response = await fetch(
      `${LIQUIDATION_API_URL}/liquidation/calc-by-repay-ratio`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    return { error };
  }
}

export async function calcByHealthFactor(
  accountId: string,
  position: string,
  selectedCollateralTokenId: string,
  selectedBorrowedTokenId: string,
  repayValue: number,
  targetHealthFactor: number
): Promise<any> {
  const requestData = {
    accountId: accountId,
    position: position,
    collateralToken: selectedCollateralTokenId,
    borrowedToken: selectedBorrowedTokenId,
    repayValue: repayValue,
    targetHealthFactor: targetHealthFactor,
  };

  try {
    const response = await fetch(
      `${LIQUIDATION_API_URL}/liquidation/generate-liquidation-command`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    return { error };
  }
}

export async function getDemoLiquidations() {
  return liquidations;
}

export async function getHistoryData(
  page_number = 1,
  page_size = 10,
  sort = "timestamp",
  order = "desc",
  liquidation_type = "all"
) {
  const defaultResponse = {
    data: [],
  };
  try {
    const liquidationsResponse = await fetch(
      `${HISTORY_API_URL}/burrow/get_burrow_liquidate_record_page?page_number=${page_number}&page_size=${page_size}&sort=${sort}&order=${order}&liquidation_type=${liquidation_type}`
    );
    const liquidationsData = await liquidationsResponse.json();
    return {
      data: liquidationsData,
    };
  } catch (error) {
    console.error("Error fetching liquidations:", error);
    return defaultResponse;
  }
}

export const getTxId = async (receipt_id: string) => {
  return await fetch(
    `https://api3.nearblocks.io/v1/search/?keyword=${receipt_id}`
  )
    .then(async (res) => {
      const data = await res.json();
      return data;
    })
    .catch(() => {
      return [];
    });
};

export const getPerice = async () => {
  return await fetch(`https://api.ref.finance/list-token-price`)
    .then(async (res) => {
      const data = await res.json();
      return data;
    })
    .catch(() => {
      return [];
    });
};

export const getLiquidationResult = async (key: string) => {
  return await fetch(
    `${LIQUIDATION_RESULT_API_URL}/get-liquidation-result?key=${key}`
  )
    .then(async (res) => {
      const data = await res.json();
      return data;
    })
    .catch(() => {
      return [];
    });
};

export const getDashBoardData = async () => {
  return await fetch(
    `${DASH_BOARD_API_URL}/api/v1/mining/dashboard/infos?page_count=1&page_size=30`
  )
    .then(async (res) => {
      const data = await res.json();
      return data;
    })
    .catch(() => {
      return [];
    });
};

export const getSocialDashBoardData = async () => {
  return await fetch(`${DASH_BOARD_API_URL}/api/v1/mining/socialdashboard/info`)
    .then(async (res) => {
      const data = await res.json();
      return data;
    })
    .catch(() => {
      return [];
    });
};
