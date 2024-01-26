const mysql = require('mysql2/promise');
const http = require('http');

const port = process.env.PORT || 3000;
const is_qoddi = process.env.IS_QODDI || false;

const dbConfig = {
	host: "sql.freedb.tech",
	user: "freedb_2350_main.",
	password: "kXy@3H$c5M&W5eq",
	database: "freedb_COMP2350_week3_A01342823",
	multipleStatements: false
};

const qoddiDbConfig = {
    host: "sql.freedb.tech",
    user: "freedb_2350_main.",
    password: "kXy@3H$c5M&W5eq",
    database: "freedb_COMP2350_week3_A01342823",
    multipleStatements: false
};

const databaseConfig = is_qoddi ? qoddiDbConfig : dbConfig;
var database = mysql.createPool(databaseConfig);


async function printMySQLVersion() {
  let sqlQuery = `
      SHOW VARIABLES LIKE 'version';
    `;
    
	try {
			const results = await database.query(sqlQuery);
			console.log("Successfully connected to MySQL");
			console.log(results[0]);
			return true;
	} 
	catch (err) {
			console.log("Error getting version from MySQL");
			return false;
	}
}

http.createServer(function(req, res) {
	console.log("page hit");
	const success = printMySQLVersion();
	
	if (success) {
		//Send an HTTP Status code of 200 for success!
		res.writeHead(200, {'Content-Type': 'text/html'});
		if (is_qoddi) {
			//write the HTML
			res.end(`<!doctype html><html><head></head><body>
			<div>Running on Qoddi</div>
			<div>Connected to the database, check the Qoddi logs for the results.</div>
			</body></html>`);
		}
		else {
			//write the HTML
			res.end(`<!doctype html><html><head></head><body>
			<div>Running on localhost</div>
			<div>Connected to the database, check the Qoddi logs for the results.</div>
			</body></html>`);
		}
	}
	else {
		//Send an HTTP Status code of 500 for server error.
		res.writeHead(500, {'Content-Type': 'text/html'});
		//write the HTML
		res.end(`<!doctype html><html><head></head><body>
		<div>Database error, check the Qoddi logs for the details.</div>
		</body></html>`);
		console.log("Error connecting to mysql");
	}
}).listen(port);
