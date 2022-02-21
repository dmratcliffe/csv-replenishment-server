var count = 0;

/**
 * Name: Replenishment server backend
 * Author: Devin Ratcliffe
 * Date: Aug 2020
 * Last Worked on: ???
 * Description: This is the backend for the replen server.
 * Designed to work with CEGID export CSVs, it allows staff
 * to more easily replen the store, including manual replenishment.
 * 
 * Below is features/notes for backend (this file):
 *  *Should make the console logs toggle able / use proper logger
 *  *Move the "sections" to files if they get any more advanced
 *      - or well, in general make sure this file stays manageable.
 *  FINISHED ON 10/18, SEEMS BUG FREE.
 *  ||*replen "throughout the day"
 *  ||    - keep track of the last added replen list
 *  ||    - compare incoming lists against that, add the differences
 *  ||    - no changes on the frontend should be needed
 *  ||    - changes on backend: maybe a way to signel a list type, if we apply above logic
 *  ||        for all imports it would probably mess up the master list functionality
 *  ||*manual replen functionality
 *  ||    - frontend barcode scanner
 *  ||    - backend barcode search + size finder
 * 
 * Below is features for the whole app:
 * Future Features:
 *  *cycle counting feature
 *      - ability to count backroom stock, front store stock, and (optionally) offsite
 *      - export this list into excel
 *      - highlight descrepencies
 *      - offline cacheing for when at offsite (investigate if possible)
 *  *export lists
 */

const express = require("express"); //dependencies for basic webserver stuff
const bodyParser = require("body-parser");
const cors = require('cors');


const path = require('path'); //used for building assets into exe


process.on('uncaughtException', function (err) { fs.appendFileSync('errors.log', (new Date()).toGMTString() + " " + err + "\n"); });

const fs = require('fs'); //used for opening config, deletion, and creating filetree
const config_ini = require('config.ini'); //used to parse our config

const chokidar = require('chokidar'); //file watching
const csv_parser = require('csv-parser'); //csv opening

const ip = require('ip'); //allows easy printing the weburl
var QRCode = require('qrcode'); //allows easy createion of terminal QR codes and images
const { S_IFDIR } = require("constants");

const PORT = 3000; //Configuration of server hosting //TODO: Make this 80?
const HOST_LOCATION = `http://${ip.address()}:${PORT}`; //TODO: when ssl is a thing, make this 'https'

const app = express();

//setup all of our express stuff
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'static'))) //note: this path.join is for building with pkg mainly.

//sometimes it seems the browser caches the list. This is intended to stop that. Pretty sure it works.
//This doesn't effect the static you see above, so don't worry about that!
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
});

///////////////////////////////////////////////////////////////////////////
//check if config extistss
//  if it do load
//  if it don't load default
///////////////////////////////////////////////////////////////////////////

const CONFIG_PATH = './config.ini';
var config = {};


if (fs.existsSync(CONFIG_PATH)) {
    console.log("Found config!");
    config = config_ini.load(CONFIG_PATH);
} else {
    console.log("Didn't find config! Using defaults...");
    //TODO: Create defaults!
} 


//setup the list types
config.types = {};
config.lists.list.forEach(list_name => {
    config.types[list_name] = config[list_name].type;
    delete config[list_name].type;
});

console.log("Config Loaded: ", config);

///////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////
//read lists and setup watchers, create folders if they don't exist!
//  should read lists into "lists" object, named with the folder name from
//   the listings in the config
///////////////////////////////////////////////////////////////////////////

var basepath = config.lists.basepath;
var lists = config.lists["list"];

if (!fs.existsSync(basepath))
    fs.mkdirSync(basepath);

var inv_lists = {};
var replen_lists = {};

lists.forEach(list_name => {
    var full_path = basepath + list_name;

    if (!fs.existsSync(full_path)) {
        fs.mkdirSync(full_path);
        console.log("Made a folder @ " + full_path);
    }

    if (inv_lists[list_name] === undefined)
        inv_lists[list_name] = [];

    chokidar.watch(full_path + "/*.csv") //NOTE: Force only CSV files.
        .on('add', (path) => {
            console.log("Found a list!: ", path);

            const INTERVAL_LENGTH = config.general.filereadtimer < 500 ? 500 : config.general.filereadtimer;
            //Accept nothing lower then half a second. Just in case someone messes up config.

            var try_counter = 0;
            var done_with_read = 0;
            var try_read = setInterval(() => {
                try_counter++;


                if (!done_with_read) {
                    //This is for replen history (allowing multuple replens in a day)
                    //Cegid is literally trash, so 
                    var todays_date = new Date();
                    var todays_date = todays_date.getMonth() + "" + todays_date.getDate() + "" + todays_date.getFullYear() + ""

                    if (replen_lists[todays_date] === undefined)
                        replen_lists[todays_date] = {}

                    var current_replen_list = JSON.parse(JSON.stringify(replen_lists)) || {};

                    console.log(`Going to attempt to read ${path}! Try number: ${try_counter}`);

                    fs.createReadStream(path)
                        .pipe(csv_parser())
                        .on('data', (data) => {
                            var item_obj = {};
                            //generate item_obj with key names matching the config.ini
                            Object.keys(config[list_name]).forEach(key => {
                                item_obj[key] = data[config[list_name][key]]
                            })



                            //hey! this is getting complicated... maybe think about moving it to a list manager?
                            //Maybe a class with list functions such as adding and removeing, and then simplifying it down to
                            // list_name.add()
                            //the add that then handles all this bullshit!
                            //the init for the list could be somewhere above, when we init the folder watchers.

                            //note: there could be a way to signel what list is replen, etc.
                            //TODO: Decide if this should be here (removes anything we don't have more of, mainly for the replen list)
                            switch (config.types[list_name]) {
                                case 1:
                                    if (item_obj.inventory > 0) { //if theres none, we can't replen lol

                                        var item_as_string = item_obj.code;

                                        //check to see if in the replen list for the day:
                                        //does the item exist?
                                        //if so, is the amount bigger then 0?
                                        //if so, we don't need to add it again.
                                        //if not, it's time to add it! (we've reached a new portion of the replen list)
                                        //understanding this, you need to think about how cegid generates lists
                                            //the "list of items sold" is a rolling list of items with reference to their reciepts.
                                            //as far as i can tell, theres no easy way to see total items sold,
                                            //this essentially does that, so detecting the need to add a "new" item is as simple as counting down
                                            //from the last import and 'comparing' it to the new import.
                                            //this was the way I came up with after thinking on it for a bit, there might be a better way. This method
                                            //has a lot going on and I'm not super happy with it.

                                        if (current_replen_list[todays_date][item_as_string] !== undefined && current_replen_list[todays_date][item_as_string] > 0) {
                                            current_replen_list[todays_date][item_as_string] -= 1;
                                        } else {

                                            //if this is a 100% new item, create a 0'd definition for it
                                            if (replen_lists[todays_date][item_as_string] == undefined)
                                                replen_lists[todays_date][item_as_string] = 0;

                                            //add one to count the total items
                                            replen_lists[todays_date][item_as_string] += 1;

                                            if(item_obj.code == undefined){
                                                item_obj.code = count
                                                count++;
}
                                            //check if item already exists in list, if not then add it
                                            if (inv_lists[list_name].filter(obj => obj.code === item_obj.code).length === 0)
                                                inv_lists[list_name].push(item_obj);

                                            console.log(`   New item: ${item_obj.name} ${item_obj.code} ${item_obj.left}`);
                                        }
                                    }
                                    break;
                                case 0:
                                default:
                                    // console.log(`Error, invalid list type! Check the config! (${config.types[list_name]})`)
                                    inv_lists[list_name].push(item_obj);
                                    break;
                            }

                        })
                        .on('end', () => {
                            console.log(`Finished reading '${path}'... (it was imported into '${list_name}')`);
                            done_with_read = 1;
                        })
                } else {
                    try {
                        console.log(`Going to attempt to delete ${path}! Try number: ${try_counter - 1}`);
                        fs.unlinkSync(path);
                        clearInterval(try_read);
                        console.log(`Successfully removed ${path}!`);
                    } catch (err) {
                        if (err.code == "ENOENT")
                            clearInterval(try_read);
                        else
                            console.log("Error: Failed Deletion:", err.code)
                    }
                }
            }
                , INTERVAL_LENGTH);

        })
});

///////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////
//generic routes to list / delete / add
//Not sure if we need a modify yet...
///////////////////////////////////////////////////////////////////////////

app.get('/listing/:name', (req, res) => {
    var list_name = req.params.name;

    var selected_list = inv_lists[list_name];
    res.json(selected_list);

    console.log(`Got a request for /listing/${list_name}... Returning a list with ${selected_list.length} items!`);
});


//TODO: create a 'remove if contains'? Such as "Remove if contains ITEM_CODE" etc...
app.post('/removefrom/:name', (req, res) => {
    var list_name = req.params.name
    var obj = req.body.item;

    var did_delete = false;

    inv_lists[list_name] = inv_lists[list_name].filter(list_obj => {
        //TODO: Should this filter more dynamically? Right now, if we do any manipulation of the item on front end, this breaks.
        if (JSON.stringify(list_obj) === JSON.stringify(obj)) { //TODO: change this to .code instead of json stringifying, should be faster but not sure if it breaks shit
            did_delete = true;
            return false;
        } else {
            return true;
        }
    })

    res.sendStatus(200);

    console.log(`Got a request for /removefrom/${list_name}... We (${did_delete ? "did" : "didn't"}) delete ${JSON.stringify(obj)}!`);
});


app.post('/addto/:name', (req, res) => {
    var list_name = req.params.name
    var obj = req.body.item;

    var did_add = false

    if (inv_lists[list_name].filter(list_obj => JSON.stringify(list_obj) === JSON.stringify(obj)).length === 0) {
        did_add = true
        inv_lists[list_name].push(obj);
    }

    res.sendStatus(200);

    console.log(`Got a request for /addto/${list_name}... We (${did_add ? "did" : "didn't"}) add ${JSON.stringify(obj)}!`);
});

app.post('/getsizes/:name', (req, res)=>{
    var list_name = req.params.name;
    var code = req.body.code;

    var item = inv_lists[list_name].find(obj => obj.code == code);

    if(item != undefined){
        var item_no_size = item.name.slice(0, item.name.lastIndexOf(" "));
        res.send(inv_lists[list_name].filter(obj => obj.name.includes(item_no_size)));
    }else{
        res.send([]);
    }
})

///////////////////////////////////////////////////////////////////////////



app.listen(PORT, () => { //start server, //TODO: need an SSL cert!
    console.log("===========================================================")
    console.log("Ready on " + PORT, ", Connect @ ", HOST_LOCATION, "\n")

    if (config.qr.console)
        QRCode.toString(HOST_LOCATION, { type: 'terminal' }, function (err, url) {
            console.log(url);
        });

    if (config.qr.file) {
        console.log("Dropping a QRCode -> ./qrcode.jpg\n");
        QRCode.toFile('qrcode.jpg', HOST_LOCATION)
    }
});